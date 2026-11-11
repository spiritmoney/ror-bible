/**
 * Real-mouse navigation check for About / Partner / Give (same tab).
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(
  fs.existsSync('C:/temp/parity/package.json')
    ? 'C:/temp/parity/package.json'
    : path.join(process.cwd(), 'package.json')
);
const puppeteer = require('puppeteer-core');

const BASE = (process.env.SERVE_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
const OUT = path.join(process.cwd(), 'docs', 'web', 'nav-verify.json');

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ||
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  defaultViewport: { width: 1440, height: 900 },
  args: ['--no-first-run', '--disable-sync', '--user-data-dir=' + path.join(process.cwd(), 'tmp', 'chrome-fresh-profile')],
});

const page = await browser.newPage();
const client = await page.createCDPSession();

async function mouseClick(selector) {
  const el = await page.waitForSelector(selector, { timeout: 30000 });
  const box = await el.boundingBox();
  if (!box) throw new Error(`no box for ${selector}`);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x,
    y,
    buttons: 0,
  });
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

const results = [];

await page.goto(`${BASE}/features`, { waitUntil: 'networkidle0', timeout: 120000 });

for (const [label, selector, expectPath] of [
  ['About (main nav)', 'nav.navlinks a[href="/about"]', '/about'],
  ['Partner (utility)', 'nav[aria-label="Utility"] a[href="/partner"]', '/partner'],
  ['Give (utility)', 'nav[aria-label="Utility"] a[href="/give"]', '/give'],
  ['Partner (footer)', 'footer a[href="/partner#churches"]', '/partner'],
  ['Give (footer)', 'footer a[href="/give"]', '/give'],
]) {
  await page.goto(`${BASE}/features`, { waitUntil: 'networkidle0' });
  await mouseClick(selector);
  await page.waitForFunction(
    (p) => location.pathname === p || location.pathname.startsWith(p),
    { timeout: 20000 },
    expectPath
  );
  const hasHeader = await page.$('.site-header');
  const hasFooter = await page.$('footer.u6971eb');
  const hasClose = await page.$('button[aria-label="Close"]');
  results.push({
    label,
    path: await page.evaluate(() => location.pathname),
    header: !!hasHeader,
    footer: !!hasFooter,
    modalClose: !!hasClose,
  });
  await page.goBack({ waitUntil: 'networkidle0' });
}

await page.goto(`${BASE}/partner`, { waitUntil: 'networkidle0' });
await page.type('input[aria-label="Enter ESPEES amount"]', '1', { delay: 30 });
await page.type('input[placeholder="Enter your fullname here"]', 'Test User', { delay: 30 });
results.push({
  label: 'Partner give form fields',
  partnerFormFilled: true,
});

await page.goto(`${BASE}/give`, { waitUntil: 'networkidle0' });
await page.type('input[aria-label="Enter ESPEES amount"]', '1', { delay: 30 });
await page.type('input[placeholder="Enter your fullname here"]', 'Test User', { delay: 30 });
const blogStore = await page.evaluate(() => ({
  blog: !!document.querySelector('a[href*="blog.rorbible"]'),
  store: !!document.querySelector('a[href="/store"]'),
}));
results.push({ label: 'Blog/Store absent on /give', ...blogStore });

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

await browser.close();
