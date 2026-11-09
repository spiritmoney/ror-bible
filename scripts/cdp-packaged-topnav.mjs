/** Log hash before/after top-nav clicks on packaged app (CDP port 9222). */
import WebSocket from 'ws';

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
  if (!page) throw new Error(`no packaged page: ${JSON.stringify(list.map(x => x.url))}`);
  return page.webSocketDebuggerUrl;
}

async function evalJs(cdp, expression) {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
  });
  return result.value;
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
  const splash = await evalJs(
    cdp,
    `!!document.querySelector('button[aria-label="Skip splash screen"]')`
  );
  if (splash) {
    await evalJs(
      cdp,
      `document.querySelector('button[aria-label="Skip splash screen"]').click()`
    );
    await sleep(1500);
  }
  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(2500);

  const shell = await evalJs(
    cdp,
    `({ isAppShell: !!(window.electronAPI?.isElectron), isElectronClass: document.documentElement.classList.contains('is-electron'), href: location.href })`
  );
  console.log('shell', shell);

  for (const label of ['About', 'Products', 'Partner', 'Give', 'Contact']) {
    await evalJs(cdp, `location.hash='#/bible-online'`);
    await sleep(1200);
    const before = await evalJs(cdp, 'location.hash');
    const clicked = await evalJs(
      cdp,
      `(function(){ const el=[...document.querySelectorAll('.app-top-nav-list li')].find(li=>li.innerText.trim().startsWith('${label}')); if(!el) return false; el.click(); return true; })()`
    );
    await sleep(1800);
    const after = await evalJs(
      cdp,
      `({ hash: location.hash, hasClose: !!document.querySelector('[aria-label="Close"]'), modalText: document.body.innerText.slice(0,80) })`
    );
    console.log(JSON.stringify({ label, clicked, before, after }));
    await evalJs(
      cdp,
      `document.querySelector('[aria-label="Close"]')?.click()`
    );
    await sleep(800);
  }
  cdp.close();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
