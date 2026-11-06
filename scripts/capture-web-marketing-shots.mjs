/**
 * Plain Chrome tab screenshots for marketing routes (no compare / parity).
 * Usage: node scripts/capture-web-marketing-shots.mjs [baseUrl=https://localhost]
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

const BASE = (process.argv[2] || 'https://localhost').replace(/\/$/, '');
const OUT = path.join(
  process.cwd(),
  'docs',
  'electron',
  'shots',
  'web'
);
const ROUTES = [
  { slug: 'home', path: '/' },
  { slug: 'features', path: '/features' },
  { slug: 'pricing', path: '/pricing' },
  { slug: 'download', path: '/download' },
  { slug: 'about', path: '/about' },
  { slug: 'products-web', path: '/products/web' },
  { slug: 'partner', path: '/partner' },
  { slug: 'give', path: '/give' },
];
const WIDTHS = [1440, 390];

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ||
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  ignoreHTTPSErrors: true,
  args: ['--ignore-certificate-errors', '--no-first-run', '--disable-sync'],
});

const page = await browser.newPage();
for (const { slug, path: routePath } of ROUTES) {
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE}${routePath}`, {
      waitUntil: 'domcontentloaded',
      timeout: 120000,
    });
    await page.waitForSelector('.site-header', { timeout: 60000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));
    const file = path.join(OUT, `${slug}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('wrote', file);
  }
}

await browser.close();
