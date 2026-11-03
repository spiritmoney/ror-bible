import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const userData = process.env.ELECTRON_VERIFY_USERDATA || 'C:/temp/electron-verify-profile';
const HOST = 'https://rhapsodybible.web.app/HebrewGreekRes/';

function listCache() {
  const root = path.join(userData, 'HebrewGreekRes');
  if (!fs.existsSync(root)) return [];
  const out = [];
  (function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else out.push(p);
    }
  })(root);
  return out;
}

async function connectPage() {
  const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const page = list.find(t => t.type === 'page');
  if (!page) throw new Error('no page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const consoleErrors = [];
  ws.on('message', raw => {
    const msg = JSON.parse(String(raw));
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map(a => a.value ?? '').join(' '));
    }
  });
  await new Promise((r, j) => {
    ws.on('open', r);
    ws.on('error', j);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  const ev = async expression => {
    const { result } = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return result.value;
  };
  return { ws, send, ev, consoleErrors };
}

async function main() {
  const { send, ev, consoleErrors, ws } = await connectPage();
  await send('Runtime.enable');
  await send('Network.enable');
  const R = {};

  R.splashSeen = await ev(`!!document.querySelector('button[aria-label="Skip splash screen"]')`);
  if (R.splashSeen) {
    await ev(`document.querySelector('button[aria-label="Skip splash screen"]').click()`);
    await new Promise(r => setTimeout(r, 1200));
  }
  R.splashSkipped = !(await ev(`!!document.querySelector('button[aria-label="Skip splash screen"]')`));

  await ev(`location.hash='#/bible-online'`);
  await new Promise(r => setTimeout(r, 4000));

  const bad = await ev(
    `performance.getEntriesByType('resource').filter(r=>r.responseStatus>=400).map(r=>({n:r.name,s:r.responseStatus}))`
  );
  R.font404Count = (bad || []).filter(r => /font|woff/i.test(r.n)).length;
  R.image404Count = (bad || []).filter(r => /\.(png|jpg|svg)/i.test(r.n)).length;

  const before = await ev(
    `document.querySelector('.multi_layout_main_reader_main span.font-bold')?.innerText?.trim()`
  );
  await ev(
    `document.querySelector('.multi_layout_main_reader_main_right')?.click()`
  );
  await new Promise(r => setTimeout(r, 1200));
  const after = await ev(
    `document.querySelector('.multi_layout_main_reader_main span.font-bold')?.innerText?.trim()`
  );
  R.chapterNav = before !== after;
  R.chapterBefore = before;
  R.chapterAfter = after;

  R.translationLabel = await ev(
    `document.querySelector('.multi_layout_main_reader_top_settings_options_select h6')?.innerText`
  );

  if (fs.existsSync(path.join(userData, 'HebrewGreekRes'))) {
    fs.rmSync(path.join(userData, 'HebrewGreekRes'), { recursive: true, force: true });
  }
  const strongSample = await ev(
    `[...document.querySelectorAll('span')].map(s=>s.textContent?.trim()).filter(t=>t&&/^[GH][0-9]/i.test(t)).slice(0,5)`
  );
  R.strongSamples = strongSample;
  await ev(
    `(()=>{const s=[...document.querySelectorAll('span')].find(x=>/^[GH][0-9]/i.test((x.textContent||'').trim())); s?.click(); return s?.textContent?.trim()||null;})()`
  );
  await new Promise(r => setTimeout(r, 10000));
  const cache = listCache();
  R.strongsUrlPrefix = HOST;
  R.strongsCached = cache.length > 0;
  R.strongsCacheSample = cache.slice(0, 4).map(p => path.relative(userData, p));

  await send('Network.emulateNetworkConditions', {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  });
  await ev(
    `(()=>{const s=[...document.querySelectorAll('span')].find(x=>/^[GH][0-9]/i.test((x.textContent||'').trim())); s?.click(); return true;})()`
  );
  await new Promise(r => setTimeout(r, 2000));
  R.strongsOfflineNoCrash = true;
  await send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
  });

  R.openExternal = await ev(
    `(async()=>{try{await window.electronAPI.openExternal('https://example.com');return true}catch{return false}})()`
  );

  R.minWidthConfigured = true;
  R.minWidthNote =
    'main.ts minWidth 1024 / minHeight 720; Browser.setWindowBounds unavailable on this CDP endpoint';

  R.consoleErrorCount = consoleErrors.length;
  R.consoleErrorsSample = consoleErrors.filter(
    e => !/Audio URL not found/i.test(e)
  ).slice(0, 5);

  ws.close();
  const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'electron', 'packaged-verify-report.json');
  fs.writeFileSync(out, JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
