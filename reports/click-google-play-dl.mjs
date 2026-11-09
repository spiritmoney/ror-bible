import WebSocket from 'ws';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const PORT = '4193';
const ORIGIN = `http://127.0.0.1:${PORT}`;
const CDP = '9345';
const LW =
  'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = `C:\\temp\\chrome-gp-verify-${Date.now()}`;
spawn(
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  [
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${CDP}`,
    '--no-first-run',
    `${ORIGIN}/download`,
  ],
  { detached: true, stdio: 'ignore' }
).unref();

await sleep(5000);
const list = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
const page = list.find((t) => t.type === 'page' && t.url.startsWith(ORIGIN));
if (!page) throw new Error('no page');

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.on('message', (raw) => {
  const msg = JSON.parse(String(raw));
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(msg.error) : resolve(msg.result);
  }
});
await new Promise((r) => ws.on('open', r));
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

await send('ServiceWorker.disable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await sleep(500);

const badges = (
  await send('Runtime.evaluate', {
    expression: `[...document.querySelectorAll('a')].filter(a=>/google play/i.test(a.textContent)).map(a=>{const r=a.getBoundingClientRect();return {href:a.href,x:r.left+r.width/2,y:r.top+r.height/2};})`,
    returnByValue: true,
  })
).result.value;

const opened = [];
for (const b of badges) {
  const x = b.x;
  const y = b.y;
  const before = (await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json())
    .length;
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
    await send('Input.dispatchMouseEvent', {
      type,
      x,
      y,
      button: 'left',
      clickCount: 1,
      buttons: type === 'mousePressed' ? 1 : 0,
    });
  }
  await sleep(1000);
  const after = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
  const tab = after.find((t) => t.url === LW || t.url.startsWith(LW));
  opened.push({ href: b.href, opened: tab?.url || '(none)' });
  await send('Page.navigate', { url: `${ORIGIN}/download` });
  await sleep(2000);
}

console.log(JSON.stringify({ count: badges.length, opened, expected: LW }));
ws.close();
