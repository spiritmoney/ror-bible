/**
 * Packaged Electron app (CDP 9222): sidebar rail centering measurement, rail crops,
 * and top-bar 68px strip parity vs git HEAD screenshots.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createRequire } from 'module';
import WebSocket from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const shotsDir = path.join(repoRoot, 'docs', 'electron', 'shots', 'nav');
const reportPath = path.join(repoRoot, 'docs', 'electron', 'nav-centering-report.json');
/** Git ref for top-bar strip baseline (sidebar-only work should not change Header). */
const TOP_BAR_BASELINE_REF =
  process.env.NAV_TOP_BAR_BASELINE_REF || '6c33563';

/** pngjs + pixelmatch live next to compare.mjs (same as parity tooling). */
const parityModules = 'C:/temp/parity/node_modules';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.on('message', raw => {
    const msg = JSON.parse(String(raw));
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  const ready = new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
  });
  return {
    ready,
    send(method, params = {}) {
      return ready.then(
        () =>
          new Promise((resolve, reject) => {
            const mid = ++id;
            pending.set(mid, { resolve, reject });
            ws.send(JSON.stringify({ id: mid, method, params }));
          })
      );
    },
    close() {
      ws.close();
    },
  };
}

async function getPageWs() {
  const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const page = list.find(
    t =>
      t.type === 'page' &&
      !/devtools/i.test(t.url) &&
      (t.url.startsWith('app://') || /Rhapsody Bible/i.test(t.title || ''))
  );
  if (!page) throw new Error('no CDP page');
  return page.webSocketDebuggerUrl;
}

async function evalJs(cdp, expression) {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.value;
}

async function prepReader(cdp) {
  await cdp.send('Page.bringToFront');
  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(2500);
  const splash = await evalJs(
    cdp,
    `!!document.querySelector('button[aria-label="Skip splash screen"]')`
  );
  if (splash) {
    await evalJs(
      cdp,
      `document.querySelector('button[aria-label="Skip splash screen"]').click()`
    );
    await sleep(1200);
  }
  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(1500);
}

async function measureSidebar(cdp) {
  return evalJs(
    cdp,
    `(function(){
      const rail = document.querySelector('.app-sidebar--rail');
      if (!rail) return { error: 'no rail' };
      const railBox = rail.getBoundingClientRect();
      const list = rail.querySelector('.app-sidebar-rail-list') || rail;
      const railStyle = window.getComputedStyle(rail);
      const listStyle = window.getComputedStyle(list);
      var listBox = list.getBoundingClientRect();
      /* Center of full rail (border box) — matches visible 104px strip */
      var contentCx = railBox.left + railBox.width / 2;
      const round = function (n) { return Math.round(n * 100) / 100; };
      const tiles = [...document.querySelectorAll(
        '.app-sidebar--rail .app-sidebar-rail-list > li > button.app-sidebar-item'
      )];
      const rows = tiles.map(function (btn) {
        var name = btn.getAttribute('aria-label') || '';
        var iconWrap = btn.querySelector('.app-sidebar-icon-wrap, .a-s-logo');
        var svg = iconWrap && iconWrap.querySelector('svg');
        var text = btn.querySelector('.app-sidebar-menu-label, .a-s-label');
        var iconBox = svg ? svg.getBoundingClientRect() : (iconWrap ? iconWrap.getBoundingClientRect() : null);
        var textBox = text ? text.getBoundingClientRect() : null;
        var tileBox = btn.getBoundingClientRect();
        var tileCx = tileBox.left + tileBox.width / 2;
        var iconCx = iconBox ? iconBox.left + iconBox.width / 2 : null;
        var labelCx = textBox ? textBox.left + textBox.width / 2 : null;
        var dIconTile = iconCx != null ? Math.abs(iconCx - tileCx) : 999;
        var dLabelTile = labelCx != null ? Math.abs(labelCx - tileCx) : 999;
        var dTileContent = Math.abs(tileCx - contentCx);
        return {
          label: name,
          tileCx: round(tileCx),
          contentCx: round(contentCx),
          iconCx: iconCx != null ? round(iconCx) : null,
          labelCx: labelCx != null ? round(labelCx) : null,
          dIconVsTile: round(dIconTile),
          dLabelVsTile: round(dLabelTile),
          dTileVsContent: round(dTileContent),
          pass: dIconTile <= 1 && dLabelTile <= 1 && dTileContent <= 1,
        };
      });
      return {
        railW: round(railBox.width),
        railClientW: round(rail.clientWidth || railBox.width),
        scrollbarW: round(railBox.width - (rail.clientWidth || railBox.width)),
        listW: round(listBox.width),
        railFlexDir: railStyle.flexDirection,
        railAlignItems: railStyle.alignItems,
        listAlignSelf: listStyle.alignSelf,
        listMaxW: listStyle.maxWidth,
        rows,
      };
    })()`
  );
}

async function screenshotRailClip(cdp, width, height, tag) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(600);
  const clip = await evalJs(
    cdp,
    `(function(){
      const rail = document.querySelector('.app-sidebar--rail');
      if (!rail) return null;
      const r = rail.getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(r.top)),
        width: Math.ceil(r.width),
        height: Math.ceil(r.height),
        scale: 1,
      };
    })()`
  );
  if (!clip) throw new Error('no rail for clip');
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip,
  });
  const name = `sidebar-rail-${tag}.png`;
  fs.writeFileSync(path.join(shotsDir, name), Buffer.from(data, 'base64'));
  return name;
}

function loadPngTools() {
  try {
    const reqPng = createRequire(path.join(parityModules, 'pngjs/package.json'));
    const reqPm = createRequire(path.join(parityModules, 'pixelmatch/package.json'));
    const { PNG } = reqPng('pngjs');
    const pm = reqPm('pixelmatch');
    const pixelmatch = typeof pm === 'function' ? pm : pm?.default;
    if (typeof pixelmatch !== 'function') return null;
    return { PNG, pixelmatch };
  } catch {
    return null;
  }
}

function diffPngBuffers(bufA, bufB, PNG, pixelmatch) {
  const a = PNG.sync.read(bufA);
  const b = PNG.sync.read(bufB);
  if (a.width !== b.width || a.height !== b.height) {
    return {
      match: false,
      reason: `size ${a.width}x${a.height} vs ${b.width}x${b.height}`,
      diffPx: -1,
      diffPct: -1,
    };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const diffPx = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0.1,
  });
  const diffPct = (diffPx / (a.width * a.height)) * 100;
  return {
    match: diffPx === 0,
    diffPx,
    diffPct: Math.round(diffPct * 1e6) / 1e6,
  };
}

function cropTop68Png(pngBuffer, PNG) {
  const img = PNG.sync.read(pngBuffer);
  const h = Math.min(68, img.height);
  const out = new PNG({ width: img.width, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < img.width; x++) {
      const si = (img.width * y + x) << 2;
      const di = (img.width * y + x) << 2;
      for (let i = 0; i < 4; i++) out.data[di + i] = img.data[si + i];
    }
  }
  return PNG.sync.write(out);
}

function gitShowRefPng(gitRef, relativePath) {
  try {
    const p = relativePath.replace(/\\/g, '/');
    return execSync(`git show ${gitRef}:${p}`, {
      cwd: repoRoot,
      encoding: null,
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

async function main() {
  fs.mkdirSync(shotsDir, { recursive: true });

  const pngTools = loadPngTools();
  const cdp = connect(await getPageWs());
  await cdp.ready;

  await prepReader(cdp);

  const widths = [
    [1440, 900, '1440'],
    [1024, 720, '1024'],
    [800, 720, '800'],
  ];

  const table = [];
  const railDiagnostics = [];
  const railShots = [];

  for (const [w, h, tag] of widths) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(800);
    const m = await measureSidebar(cdp);
    if (m.error) throw new Error(m.error);
    const { rows, ...diag } = m;
    railDiagnostics.push({ viewport: tag, ...diag });
    for (const row of rows) {
      table.push({
        viewport: tag,
        ...row,
      });
    }
    const shot = await screenshotRailClip(cdp, w, h, tag);
    railShots.push(shot);
  }

  const topBarCompare = [];
  if (pngTools) {
    const { PNG, pixelmatch } = pngTools;
    for (const [, , tag] of widths) {
      const rel = `docs/electron/shots/nav/app-chrome-electron-${tag}.png`;
      const currentPath = path.join(shotsDir, `app-chrome-electron-${tag}.png`);
      const baselineBuf = gitShowRefPng(TOP_BAR_BASELINE_REF, rel);
      if (!baselineBuf || !fs.existsSync(currentPath)) {
        topBarCompare.push({
          viewport: tag,
          baselineRef: TOP_BAR_BASELINE_REF,
          note: baselineBuf ? 'missing current full screenshot' : `missing ${TOP_BAR_BASELINE_REF} baseline in git`,
        });
        continue;
      }
      const curBuf = fs.readFileSync(currentPath);
      const a = cropTop68Png(baselineBuf, PNG);
      const b = cropTop68Png(curBuf, PNG);
      const d = diffPngBuffers(a, b, PNG, pixelmatch);
      topBarCompare.push({
        viewport: tag,
        baselineRef: TOP_BAR_BASELINE_REF,
        top68pxIdentical: d.match,
        diffPixels: d.diffPx,
        diffPct: d.diffPct,
      });
    }
  } else {
    topBarCompare.push({ note: 'pngjs/pixelmatch not found at C:/temp/parity/node_modules' });
  }

  cdp.close();

  const allPass = table.every(r => r.pass);
  const report = {
    generatedAt: new Date().toISOString(),
    allPass,
    railDiagnostics,
    measurements: table,
    railScreenshots: railShots,
    topBar68pxVsBaseline: topBarCompare,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!allPass) process.exit(1);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
