/** CDP: hash before/after for 7 top-nav + 6 sidebar items (packaged, port 9222). */
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
    awaitPromise: true,
  });
  return result.value;
}

async function prep(cdp) {
  await evalJs(cdp, `localStorage.removeItem('@___hshabsgnksb_bsb'); sessionStorage.clear();`);
  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(2000);
  return evalJs(cdp, 'location.hash');
}

function passTop(label, before, after) {
  if (label === 'Bible Online') return /bible-online/i.test(after);
  if (label === 'Blog') return /blog/i.test(after) || before === after;
  if (label === 'Contact') return /download/i.test(after) && /contact/i.test(after);
  if (label === 'Give') return /give/i.test(after) || (/download/i.test(after) && /contact/i.test(after));
  const map = {
    About: /about/i,
    Products: /product/i,
    Partner: /partner/i,
  };
  return map[label]?.test(after) ?? false;
}

function passSide(label, before, after, clicked) {
  if (!clicked) return false;
  if (label === 'Toggle sidebar') return true;
  if (label === 'Library') return /bible-online/i.test(after);
  return /login/i.test(after);
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
  await evalJs(cdp, `localStorage.clear(); sessionStorage.clear();`);
  await evalJs(
    cdp,
    `(async () => { const dbs = await indexedDB.databases?.() || []; for (const db of dbs) { if (db.name) indexedDB.deleteDatabase(db.name); } })()`
  );
  await evalJs(cdp, `location.reload()`);
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
    await sleep(1500);
  }

  const signInVisible = await evalJs(
    cdp,
    `!!document.querySelector('.app-top-sign-in')`
  );
  if (!signInVisible) {
    throw new Error('Expected Sign in visible (logged out) before nav tests');
  }

  const rows = [];
  for (const label of [
    'About',
    'Products',
    'Bible Online',
    'Blog',
    'Partner',
    'Give',
    'Contact',
  ]) {
    const before = await prep(cdp);
    const clicked = await evalJs(
      cdp,
      `(function(){ const el=[...document.querySelectorAll('.app-top-nav-list li')].find(li=>li.innerText.trim().startsWith('${label}')); if(!el) return false; el.click(); return true; })()`
    );
    await sleep(label === 'Blog' ? 400 : 1800);
    const after = await evalJs(cdp, 'location.hash');
    const pass = clicked && passTop(label, before, after);
    rows.push({ item: label, pass, before, after });
    await evalJs(cdp, `location.hash='#/bible-online'`);
    await sleep(800);
    await evalJs(cdp, `document.querySelector('[aria-label="Close"]')?.click()`);
    await sleep(400);
  }

  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(1200);

  for (const label of [
    'Library',
    'Favourites',
    'Store',
    'Downloads',
    'Notifications',
    'Toggle sidebar',
  ]) {
    const before = await prep(cdp);
    const diag = await evalJs(
      cdp,
      `(function(){
        const el=document.querySelector('.app-sidebar [aria-label="${label}"]');
        if(!el) return { clicked:false, reason:'missing' };
        const r=el.getBoundingClientRect();
        const cx=r.left+r.width/2, cy=r.top+r.height/2;
        const hit=document.elementFromPoint(cx,cy);
        el.click();
        return { clicked:true, hit: hit?.tagName, self: el.contains(hit), hash: location.hash, signIn: !!document.querySelector('.app-top-sign-in') };
      })()`
    );
    const clicked = diag?.clicked !== false;
    await sleep(1400);
    const after = await evalJs(cdp, 'location.hash');
    rows.push({
      item: `Side:${label}`,
      pass: passSide(label, before, after, clicked),
      before,
      after,
      diag,
    });
  }

  cdp.close();
  console.log(JSON.stringify(rows, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
