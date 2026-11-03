import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotsDir = path.join(__dirname, '..', 'docs', 'electron', 'shots');
fs.mkdirSync(shotsDir, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getPageWs() {
  const res = await fetch('http://127.0.0.1:9222/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  if (!page) throw new Error('no page');
  return page.webSocketDebuggerUrl;
}

function cdp(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = Math.floor(Math.random() * 1e9);
    ws.on('open', () => ws.send(JSON.stringify({ id, method, params })));
    ws.on('message', raw => {
      const msg = JSON.parse(String(raw));
      if (msg.id !== id) return;
      ws.close();
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    });
    ws.on('error', reject);
  });
}

async function evalJs(wsUrl, expression) {
  const { result } = await cdp(wsUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.type === 'object' && result.subtype === 'error') {
    throw new Error(result.description || 'eval error');
  }
  return result.value;
}

async function screenshot(wsUrl, name, width, height) {
  await cdp(wsUrl, 'Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(800);
  const { data } = await cdp(wsUrl, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(shotsDir, name), Buffer.from(data, 'base64'));
}

async function navHash(wsUrl, hashPath) {
  await evalJs(wsUrl, `location.hash = '${hashPath}'`);
  await sleep(2500);
}

async function main() {
  const wsUrl = await getPageWs();
  const out = {};

  out.windowOpens = true;
  out.loginUrl = await evalJs(wsUrl, 'location.hash');
  out.requireUndefined = (await evalJs(wsUrl, 'typeof require')) === 'undefined';
  out.electronAPI = await evalJs(wsUrl, '!!window.electronAPI?.isElectron');
  out.cspHeader = await evalJs(
    wsUrl,
    `(async () => {
      const r = await fetch(location.href);
      return r.headers.get('content-security-policy') || '';
    })()`
  );

  await screenshot(wsUrl, 'login-1440.png', 1440, 900);
  await screenshot(wsUrl, 'login-1024.png', 1024, 720);

  await navHash(wsUrl, '/dash');
  out.dashHash = await evalJs(wsUrl, 'location.hash');
  out.dashRedirectsLogin = out.dashHash.includes('/login');

  await navHash(wsUrl, '/bible-online');
  out.bibleHash = await evalJs(wsUrl, 'location.hash');
  out.bibleBodyTextLen = await evalJs(wsUrl, 'document.body?.innerText?.length || 0');
  await screenshot(wsUrl, 'bible-online-1440.png', 1440, 900);
  await screenshot(wsUrl, 'bible-online-1024.png', 1024, 720);

  const beforeNav = await evalJs(wsUrl, 'location.href');
  await evalJs(wsUrl, `location.href = 'https://example.com'`);
  await sleep(1500);
  out.externalNavBlocked = (await evalJs(wsUrl, 'location.href')) === beforeNav;

  try {
    const browserWs = (await (await fetch('http://127.0.0.1:9222/json/version')).json())
      .webSocketDebuggerUrl;
    const bounds = await cdp(browserWs, 'Browser.getWindowForTarget');
    await cdp(browserWs, 'Browser.setWindowBounds', {
      windowId: bounds.windowId,
      bounds: { width: 800, height: 600, windowState: 'normal' },
    });
    await sleep(500);
    const boundsAfter = await cdp(browserWs, 'Browser.getWindowBounds', {
      windowId: bounds.windowId,
    });
    out.minWidthEnforced = boundsAfter.bounds.width >= 1024;
  } catch {
    out.minWidthEnforced = null;
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
