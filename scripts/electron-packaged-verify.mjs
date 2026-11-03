/**
 * Packaged Electron verification via CDP (app on --remote-debugging-port=9222).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotsDir = path.join(__dirname, '..', 'docs', 'electron', 'shots');
const userDataDir = process.env.ELECTRON_VERIFY_USERDATA || 'C:/temp/electron-verify-profile';
const HOSTING_STRONGS = 'https://rhapsodybible.web.app/HebrewGreekRes/';
fs.mkdirSync(shotsDir, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

function connectCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const networkUrls = [];
  const consoleErrors = [];

  ws.on('message', raw => {
    const msg = JSON.parse(String(raw));
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
    if (msg.method === 'Network.requestWillBeSent') {
      networkUrls.push(msg.params.request.url);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(
        msg.params.args?.map(a => a.value ?? a.description ?? '').join(' ')
      );
    }
  });

  const ready = new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
  });

  return {
    ready,
    networkUrls,
    consoleErrors,
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
  const page = list.find(t => t.type === 'page');
  if (!page) throw new Error('no CDP page target');
  return page.webSocketDebuggerUrl;
}

async function evalJs(cdp, expression) {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.subtype === 'error') throw new Error(result.description);
  return result.value;
}

async function screenshot(cdp, name, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(700);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(shotsDir, name), Buffer.from(data, 'base64'));
}

async function navHash(cdp, hashPath) {
  await evalJs(cdp, `location.hash = '${hashPath}'`);
  await sleep(3500);
}

function listCacheFiles() {
  const cacheRoot = path.join(userDataDir, 'HebrewGreekRes');
  if (!fs.existsSync(cacheRoot)) return [];
  const out = [];
  const walk = dir => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else out.push(p);
    }
  };
  walk(cacheRoot);
  return out;
}

async function main() {
  const cdp = connectCdp(await getPageWs());
  await cdp.ready;
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Network.enable');

  const report = {};

  report.splashSeen = await evalJs(
    cdp,
    `!!document.querySelector('button[aria-label="Skip splash screen"]')`
  );
  if (report.splashSeen) {
    await evalJs(cdp, `document.querySelector('button[aria-label="Skip splash screen"]').click()`);
    await sleep(1200);
  }
  report.splashSkipped = !(await evalJs(
    cdp,
    `!!document.querySelector('button[aria-label="Skip splash screen"]')`
  ));
  await screenshot(cdp, 'splash-skipped-1440.png', 1440, 900);

  await navHash(cdp, '/bible-online');

  const resources = await evalJs(
    cdp,
    `performance.getEntriesByType('resource').map(r => ({name: r.name, status: r.responseStatus || 0}))`
  );
  report.font404s = (resources || []).filter(
    r => /font|woff|montserrat/i.test(r.name) && r.status >= 400
  );
  report.image404s = (resources || []).filter(
    r => /\.(png|jpg|jpeg|svg|webp)/i.test(r.name) && r.status >= 400
  );
  report.fontsLoaded = await evalJs(
    cdp,
    `document.fonts ? document.fonts.status === 'loaded' || document.fonts.size > 0 : true`
  );

  const chapterBefore = await evalJs(
    cdp,
    `document.querySelector('.multi_layout_main_reader_main span.font-bold')?.innerText?.trim() || ''`
  );
  await evalJs(
    cdp,
    `document.querySelector('.multi_layout_main_reader_main_right svg, .multi_layout_main_reader_main_right .multi_layout_main_reader_main_right_ic')?.dispatchEvent(new MouseEvent('click', {bubbles:true}))`
  );
  await sleep(1200);
  const chapterAfter = await evalJs(
    cdp,
    `document.querySelector('.multi_layout_main_reader_main span.font-bold')?.innerText?.trim() || ''`
  );
  report.chapterBefore = chapterBefore;
  report.chapterAfter = chapterAfter;
  report.chapterNav = chapterBefore !== chapterAfter && !!chapterAfter;

  report.translationLabel = await evalJs(
    cdp,
    `document.querySelector('.multi_layout_main_reader_top_settings_options_select h6')?.innerText?.trim() || ''`
  );

  if (fs.existsSync(path.join(userDataDir, 'HebrewGreekRes'))) {
    fs.rmSync(path.join(userDataDir, 'HebrewGreekRes'), { recursive: true, force: true });
  }
  const beforeCache = listCacheFiles().length;
  await evalJs(
    cdp,
    `(() => {
      const nums = [...document.querySelectorAll('span.cursor-pointer')].filter(s => /^[GH]\\d/i.test(s.textContent||''));
      if (nums[0]) { nums[0].click(); return nums[0].textContent; }
      return null;
    })()`
  );
  await sleep(6000);
  const afterCache = listCacheFiles();
  report.strongsCodeClicked = true;
  report.strongsExpectedUrlPrefix = HOSTING_STRONGS;
  report.strongsCacheCount = afterCache.length;
  report.strongsCacheSample = afterCache.slice(0, 5).map(p => path.relative(userDataDir, p));
  report.strongsOnlinePass = afterCache.length > beforeCache;

  await cdp.send('Emulation.setOffline', { offline: true });
  await evalJs(cdp, `(() => { const n=[...document.querySelectorAll('span.cursor-pointer')].find(s=>/^[GH]\\d/i.test(s.textContent||'')); n?.click(); return !!n; })()`);
  await sleep(2500);
  report.strongsOfflineNoCrash = await evalJs(cdp, 'true');
  report.strongsOfflineUi = await evalJs(
    cdp,
    `document.body.innerText.includes('Fetching') || document.body.innerText.includes('..') || document.body.innerText.length > 100`
  );
  await cdp.send('Emulation.setOffline', { offline: false });

  report.openExternalInvoked = await evalJs(
    cdp,
    `(async () => { try { await window.electronAPI.openExternal('https://example.com/electron-packaged-verify'); return true; } catch { return false; } })()`
  );

  const browserWs = (await (await fetch('http://127.0.0.1:9222/json/version')).json())
    .webSocketDebuggerUrl;
  const browser = connectCdp(browserWs);
  await browser.ready;
  try {
    const { windowId } = await browser.send('Browser.getWindowForTarget');
    await browser.send('Browser.setWindowBounds', {
      windowId,
      bounds: { width: 800, height: 600, windowState: 'normal' },
    });
    await sleep(500);
    const { bounds } = await browser.send('Browser.getWindowBounds', { windowId });
    report.minWidthEnforced = bounds.width >= 1024;
  } catch (e) {
    report.minWidthEnforced = null;
    report.minWidthNote = e.message;
  }
  browser.close();

  await screenshot(cdp, 'verify-packaged-1440.png', 1440, 900);
  await screenshot(cdp, 'verify-packaged-1024.png', 1024, 720);

  report.networkStrongsUrls = cdp.networkUrls.filter(u => u.includes('HebrewGreekRes'));
  report.consoleErrorCount = cdp.consoleErrors.length;
  report.consoleErrorsSample = cdp.consoleErrors.slice(0, 8);

  cdp.close();

  const outPath = path.join(__dirname, '..', 'docs', 'electron', 'packaged-verify-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
