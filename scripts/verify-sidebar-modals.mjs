/**
 * CDP + Input.dispatchMouseEvent: Library / Downloads / Alerts must not show visible .modal.
 *
 * PWA / static build (local): starts http://127.0.0.1:5500 from ./build
 *   node scripts/verify-sidebar-modals.mjs
 *
 * Packaged Electron (must already be running with --remote-debugging-port=9222)
 *   node scripts/verify-sidebar-modals.mjs --electron
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const require = createRequire(import.meta.url);
function loadPuppeteer() {
  const candidates = [
    path.join(repoRoot, 'node_modules', 'puppeteer-core'),
    'C:/temp/parity/node_modules/puppeteer-core',
  ];
  for (const c of candidates) {
    try {
      return require(c);
    } catch {
      /* try next */
    }
  }
  throw new Error(
    'puppeteer-core not found — install it or use C:/temp/parity/node_modules'
  );
}
const puppeteer = loadPuppeteer();

const delay = ms => new Promise(r => setTimeout(r, ms));

const CHROME =
  process.env.CHROME_PATH ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';

function serveBuild(port) {
  const buildDir = path.join(repoRoot, 'build');
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/' || p === '') p = '/index.html';
    const filePath0 = path.join(buildDir, p.replace(/^\//, ''));
    const sendFile = filePath => {
      if (!filePath.startsWith(buildDir)) {
        res.writeHead(403);
        res.end();
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          if (p !== '/index.html') {
            sendFile(path.join(buildDir, 'index.html'));
            return;
          }
          res.writeHead(404);
          res.end();
          return;
        }
        const ext = path.extname(filePath);
        const types = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.woff2': 'font/woff2',
          '.woff': 'font/woff',
          '.ttf': 'font/ttf',
          '.webp': 'image/webp',
          '.map': 'application/json',
          '.webmanifest': 'application/manifest+json',
        };
        res.setHeader(
          'Content-Type',
          types[ext] || 'application/octet-stream'
        );
        res.writeHead(200);
        res.end(data);
      });
    };
    sendFile(filePath0);
  });
  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

async function getPackagedWsUrl() {
  return new Promise((resolve, reject) => {
    http
      .get('http://127.0.0.1:9222/json/version', res => {
        let d = '';
        res.on('data', c => (d += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(d).webSocketDebuggerUrl);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function visibleModalCount(page) {
  return page.evaluate(() => {
    const vis = el => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return (
        s.display !== 'none' &&
        s.visibility !== 'hidden' &&
        !el.classList.contains('hidden') &&
        parseFloat(s.opacity || '1') > 0.01 &&
        r.width > 0 &&
        r.height > 0
      );
    };
    return [...document.querySelectorAll('.modal')].filter(vis).length;
  });
}

async function cdpClick(client, label) {
  const { result } = await client.send('Runtime.evaluate', {
    expression: `
      (function () {
        const want = ${JSON.stringify(label)};
        const el = [...document.querySelectorAll('button')]
          .find(b => (b.getAttribute('aria-label') || '').trim() === want);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      })()
    `,
    returnByValue: true,
  });
  if (!result.value) throw new Error('No button: ' + label);
  const { x, y } = result.value;
  await client.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x,
    y,
    button: 'left',
    clickCount: 1,
  });
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x,
    y,
    button: 'left',
    clickCount: 1,
  });
}

async function verifyScenario(page, client, name, pwaStandalone) {
  await client.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [
      {
        name: 'display-mode',
        value: pwaStandalone ? 'standalone' : 'browser',
      },
    ],
  });

  await delay(1500);
  await page.waitForSelector('.app-sidebar-rail-list button[aria-label="Library"]', {
    timeout: 120000,
  });
  const rail = await page.evaluate(() =>
    [...document.querySelectorAll('.app-sidebar-rail-list button')].map(b => ({
      label: (b.getAttribute('aria-label') || '').trim(),
      disabled: b.disabled,
    }))
  );
  if (rail.length < 5) {
    throw new Error(
      `${name}: expected sidebar rail buttons, got ${rail.length}: ${JSON.stringify(rail)}`
    );
  }
  const bad = rail.filter(
    b => /^(Library|Downloads|Alerts)$/i.test(b.label) && !b.disabled
  );
  if (bad.length) {
    throw new Error(
      `${name}: Library/Downloads/Alerts must be disabled: ${JSON.stringify(bad)}`
    );
  }

  const labels = ['Library', 'Downloads', 'Alerts'];
  const loc0 = await page.evaluate(() => ({
    hash: location.hash,
    pathname: location.pathname,
  }));

  for (const l of labels) {
    const before = await visibleModalCount(page);
    await cdpClick(client, l);
    await delay(500);
    const after = await visibleModalCount(page);
    if (after > before) {
      throw new Error(
        `${name}: ${l} visible .modal ${before}->${after}`
      );
    }
    const loc = await page.evaluate(() => ({
      hash: location.hash,
      pathname: location.pathname,
    }));
    if (loc.hash !== loc0.hash || loc.pathname !== loc0.pathname) {
      throw new Error(
        `${name}: ${l} navigation changed ${JSON.stringify(loc0)} -> ${JSON.stringify(loc)}`
      );
    }
  }

  return { name, pwaStandalone, railTiles: rail.length };
}

async function runSuite(page, client, tag, startUrl) {
  const scenarios = [];

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(startUrl, { waitUntil: 'networkidle0', timeout: 180000 });
  scenarios.push({
    tag,
    loggedIn: false,
    ...(await verifyScenario(page, client, `${tag}-out-standalone`, true)),
  });
  scenarios.push({
    tag,
    loggedIn: false,
    ...(await verifyScenario(page, client, `${tag}-out-browser`, false)),
  });

  await page.evaluate(() => {
    localStorage.setItem('@___hshabsgnksb_bsb', 'cdp-verify@example.com');
  });
  await page.goto(startUrl, { waitUntil: 'networkidle0', timeout: 180000 });
  scenarios.push({
    tag,
    loggedIn: true,
    ...(await verifyScenario(page, client, `${tag}-in-standalone`, true)),
  });
  scenarios.push({
    tag,
    loggedIn: true,
    ...(await verifyScenario(page, client, `${tag}-in-browser`, false)),
  });

  return scenarios;
}

async function main() {
  const useElectron = process.argv.includes('--electron');
  let browser;
  let server;
  let closeBrowser = true;

  if (useElectron) {
    const ws = await getPackagedWsUrl();
    browser = await puppeteer.connect({
      browserWSEndpoint: ws,
      defaultViewport: null,
    });
    closeBrowser = false;
  } else {
    server = await serveBuild(5500);
    browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: true,
      args: ['--no-sandbox', '--window-size=1400,900'],
    });
  }

  const pages = await browser.pages();
  const page =
    pages.find(p => {
      try {
        const u = p.url();
        return u.includes('bible-online') || u.includes('rhapsody');
      } catch {
        return false;
      }
    }) ||
    pages[0] ||
    (await browser.newPage());
  await page.setViewport({ width: 1280, height: 900 });
  const client = await page.target().createCDPSession();

  const startUrl = useElectron
    ? 'app://rhapsody/index.html#/bible-online'
    : 'http://127.0.0.1:5500/bible-online';

  await page.goto(startUrl, {
    waitUntil: 'networkidle0',
    timeout: 180000,
  });
  await page.waitForSelector('button[aria-label="Library"]', {
    timeout: 120000,
  });

  const out = { startUrl, scenarios: [] };
  out.scenarios.push(
    ...(await runSuite(page, client, useElectron ? 'electron' : 'pwa', startUrl))
  );

  if (server) server.close();
  if (closeBrowser) await browser.close();
  else await browser.disconnect();

  console.log(JSON.stringify(out, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
