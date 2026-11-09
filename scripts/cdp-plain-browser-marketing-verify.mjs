/**
 * Production bundle check: plain tab keeps marketing paths; store/desktop clicks work.
 * Prereq: `npm run build` then `npx serve -s build -l 4173` (or PORT env).
 * Chrome: start with --remote-debugging-port=9222 --user-data-dir=<fresh>
 */
import WebSocket from 'ws';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.VERIFY_PORT || '4173';
const ORIGIN = `http://127.0.0.1:${PORT}`;
const PATHS_STAY = ['/', '/download', '/features'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.on('message', (raw) => {
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
    async send(method, params = {}) {
      await ready;
      return new Promise((resolve, reject) => {
        const mid = ++id;
        pending.set(mid, { resolve, reject });
        ws.send(JSON.stringify({ id: mid, method, params }));
      });
    },
    close() {
      ws.close();
    },
  };
}

async function getPageWs() {
  const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const page =
    list.find((t) => t.type === 'page' && t.url.startsWith(ORIGIN)) ||
    list.find((t) => t.type === 'page' && !/devtools/i.test(t.url));
  if (!page?.webSocketDebuggerUrl) throw new Error('No CDP page');
  return connect(page.webSocketDebuggerUrl);
}

async function evalJs(cdp, expression) {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.type === 'object' && result.subtype === 'error') {
    throw new Error(result.description || 'evaluate failed');
  }
  return result.value;
}

async function mouseClick(cdp, x, y) {
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x,
    y,
    button: 'left',
    clickCount: 1,
  });
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x,
    y,
    button: 'left',
    clickCount: 1,
  });
}

async function main() {
  await cdpBootstrap();
  const cdp = await getPageWs();
  await cdp.send('ServiceWorker.disable');
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');

  const report = { paths: [], store: [], desktop: [], topNav: [], reader: null };

  for (const p of PATHS_STAY) {
    await cdp.send('Page.navigate', { url: `${ORIGIN}${p}` });
    await sleep(2500);
    const pathname = await evalJs(cdp, 'location.pathname');
    report.paths.push({ path: p, stayed: pathname === p, actual: pathname });
  }

  await cdp.send('Page.navigate', { url: `${ORIGIN}/download` });
  await sleep(3000);

  const links = await evalJs(
    cdp,
    `[...document.querySelectorAll('.uc74f11 a[href^="http"]')].map(a=>({href:a.href, rect:a.getBoundingClientRect()}))`
  );

  for (const link of links.slice(0, 3)) {
    const opened = [];
    const off = await cdp.send('Runtime.evaluate', {
      expression: `window.open = (u) => { window.__opened = u; return null; }; 'ok'`,
    });
    void off;
    await mouseClick(
      cdp,
      Math.round(link.rect.x + link.rect.width / 2),
      Math.round(link.rect.y + link.rect.height / 2)
    );
    await sleep(500);
    const url = await evalJs(cdp, 'window.__opened || ""');
    report.store.push({ href: link.href, opened: url });
  }

  const beforePath = await evalJs(cdp, 'location.pathname');
  const desk = await evalJs(
    cdp,
    `(() => { const a = [...document.querySelectorAll('a[href*="github.com/spiritmoney/ror-bible/releases"]')][0]; if(!a) return null; const r=a.getBoundingClientRect(); return {href:a.href,rect:r}; })()`
  );
  if (desk) {
    await mouseClick(
      cdp,
      Math.round(desk.rect.x + desk.rect.width / 2),
      Math.round(desk.rect.y + desk.rect.height / 2)
    );
    await sleep(800);
    const afterPath = await evalJs(cdp, 'location.pathname');
    report.desktop.push({
      href: desk.href,
      pathBefore: beforePath,
      pathAfter: afterPath,
      stayedOnDownload: afterPath === '/download',
    });
  }

  const outPath = path.join('reports', 'plain-browser-marketing-verify.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  cdp.close();

  const failed =
    report.paths.some((r) => !r.stayed) ||
    report.desktop.some((r) => !r.stayedOnDownload);
  process.exit(failed ? 1 : 0);
}

async function cdpBootstrap() {
  /* noop — expect external Chrome + serve */
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
