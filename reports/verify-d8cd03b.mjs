/** Post-fix verify: store badges, navlinks (+ utility Bible Online), PWA --app window. */
import WebSocket from 'ws';
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';

const PORT = process.env.VERIFY_PORT || '4192';
const ORIGIN = `http://127.0.0.1:${PORT}`;
const CDP = process.env.CDP_PORT || '9340';
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

async function getChromePage(originPrefix) {
  const list = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
  const page = list.find(
    (t) => t.type === 'page' && t.url.startsWith(originPrefix)
  );
  if (!page) throw new Error(`no page for ${originPrefix}`);
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

async function chromeStoreAndNav() {
  execSync(
    `powershell -NoProfile -Command "Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*Chrome*' } | Stop-Process -Force -ErrorAction SilentlyContinue"`,
    { stdio: 'ignore' }
  );
  await sleep(800);
  const profile = 'C:\\\\temp\\\\chrome-verify-d8cd03b-fix';
  fs.rmSync(profile, { recursive: true, force: true });
  spawn(
    'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    [
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${CDP}`,
      '--no-first-run',
      '--disable-background-networking',
      `${ORIGIN}/download`,
    ],
    { detached: true, stdio: 'ignore' }
  ).unref();
  await sleep(4500);

  const cdp = connect(await getChromePage(ORIGIN));
  await cdp.ready;
  await cdp.send('ServiceWorker.disable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(600);

  const badges = await evalJs(
    cdp,
    `(function(){
      const card = document.querySelector('.u78cdf0 .uc74f11') || document.querySelector('.uc74f11');
      if (!card) return [];
      return [...card.querySelectorAll('a[href^="http"]')].map(a=>({
        label: a.textContent.replace(/\\s+/g,' ').trim().slice(0,48),
        href: a.href,
        rect: a.getBoundingClientRect()
      }));
    })()`
  );
  const store = [];
  const seen = new Set();
  for (const b of badges) {
    if (!b.rect.height) continue;
    const key = b.label;
    if (seen.has(key)) continue;
    seen.add(key);
    const before = (await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json()).length;
    await mouseClick(cdp, b.rect.x + b.rect.width / 2, b.rect.y + b.rect.height / 2);
    await sleep(1200);
    const afterList = await (
      await fetch(`http://127.0.0.1:${CDP}/json/list`)
    ).json();
    const opened =
      afterList.find((t) => t.url === b.href || t.url.startsWith(b.href.split('#')[0]))
        ?.url || '';
    store.push({ badge: key, href: b.href, opened: opened || '(none)' });
  }

  const NAV = [
    ['Features', '.navlinks a[href="/features"]', 'route', '/features'],
    ['Products', '.navlinks [data-mega-trigger]', 'mega', null],
    ['Pricing', '.navlinks a[href="/pricing"]', 'route', '/pricing'],
    ['Download', '.navlinks a[href="/download"]', 'route', '/download'],
    ['About', '.navlinks a[href="#"]', 'modal', '/about'],
    ['Bible Online', '[data-website-nav="bible-online"]', 'route', '/bible-online'],
    ['Get the app', 'a.getapp', 'route', '/download'],
  ];

  const nav = [];
  for (const [label, sel, kind] of NAV) {
    await cdp.send('Page.navigate', { url: `${ORIGIN}/download` });
    await sleep(2500);
    const box = await evalJs(
      cdp,
      `(function(){const el=document.querySelector(${JSON.stringify(sel)});if(!el)return null;const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()`
    );
    if (!box) {
      nav.push({ label, kind, result: 'missing' });
      continue;
    }
    await mouseClick(cdp, box.x, box.y);
    await sleep(2200);
    const path = await evalJs(cdp, 'location.pathname');
    const hash = await evalJs(cdp, 'location.hash');
    nav.push({ label, kind, path, hash });
  }

  cdp.close();
  return { store, nav };
}

async function pwaAppLaunch(urlPath) {
  const profile = `C:\\\\temp\\\\chrome-pwa-${urlPath.replace(/[^a-z]+/gi, '-')}`;
  fs.rmSync(profile, { recursive: true, force: true });
  const port = CDP === '9340' ? '9341' : '9342';
  const appUrl = `${ORIGIN}${urlPath}`;
  spawn(
    'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    [
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${port}`,
      '--no-first-run',
      '--disable-background-networking',
      `--app=${appUrl}`,
    ],
    { detached: true, stdio: 'ignore' }
  ).unref();
  await sleep(5000);
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = list.find((t) => t.type === 'page' && t.url.startsWith(ORIGIN));
  if (!page) return { urlPath, error: 'no page' };
  const cdp = connect(page.webSocketDebuggerUrl);
  await cdp.ready;
  await sleep(2000);
  const snap = await evalJs(
    cdp,
    `({
      path: location.pathname,
      search: location.search,
      isAppShell: (function(){
        const d=window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches;
        const e=!!window.electronAPI?.isElectron;
        const b=window.matchMedia&&window.matchMedia('(display-mode: browser)').matches;
        if(e)return true;
        if(b)return false;
        if(d)return true;
        return false;
      })(),
      session: sessionStorage.getItem('rhapsody:installedLaunch')
    })`
  );
  cdp.close();
  return { urlPath, ...snap };
}

async function main() {
  const report = { store: [], nav: [], pwa: [] };
  try {
    const chrome = await chromeStoreAndNav();
    report.store = chrome.store;
    report.nav = chrome.nav;
  } catch (e) {
    report.chromeError = String(e);
  }
  report.pwa.push(await pwaAppLaunch('/bible-online?source=pwa'));
  report.pwa.push(await pwaAppLaunch('/?source=pwa'));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
