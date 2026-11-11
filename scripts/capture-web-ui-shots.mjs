/**
 * Screenshots for web UI verify → docs/web/shots/
 * Usage: SERVE_URL=http://127.0.0.1:5000 node scripts/capture-web-ui-shots.mjs
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
const OUT = path.join(process.cwd(), 'docs', 'web', 'shots');
const WIDTHS = [1440, 1024, 800, 390];
const ROUTES = [
  { slug: 'products-web', path: '/products/web' },
  { slug: 'products-desktop', path: '/products/desktop' },
  { slug: 'about', path: '/about' },
  { slug: 'partner', path: '/partner' },
  { slug: 'give', path: '/give' },
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ||
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  ignoreHTTPSErrors: true,
  args: ['--no-first-run', '--disable-sync'],
});

const page = await browser.newPage();

for (const { slug, path: routePath } of ROUTES) {
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE}${routePath}`, {
      waitUntil: 'domcontentloaded',
      timeout: 120000,
    });
    await page.waitForSelector('.site-header', { timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));
    await page.waitForSelector('.site-header', { timeout: 60000 }).catch(() => {});
    const overflow = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth > window.innerWidth + 1,
      body: document.body.scrollWidth > window.innerWidth + 1,
    }));
    const file = path.join(OUT, `${slug}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('wrote', file, overflow.doc || overflow.body ? 'OVERFLOW' : 'ok');
  }
}

for (const width of WIDTHS) {
  await page.setViewport({ width, height: 900 });
  await page.goto(`${BASE}/features`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 800));
  await page.waitForSelector('footer.u6971eb');
  const footer = await page.$('footer.u6971eb');
  if (footer) {
    const file = path.join(OUT, `footer-${width}.png`);
    await footer.screenshot({ path: file });
    console.log('wrote', file);
  }
}

await browser.close();
