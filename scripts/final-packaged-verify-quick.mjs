/** Quick CDP checks: marketing close + gated login + product overlay + forms */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mktDir = path.join(__dirname, '..', 'docs', 'electron', 'shots', 'nav', 'marketing');
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
  const page =
    list.find(
      t =>
        t.type === 'page' &&
        !/devtools/i.test(t.url) &&
        (t.url.startsWith('app://') || /Rhapsody Bible/i.test(t.title || ''))
    ) ||
    list.find(t => t.type === 'page' && !/devtools/i.test(t.url));
  if (!page) throw new Error('no page');
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

async function shot(cdp, name, w, h) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile: w < 800,
  });
  await sleep(500);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(mktDir, name), Buffer.from(data, 'base64'));
}

async function main() {
  const cdp = connect(await getPageWs());
  await cdp.ready;
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
  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(2500);
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(400);

  const report = { marketing: {}, gated: {}, forms: {} };

  const chapter0 = await evalJs(
    cdp,
    `document.querySelector('.multi_layout_main_reader_main span.font-bold')?.innerText?.trim()||document.body.innerText.match(/Genesis\\s+\\d+/)?.[0]||''`
  );

  for (const [nav, slug] of [
    ['About', 'about'],
    ['Products', 'product'],
    ['Partner', 'partner'],
    ['Give', 'give'],
  ]) {
    await evalJs(cdp, `location.hash='#/bible-online'`);
    await sleep(2000);
    const chBefore = await evalJs(
      cdp,
      `document.querySelector('.multi_layout_main_reader_main span.font-bold')?.innerText?.trim()||''`
    );
    await evalJs(
      cdp,
      `(function(){ const el=[...document.querySelectorAll('.app-top-nav-list li')].find(li=>li.innerText.trim().startsWith('${nav}')); el?.click(); return !!el; })()`
    );
    await sleep(2000);
    for (const [w, t] of [
      [1024, '1024'],
      [800, '800'],
      [390, '390'],
    ]) {
      await shot(cdp, `verify-${slug}-${t}.png`, w, w === 390 ? 844 : 720);
    }
    await evalJs(
      cdp,
      `document.querySelector('[aria-label="Close"]')?.click()`
    );
    await sleep(1200);
    const hash = await evalJs(cdp, 'location.hash');
    const chAfter = await evalJs(
      cdp,
      `document.querySelector('.multi_layout_main_reader_main span.font-bold')?.innerText?.trim()||''`
    );
    report.marketing[slug] = {
      hashAfterClose: hash,
      chapterBefore: chBefore,
      chapterAfter: chAfter,
      pass:
        /bible-online/i.test(hash) && chBefore === chAfter && chBefore.length > 0,
    };
  }

  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(1500);
  for (const label of ['Favourites', 'Store', 'Downloads', 'Notifications']) {
    await evalJs(cdp, `location.hash='#/bible-online'`);
    await sleep(800);
    await evalJs(
      cdp,
      `document.querySelector('[aria-label="${label}"]')?.click()`
    );
    await sleep(900);
    const hash = await evalJs(cdp, 'location.hash');
    report.gated[label] = /login/i.test(hash);
  }

  await evalJs(cdp, `location.hash='#/bible-online'`);
  await sleep(1500);
  await evalJs(
    cdp,
    `(function(){ const el=[...document.querySelectorAll('.app-top-nav-list li')].find(li=>li.innerText.trim().startsWith('Products')); el?.click(); return !!el; })()`
  );
  await sleep(2000);
  report.forms.productOverlay = await evalJs(
    cdp,
    `!!document.querySelector('[aria-label="Close"]') && document.body.innerText.includes('Bible Online')`
  );

  await evalJs(
    cdp,
    `(function(){ [...document.querySelectorAll('button')].find(b=>/JOIN US/i.test(b.innerText))?.click(); return true; })()`
  );
  await sleep(500);
  report.forms.partnerSubmit = await evalJs(
    cdp,
    `(function(){ document.querySelectorAll('input').forEach((inp,i)=>{inp.value='T'+i;}); const b=[...document.querySelectorAll('button')].find(x=>x.innerText.trim()==='SUBMIT'); b?.click(); return !!b; })()`
  );

  await evalJs(
    cdp,
    `document.querySelector('[aria-label="Close"]')?.click()`
  );
  await sleep(800);
  await evalJs(
    cdp,
    `(function(){ const el=[...document.querySelectorAll('.app-top-nav-list li')].find(li=>li.innerText.trim().startsWith('Give')); el?.click(); return !!el; })()`
  );
  await sleep(2000);
  report.forms.giveSubmit = await evalJs(
    cdp,
    `(function(){
      const amount=document.querySelector('input[type="number"]');
      if(amount){amount.value='1';amount.dispatchEvent(new Event('input',{bubbles:true}));}
      const name=[...document.querySelectorAll('input')].find(i=>/fullname/i.test(i.placeholder||''));
      if(name){name.value='Verify User';name.dispatchEvent(new Event('input',{bubbles:true}));}
      const btn=[...document.querySelectorAll('button')].find(b=>/GIVE NOW/i.test(b.innerText));
      btn?.click();
      return !!btn;
    })()`
  );

  report.chapterBaseline = chapter0;
  cdp.close();
  const out = path.join(__dirname, '..', 'docs', 'electron', 'final-packaged-verify-quick.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
