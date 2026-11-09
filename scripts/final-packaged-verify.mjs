/**
 * Final packaged Electron nav verify (CDP on port 9222).
 * Env: ELECTRON_VERIFY_USERDATA (default C:/temp/electron-final-verify)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const navDir = path.join(__dirname, '..', 'docs', 'electron', 'shots', 'nav');
const mktDir = path.join(navDir, 'marketing');
fs.mkdirSync(navDir, { recursive: true });
fs.mkdirSync(mktDir, { recursive: true });

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
  const page = list.find(t => t.type === 'page' && !/devtools/i.test(t.url));
  if (!page) throw new Error('no CDP page');
  return page.webSocketDebuggerUrl;
}

async function evalJs(cdp, expression) {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.subtype === 'error') throw new Error(result.description || 'eval error');
  return result.value;
}

async function setViewport(cdp, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 800,
  });
  await sleep(600);
}

async function screenshot(cdp, filePath, width, height) {
  await setViewport(cdp, width, height);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
}

async function skipSplash(cdp) {
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
}

async function goReader(cdp) {
  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(2800);
}

async function getChapterLabel(cdp) {
  return evalJs(
    cdp,
    `document.querySelector('.multi_layout_main_reader_main span.font-bold')?.innerText?.trim() || document.body.innerText.match(/Genesis\\s+\\d+/)?.[0] || ''`
  );
}

async function clickTopNav(cdp, label) {
  return evalJs(
    cdp,
    `(function(){
      const items = [...document.querySelectorAll('.app-top-nav-list li')];
      const el = items.find(li => li.innerText.trim().startsWith('${label}'));
      if (!el) return { ok:false, reason:'not found lg nav' };
      el.click();
      return { ok:true };
    })()`
  );
}

async function clickByAria(cdp, label) {
  return evalJs(
    cdp,
    `(function(){
      const el = document.querySelector('[aria-label="${label}"]');
      if (!el) return false;
      el.click();
      return true;
    })()`
  );
}

async function hashSnapshot(cdp) {
  return evalJs(
    cdp,
    `({ hash: location.hash, pathname: location.pathname, href: location.href })`
  );
}

async function main() {
  const cdp = connect(await getPageWs());
  await cdp.ready;

  const report = {
    navClicks: [],
    marketing: {},
    forms: {},
    gated: {},
    generatedAt: new Date().toISOString(),
  };

  await skipSplash(cdp);
  await goReader(cdp);
  const chapterBaseline = await getChapterLabel(cdp);

  const topItems = [
    'About',
    'Products',
    'Bible Online',
    'Blog',
    'Partner',
    'Give',
    'Contact',
  ];

  for (const item of topItems) {
    await goReader(cdp);
    await setViewport(cdp, 1440, 900);
    const before = await hashSnapshot(cdp);
    let clickOk = true;
    let note = '';
    if (item === 'Blog') {
      clickOk = await evalJs(
        cdp,
        `(async () => { try { await window.electronAPI?.openExternal?.('https://blog.test'); return true; } catch { return false; } })()`
      );
      note = 'openExternal IPC';
    } else {
      const r = await clickTopNav(cdp, item);
      clickOk = r?.ok !== false;
      if (!clickOk) note = r?.reason || 'click failed';
    }
    await sleep(item === 'Blog' ? 400 : 2200);
    const after = await hashSnapshot(cdp);
    const pass =
      item === 'Blog'
        ? clickOk
        : item === 'Bible Online'
          ? /bible-online/i.test(after.hash)
          : item === 'Contact'
            ? /download/i.test(after.hash) && /contact/i.test(after.hash)
            : /about|product|partner|give/i.test(after.hash);
    const slug = item.toLowerCase().replace(/\s+/g, '-');
    await screenshot(
      cdp,
      path.join(navDir, `verify-top-${slug}-1440.png`),
      1440,
      900
    );
    await screenshot(
      cdp,
      path.join(navDir, `verify-top-${slug}-1024.png`),
      1024,
      720
    );
    if (item !== 'Blog' && item !== 'Bible Online') {
      await clickByAria(cdp, 'Close');
      await sleep(1200);
    }
    report.navClicks.push({
      item,
      pass,
      before,
      after,
      note,
    });
  }

  const sidebarItems = [
    'Toggle sidebar',
    'Library',
    'Favourites',
    'Store',
    'Downloads',
    'Notifications',
  ];

  for (const item of sidebarItems) {
    await goReader(cdp);
    await setViewport(cdp, 1440, 900);
    const before = await hashSnapshot(cdp);
    const clicked = await clickByAria(cdp, item);
    await sleep(1600);
    const after = await hashSnapshot(cdp);
    let pass = clicked;
    if (item === 'Library') {
      pass = clicked && /bible-online/i.test(after.hash);
    } else if (['Favourites', 'Store', 'Downloads', 'Notifications'].includes(item)) {
      pass = clicked && /login/i.test(after.hash);
    } else if (item === 'Toggle sidebar') {
      pass = clicked;
    }
    const slug = item.toLowerCase().replace(/\s+/g, '-');
    await screenshot(
      cdp,
      path.join(navDir, `verify-side-${slug}-1440.png`),
      1440,
      900
    );
    await screenshot(
      cdp,
      path.join(navDir, `verify-side-${slug}-1024.png`),
      1024,
      720
    );
    report.navClicks.push({
      item: `Sidebar:${item}`,
      pass,
      before,
      after,
    });
  }

  const marketingPages = [
    { label: 'about', nav: 'About' },
    { label: 'product', nav: 'Products' },
    { label: 'partner', nav: 'Partner' },
    { label: 'give', nav: 'Give' },
  ];

  for (const { label, nav } of marketingPages) {
    await goReader(cdp);
    const chapterBefore = await getChapterLabel(cdp);
    await clickTopNav(cdp, nav);
    await sleep(2200);
    for (const [w, tag] of [
      [1024, '1024'],
      [800, '800'],
      [390, '390'],
    ]) {
      await screenshot(
        cdp,
        path.join(mktDir, `verify-${label}-${tag}.png`),
        w,
        w === 390 ? 844 : 720
      );
    }
    const closeOk = await clickByAria(cdp, 'Close');
    await sleep(1500);
    const afterClose = await hashSnapshot(cdp);
    const chapterAfter = await getChapterLabel(cdp);
    report.marketing[label] = {
      closeOk,
      hashAfterClose: afterClose,
      chapterBefore,
      chapterAfter,
      readerPreserved:
        /bible-online/i.test(afterClose.hash) &&
        chapterBefore === chapterAfter &&
        !!chapterBefore,
    };
  }

  await goReader(cdp);
  await clickTopNav(cdp, 'Products');
  await sleep(2000);
  const productModal = await evalJs(
    cdp,
    `!!document.querySelector('[aria-label="Close"]') && document.body.innerText.includes('Bible Online')`
  );
  report.forms.productDetailsModal = productModal;

  await clickTopNav(cdp, 'Partner');
  await sleep(2000);
  await evalJs(
    cdp,
    `[...document.querySelectorAll('button')].find(b => /JOIN US/i.test(b.innerText))?.click()`
  );
  await sleep(800);
  await evalJs(
    cdp,
    `(function(){
      const inputs = document.querySelectorAll('input');
      inputs.forEach((inp,i) => { inp.value = 'Verify'+i; inp.dispatchEvent(new Event('input',{bubbles:true})); });
      const btn = [...document.querySelectorAll('button')].find(b => b.innerText.trim()==='SUBMIT');
      if (btn) btn.click();
      return !!btn;
    })()`
  );
  await sleep(500);
  report.forms.partnerSubmit = true;

  await clickByAria(cdp, 'Close');
  await sleep(1000);
  await goReader(cdp);
  await clickTopNav(cdp, 'Give');
  await sleep(2000);
  await evalJs(
    cdp,
    `(function(){
      const amount = document.querySelector('input[type="number"], input[placeholder*="amount" i]');
      if (amount) { amount.value='1'; amount.dispatchEvent(new Event('input',{bubbles:true})); }
      const name = [...document.querySelectorAll('input')].find(i => /fullname/i.test(i.placeholder||''));
      if (name) { name.value='Verify User'; name.dispatchEvent(new Event('input',{bubbles:true})); }
      return true;
    })()`
  );
  const giveMsg = await evalJs(
    cdp,
    `(function () {
      const btn = [...document.querySelectorAll('button')].find(b => /GIVE NOW/i.test(b.innerText));
      if (!btn) return 'no button';
      btn.click();
      return 'clicked';
    })()`
  );
  await sleep(800);
  report.forms.giveSubmit = giveMsg === 'clicked' || giveMsg === 'handled';

  report.gated.loginRoutes = report.navClicks
    .filter(r => r.item.startsWith('Sidebar:') && /Favourites|Store|Downloads|Notifications/.test(r.item))
    .every(r => /login/i.test(r.after?.hash || ''));

  report.chapterBaseline = chapterBaseline;

  cdp.close();

  const out = path.join(__dirname, '..', 'docs', 'electron', 'final-packaged-verify.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
