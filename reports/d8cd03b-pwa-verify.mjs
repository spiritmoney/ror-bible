/** PWA standalone + minimal-ui on static prod (CDP 9333, port 4191). */
import WebSocket from 'ws';

const PORT = process.env.VERIFY_PORT || '4191';
const ORIGIN = `http://127.0.0.1:${PORT}`;
const CDP = process.env.CDP_PORT || '9333';
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
  const list = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
  const page = list.find(
    (t) => t.type === 'page' && t.url.startsWith(ORIGIN)
  );
  if (!page) {
    const any = list.find((t) => t.type === 'page' && !t.url.startsWith('chrome'));
    if (any) return any.webSocketDebuggerUrl;
    throw new Error('no page');
  }
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

async function main() {
  const cdp = connect(await getPageWs());
  await cdp.ready;
  await cdp.send('ServiceWorker.disable');

  await cdp.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'display-mode', value: 'standalone' }],
  });
  await cdp.send('Page.navigate', { url: `${ORIGIN}/?source=pwa` });
  await sleep(3500);
  const standalone = await evalJs(
    cdp,
  `({
      path: location.pathname,
      shell: document.documentElement.classList.contains('is-app-shell')
    })`
  );

  await evalJs(cdp, `localStorage.clear(); sessionStorage.clear();`);
  await cdp.send('Page.navigate', { url: `${ORIGIN}/features` });
  await sleep(2500);
  const afterNav = await evalJs(
    cdp,
  `({
      path: location.pathname,
      shell: document.documentElement.classList.contains('is-app-shell'),
      isAppShell: (function(){
        try { return window.__testIsAppShell?.(); } catch { return null; }
      })()
    })`
  );

  await cdp.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'display-mode', value: 'minimal-ui' }],
  });
  await evalJs(cdp, `sessionStorage.setItem('rhapsody:installedLaunch','pwa')`);
  await cdp.send('Page.navigate', { url: `${ORIGIN}/bible-online` });
  await sleep(2500);
  const minimal = await evalJs(
    cdp,
    `({
      path: location.pathname,
      shell: document.documentElement.classList.contains('is-app-shell')
    })`
  );
  await cdp.send('Page.navigate', { url: `${ORIGIN}/features` });
  await sleep(2000);
  const minimalAfter = await evalJs(
    cdp,
    `({ path: location.pathname, shell: document.documentElement.classList.contains('is-app-shell') })`
  );

  const report = {
    standalone: {
      pass: /bible-online/i.test(standalone.path) && standalone.shell,
      ...standalone,
    },
    minimalUi: {
      pass:
        /bible-online/i.test(minimal.path) &&
        minimal.shell &&
        minimalAfter.shell,
      entry: minimal,
      afterNav: minimalAfter,
    },
    afterNavStandalone: afterNav,
  };

  cdp.close();
  console.log(JSON.stringify(report, null, 2));
  const fail = !report.standalone.pass || !report.minimalUi.pass;
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
