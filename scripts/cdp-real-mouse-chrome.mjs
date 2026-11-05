/**
 * Packaged app / PWA: real mouse via CDP Input.dispatchMouseEvent (no element.click).
 */
import WebSocket from 'ws';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const ORIGIN = 'https://rhapsodybiblestaging.web.app';
const TOP = [
  ['Features', `${ORIGIN}/features`],
  ['Products', `${ORIGIN}/products/web`],
  ['Pricing', `${ORIGIN}/pricing`],
  ['Download', `${ORIGIN}/download`],
  ['About', `${ORIGIN}/about`],
  ['Contact', `${ORIGIN}/download#contact`],
];

const SIDE = [
  ['Library', 'library-modal'],
  ['Favourites', 'login'],
  ['Store', 'login'],
  ['Downloads', 'library-modal'],
  ['Alerts', 'notifications-modal'],
];

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
      (t.url.startsWith('app://') ||
        t.url.startsWith('http://localhost') ||
        /Rhapsody Bible/i.test(t.title || ''))
  );
  if (!page) throw new Error(`no page: ${JSON.stringify(list.map(x => x.url))}`);
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
  await cdp.send('Page.bringToFront');
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
  await sleep(2000);
  return evalJs(cdp, `!!document.querySelector('.app-top-sign-in')`);
}

async function probeAt(cdp, x, y, handlerSelector) {
  return evalJs(
    cdp,
    `(function(){
      const handler = document.querySelector(${JSON.stringify(handlerSelector)});
      const top = document.elementFromPoint(${x}, ${y});
      if (!top) return { hit: null, handlerMatch: false, chain: [] };
      const chain = [];
      let el = top;
      while (el) {
        const pe = getComputedStyle(el).pointerEvents;
        const ar = getComputedStyle(el).webkitAppRegion || getComputedStyle(el).getPropertyValue('-webkit-app-region');
        chain.push({ tag: el.tagName, cls: (el.className||'').toString().slice(0,80), pe, appRegion: ar });
        el = el.parentElement;
      }
      const interactive = top.closest('a,button,[role=button]');
      return {
        hit: { tag: top.tagName, cls: (top.className||'').toString().slice(0,80) },
        handlerMatch: handler && (top === handler || handler.contains(top)),
        interactiveTag: interactive ? interactive.tagName : null,
        chain,
      };
    })()`
  );
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

async function resetReader(cdp, mode) {
  await evalJs(
    cdp,
    `(function(){
      document.querySelectorAll('.modal.show button[data-bs-dismiss="modal"], .modal.show [data-bs-dismiss="modal"]').forEach(el => el.click());
    })()`
  );
  await evalJs(cdp, `location.hash='#/bible-online'; location.reload()`);
  await sleep(3500);
  const splash = await evalJs(
    cdp,
    `!!document.querySelector('button[aria-label="Skip splash screen"]')`
  );
  if (splash) {
    await evalJs(
      cdp,
      `document.querySelector('button[aria-label="Skip splash screen"]').click()`
    );
    await sleep(1000);
  }
  await sleep(1000);
  if (mode === 'pwa') {
    await prepPwaShell(cdp);
  }
}

async function waitForSidebar(cdp) {
  for (let i = 0; i < 30; i++) {
    const count = await evalJs(
      cdp,
      `document.querySelectorAll('.app-sidebar button.app-sidebar-item').length`
    );
    if (count >= 5) {
      return true;
    }
    await sleep(500);
  }
  return false;
}

async function clickSidebar(cdp, label) {
  await cdp.send('Page.bringToFront');
  const handlerSel = `.app-sidebar button[aria-label="${label}"]`;
  const box = await evalJs(
    cdp,
    `(function(){
      const el = document.querySelector(${JSON.stringify(handlerSel)});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2, w: r.width, h: r.height };
    })()`
  );
  if (!box) {
    return { item: `Side:${label}`, pass: false, error: 'no handler' };
  }
  const before = await evalJs(cdp, 'location.hash');
  const libBefore = await evalJs(
    cdp,
    `!!document.querySelector('#exampleModalCenteredScrollablelibrary:not(.hidden)')`
  );
  const probe = await probeAt(cdp, box.x, box.y, handlerSel);
  await realClick(cdp, box.x, box.y);
  await sleep(2500);
  const after = await evalJs(cdp, 'location.hash');
  const libAfter = await evalJs(
    cdp,
    `!!document.querySelector('#exampleModalCenteredScrollablelibrary:not(.hidden)')`
  );
  const expect = SIDE.find(s => s[0] === label)[1];
  const modalShown = await evalJs(
    cdp,
    `!!document.querySelector('.modal.show, .modal-backdrop.show')`
  );
  let pass = false;
  if (expect === 'noop') {
    pass = before === after && !modalShown && !libAfter;
  } else if (expect === 'login') {
    pass = /login/i.test(after);
  } else if (expect === 'library-modal') {
    const hasLibraryUi = await evalJs(
      cdp,
      `!!document.querySelector('.library-popup .title')`
    );
    pass = before === after && modalShown && hasLibraryUi;
  } else if (expect === 'notifications-modal') {
    const hasAlertsUi = await evalJs(
      cdp,
      `!!document.querySelector('.Notification-popup .title')`
    );
    pass = before === after && modalShown && hasAlertsUi;
  }
  return {
    item: `Side:${label}`,
    box,
    probe,
    hashBefore: before,
    hashAfter: after,
    pass,
  };
}

async function clickTop(cdp, label, expectedUrl, pwa = false) {
  await cdp.send('Page.bringToFront');
  const handlerSel = `.app-top-nav-list button.app-top-nav-item`;
  const mobileSel = `.app-top-mobile-menu-btn`;
  const isNarrow = await evalJs(cdp, `window.innerWidth < 1024`);
  if (isNarrow) {
    const menuBox = await evalJs(
      cdp,
      `(function(){
        const el = document.querySelector(${JSON.stringify(mobileSel)});
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width/2, y: r.top + r.height/2 };
      })()`
    );
    if (menuBox) {
      await realClick(cdp, menuBox.x, menuBox.y);
      await sleep(400);
    }
  }
  const box = await evalJs(
    cdp,
    `(function(){
      const buttons = [...document.querySelectorAll('.app-top-bar button, .app-top-nav-list button')];
      const el = buttons.find(b => {
        const t = b.textContent.trim();
        return t.startsWith(${JSON.stringify(label)}) && b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().height > 0;
      });
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    })()`
  );
  if (!box) return { item: label, pass: false, error: 'no button' };
  if (!pwa) {
    await evalJs(cdp, `window.electronAPI?.clearExternalOpenLog?.()`);
  } else {
    await evalJs(
      cdp,
      `window.__pwaOpens = []; window.electronAPI?.clearExternalOpenLog?.();`
    );
  }
  const before = await evalJs(cdp, 'location.hash');
  await realClick(cdp, box.x, box.y);
  await sleep(900);
  const after = await evalJs(cdp, 'location.hash');
  const opened = pwa
    ? await evalJs(
        cdp,
        `(async () => {
          if (window.__pwaOpens?.length) {
            return window.__pwaOpens[window.__pwaOpens.length - 1];
          }
          const log = await window.electronAPI?.getExternalOpenLog?.();
          return (log && log[log.length - 1]) || '';
        })()`
      )
    : await evalJs(
        cdp,
        `(async () => { const log = await window.electronAPI?.getExternalOpenLog?.(); return (log && log[log.length - 1]) || ''; })()`
      );
  const pass =
    before === after &&
    (!expectedUrl ||
      opened === expectedUrl ||
      opened.startsWith(expectedUrl.split('#')[0]));
  return { item: label, hashBefore: before, hashAfter: after, urlOpened: opened, pass };
}

async function prepPwaShell(cdp) {
  await cdp.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'display-mode', value: 'standalone' }],
  });
  await evalJs(
    cdp,
    `(function(){
      document.documentElement.classList.add('is-app-shell');
      window.__pwaOpens = [];
      window.open = function(url) {
        window.__pwaOpens.push(String(url));
        return null;
      };
    })()`
  );
}

async function runAtWidth(cdp, mode, width, rows) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: width <= 390 ? 844 : 900,
    deviceScaleFactor: 1,
    mobile: width <= 390,
  });
  const signIn = await prepLoggedOut(cdp);
  if (mode === 'pwa') {
    await prepPwaShell(cdp);
  }
  if (!signIn && mode === 'electron') {
    throw new Error('Expected Sign in visible (logged out)');
  }
  await waitForSidebar(cdp);
  for (const [label] of SIDE) {
    await resetReader(cdp, mode);
    const row = await clickSidebar(cdp, label);
    rows.push({ ...row, viewport: width });
  }
  for (const [label, url] of TOP) {
    await resetReader(cdp, mode);
    const row = await clickTop(cdp, label, url, mode === 'pwa');
    rows.push({ ...row, viewport: width });
  }
}

async function main() {
  const mode = process.argv.includes('--pwa') ? 'pwa' : 'electron';
  const widths = mode === 'pwa' ? [1440, 390] : [1440];
  const cdp = connect(await getPageWs());
  await cdp.ready;
  await cdp.send('Page.bringToFront');
  await sleep(15000);
  const rows = [];
  for (const width of widths) {
    await runAtWidth(cdp, mode, width, rows);
  }
  cdp.close();
  console.log(JSON.stringify({ mode, rows }, null, 2));
  if (rows.some(r => !r.pass)) process.exit(1);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
