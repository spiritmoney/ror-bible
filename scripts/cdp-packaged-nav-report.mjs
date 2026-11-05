/** CDP: top nav openExternal log (main --log-external-opens); sidebar logged-out. */
import WebSocket from 'ws';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const ORIGIN = 'https://rhapsodybiblestaging.web.app';
const TOP_WEB = [
  ['Features', `${ORIGIN}/features`],
  ['Products', `${ORIGIN}/products/web`],
  ['Pricing', `${ORIGIN}/pricing`],
  ['Download', `${ORIGIN}/download`],
  ['About', `${ORIGIN}/about`],
  ['Contact', `${ORIGIN}/download#contact`],
];

const SIDE = ['Library', 'Favourites', 'Store', 'Downloads', 'Alerts'];

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
  if (!page) throw new Error(`no packaged page: ${JSON.stringify(list.map(x => x.url))}`);
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

async function prepLoggedOut(cdp) {
  await evalJs(cdp, `localStorage.clear(); sessionStorage.clear();`);
  await evalJs(
    cdp,
    `(async () => { const dbs = await indexedDB.databases?.() || []; for (const db of dbs) { if (db.name) indexedDB.deleteDatabase(db.name); } })()`
  );
  await evalJs(cdp, `location.reload()`);
  await sleep(4000);
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
  return evalJs(cdp, `!!document.querySelector('.app-top-sign-in')`);
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

  const signIn = await prepLoggedOut(cdp);
  if (!signIn) throw new Error('Expected Sign in visible (logged out)');

  const rows = [];

  for (const [label, expectedUrl] of TOP_WEB) {
    await evalJs(cdp, `location.hash='#/bible-online'`);
    await sleep(400);
    await evalJs(cdp, `window.electronAPI?.clearExternalOpenLog?.()`);
    const before = await evalJs(cdp, 'location.hash');
    const clicked = await evalJs(
      cdp,
      `(function(){ const el=[...document.querySelectorAll('.app-top-nav-list li')].find(li=>li.innerText.trim().startsWith('${label}')); if(!el) return false; el.click(); return true; })()`
    );
    await sleep(800);
    const after = await evalJs(cdp, 'location.hash');
    const opened = await evalJs(
      cdp,
      `(async () => { const log = await window.electronAPI?.getExternalOpenLog?.(); return (log && log[log.length - 1]) || ''; })()`
    );
    rows.push({
      item: label,
      urlOpened: opened,
      hashBefore: before,
      hashAfter: after,
      pass: clicked && opened === expectedUrl && before === after,
    });
  }

  for (const label of SIDE) {
    await evalJs(cdp, `location.hash='#/bible-online'`);
    await sleep(800);
    const before = await evalJs(cdp, 'location.hash');
    await evalJs(
      cdp,
      `(function(){
        const el=document.querySelector('.app-sidebar [aria-label="${label}"]');
        if(!el) return false;
        el.click();
        return true;
      })()`
    );
    await sleep(1200);
    const after = await evalJs(cdp, 'location.hash');
    const pass =
      label === 'Library'
        ? /bible-online/i.test(after)
        : /login/i.test(after);
    rows.push({
      item: `Side:${label}`,
      urlOpened: '',
      hashBefore: before,
      hashAfter: after,
      pass,
    });
  }

  cdp.close();
  console.log(JSON.stringify(rows, null, 2));
  const topFail = rows.filter(r => !r.item.startsWith('Side:') && !r.pass);
  if (topFail.length) process.exit(1);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
