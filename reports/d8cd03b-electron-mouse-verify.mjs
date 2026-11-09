/** One-off verify on d8cd03b — Electron real mouse (CDP 9222). */
import WebSocket from 'ws';

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
  const page = list.find((t) => t.type === 'page' && !/devtools/i.test(t.url));
  if (!page) throw new Error('no CDP page');
  return page.webSocketDebuggerUrl;
}

async function evalJs(cdp, expression) {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.subtype === 'error') throw new Error(result.description || 'eval');
  return result.value;
}

async function realClick(cdp, x, y) {
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x,
    y,
    buttons: 0,
  });
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x,
    y,
    button: 'left',
    clickCount: 1,
    buttons: 1,
  });
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x,
    y,
    button: 'left',
    clickCount: 1,
    buttons: 0,
  });
}

async function buttonCenter(cdp, label) {
  return evalJs(
    cdp,
    `(function(){
      const buttons = [...document.querySelectorAll('.app-top-nav-list button.app-top-nav-item')];
      const el = buttons.find(b => b.textContent.trim().startsWith(${JSON.stringify(label)}));
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return null;
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    })()`
  );
}

async function sidebarCenter(cdp, label) {
  return evalJs(
    cdp,
    `(function(){
      const el = document.querySelector('.app-sidebar button[aria-label=${JSON.stringify(label)}]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    })()`
  );
}

const TOP = [
  ['Features', 'https://rhapsodybiblestaging.web.app/features'],
  ['Products', 'https://rhapsodybiblestaging.web.app/products/web'],
  ['Pricing', 'https://rhapsodybiblestaging.web.app/pricing'],
  ['Download', 'https://rhapsodybiblestaging.web.app/download'],
  ['About', 'https://rhapsodybiblestaging.web.app/about'],
  ['Contact', 'https://rhapsodybiblestaging.web.app/download#contact'],
];

const SIDE = [
  [
    'Library',
    (after, modal) => /bible-online/i.test(after) || modal,
  ],
  ['Favourites', /login/i],
  ['Store', /login/i],
  [
    'Downloads',
    (after) => /bible-online/i.test(after),
  ],
  ['Alerts', (after) => /bible-online/i.test(after)],
];

async function goReader(cdp) {
  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(1800);
}

async function main() {
  const cdp = connect(await getPageWs());
  await cdp.ready;
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(800);

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

  const bootstrap = await evalJs(
    cdp,
    `({
      href: location.href,
      hash: location.hash,
      electronAPI: window.electronAPI?.isElectron === true,
      runningInElectron: (function(){
        if (window.electronAPI?.isElectron === true) return true;
        if (window.matchMedia && window.matchMedia('(display-mode: browser)').matches) return false;
        return navigator.userAgent.toLowerCase().includes(' electron/');
      })(),
      hashRouter: location.protocol === 'app:' && location.href.includes('#/')
    })`
  );

  const results = { bootstrap, top: [], side: [] };

  for (const [label, expectedUrl] of TOP) {
    await goReader(cdp);
    await evalJs(cdp, `window.electronAPI?.clearExternalOpenLog?.()`);
    const before = await evalJs(cdp, 'location.hash');
    const box = await buttonCenter(cdp, label);
    if (!box) {
      results.top.push({ label, pass: false, error: 'no button' });
      continue;
    }
    await realClick(cdp, box.x, box.y);
    await sleep(2200);
    const after = await evalJs(cdp, 'location.hash');
    const opened = await evalJs(
      cdp,
      `(async () => { const log = await window.electronAPI?.getExternalOpenLog?.(); return (log && log[log.length - 1]) || ''; })()`
    );
    const pass = opened === expectedUrl;
    results.top.push({ label, pass, before, after, opened, expectedUrl });
    await evalJs(
      cdp,
      `document.querySelector('[aria-label="Close"]')?.click()`
    );
    await sleep(800);
  }

  for (const [label, expect] of SIDE) {
    await goReader(cdp);
    const before = await evalJs(cdp, 'location.hash');
    const box = await sidebarCenter(cdp, label);
    if (!box) {
      results.side.push({ label, pass: false, error: 'no tile' });
      continue;
    }
    await realClick(cdp, box.x, box.y);
    await sleep(1800);
    const after = await evalJs(cdp, 'location.hash');
    const modal = await evalJs(
      cdp,
      `!!document.querySelector('.modal.show, .modal-backdrop.show')`
    );
    let pass = false;
    if (expect instanceof RegExp) pass = expect.test(after);
    else if (typeof expect === 'function') pass = expect(after, modal);
    results.side.push({ label, pass, before, after, modal });
  }

  cdp.close();
  console.log(JSON.stringify(results, null, 2));
  const fail =
    !bootstrap.runningInElectron ||
    !bootstrap.hashRouter ||
    !/#\/bible-online/i.test(bootstrap.hash) ||
    results.top.some((r) => !r.pass) ||
    results.side.some((r) => !r.pass);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
