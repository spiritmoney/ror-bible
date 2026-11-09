/**
 * Real Chrome on static prod build (VERIFY_PORT, CDP 9333).
 */
import WebSocket from 'ws';
const TOP = [
  { label: 'Features', path: '/features', hash: '' },
  { label: 'Products', path: '/products/web', hash: '' },
  { label: 'Pricing', path: '/pricing', hash: '' },
  { label: 'Download', path: '/download', hash: '' },
  { label: 'About', path: '/about', hash: '' },
  { label: 'Contact', path: '/download', hash: '#contact' },
];

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
  if (!page) throw new Error(`no page on ${ORIGIN}`);
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

async function mouseClick(cdp, x, y) {
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type,
      x,
      y,
      button: 'left',
      clickCount: 1,
      buttons: type === 'mousePressed' ? 1 : 0,
    });
  }
}

async function main() {
  const cdp = connect(await getPageWs());
  await cdp.ready;
  await cdp.send('ServiceWorker.disable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const report = { store: [], desktop: [], topNav: [], reader: null };

  await cdp.send('Page.navigate', { url: `${ORIGIN}/download` });
  await sleep(3500);

  const links = await evalJs(
    cdp,
    `[...new Map([...document.querySelectorAll('.uc74f11 a[href^="http"]')].filter(a=>!/github\\.com\\/spiritmoney\\/ror-bible\\/releases/i.test(a.href)).map(a=>[a.href,a])).values()].map(a=>{const r=a.getBoundingClientRect();return {href:a.href,x:r.left+r.width/2,y:r.top+r.height/2};}).filter(p=>p.y>0)`
  );
  await cdp.send('Target.setDiscoverTargets', { discover: true });
  for (const link of links.slice(0, 3)) {
    const before = (await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json()).length;
    await mouseClick(cdp, link.x, link.y);
    await sleep(1200);
    const after = (await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json()).filter(
      (t) => t.type === 'page' && t.url.startsWith('http')
    );
    const opened =
      after.find((t) => t.url === link.href || t.url.startsWith(link.href.split('#')[0]))
        ?.url || '';
    report.store.push({
      href: link.href,
      opened: opened || (after.length > before ? after[after.length - 1]?.url : ''),
      pass: opened === link.href || after.some((t) => t.url === link.href),
    });
  }

  const before = await evalJs(cdp, 'location.pathname');
  const desk = await evalJs(
    cdp,
    `(() => { const a=[...document.querySelectorAll('a[href*="github.com/spiritmoney/ror-bible/releases"]')][0]; if(!a)return null; const r=a.getBoundingClientRect(); return {href:a.href,x:r.left+r.width/2,y:r.top+r.height/2}; })()`
  );
  if (desk) {
    await mouseClick(cdp, desk.x, desk.y);
    await sleep(800);
    const after = await evalJs(cdp, 'location.pathname');
    report.desktop.push({
      pass: before === '/download' && after === '/download',
      before,
      after,
    });
  }

  for (const item of TOP) {
    await cdp.send('Page.navigate', { url: `${ORIGIN}/download` });
    await sleep(2000);
    const href = `${item.path}${item.hash}`;
    const box = await evalJs(
      cdp,
      `(function(){
        const href = ${JSON.stringify(href)};
        const label = ${JSON.stringify(item.label)};
        let el = document.querySelector('.navlinks a[href="' + href + '"]');
        if (!el && label === 'About') {
          el = [...document.querySelectorAll('.navlinks a')].find(
            (a) => a.textContent.trim() === 'About'
          );
        }
        if (!el) {
          el = [...document.querySelectorAll('.navlinks a')].find(
            (a) => a.textContent.trim() === label
          );
        }
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      })()`
    );
    if (!box) {
      report.topNav.push({ label: item.label, pass: false, error: 'missing' });
      continue;
    }
    await mouseClick(cdp, box.x, box.y);
    await sleep(2000);
    const path = await evalJs(cdp, 'location.pathname');
    const hash = await evalJs(cdp, 'location.hash');
    const pass =
      path === item.path &&
      (item.hash ? hash === item.hash : hash === '' || hash === '#') ||
      (item.label === 'About' && path === '/about');
    report.topNav.push({ label: item.label, pass, path, hash });
  }

  await cdp.send('Page.navigate', { url: `${ORIGIN}/download` });
  await sleep(2000);
  const bibleBox = await evalJs(
    cdp,
    `(function(){
      const el=document.querySelector('a[href="/bible-online"]')||[...document.querySelectorAll('a,button')].find(n=>/bible online/i.test(n.textContent));
      if(!el) return null;
      const r=el.getBoundingClientRect();
      return {x:r.left+r.width/2,y:r.top+r.height/2};
    })()`
  );
  if (bibleBox) {
    await mouseClick(cdp, bibleBox.x, bibleBox.y);
    await sleep(2500);
    const path = await evalJs(cdp, 'location.pathname');
    report.reader = { pass: /bible-online/i.test(path), path };
  }

  cdp.close();
  console.log(JSON.stringify(report, null, 2));
  const fail =
    report.store.some((r) => !r.pass) ||
    (report.desktop[0] && !report.desktop[0].pass) ||
    report.topNav.some((r) => !r.pass) ||
    !report.reader?.pass;
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
