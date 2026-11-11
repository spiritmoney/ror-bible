/**
 * Extract marketing page content and images from rhapsodybible.web.app via headless Chrome.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';

const require = createRequire(
  fs.existsSync('C:/temp/parity/package.json')
    ? 'C:/temp/parity/package.json'
    : path.join(process.cwd(), 'package.json')
);
const puppeteer = require('puppeteer-core');

const PAGES = [
  { slug: 'about', url: 'https://rhapsodybible.web.app/about' },
  { slug: 'partner', url: 'https://rhapsodybible.web.app/partner' },
  { slug: 'give', url: 'https://rhapsodybible.web.app/give' },
];
const OUT = path.join(process.cwd(), 'docs', 'web', 'source-scrape');
const TMP = path.join(process.cwd(), 'tmp', 'source-images');

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ||
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-first-run', '--disable-sync'],
});

for (const { slug, url } of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
  await page.waitForFunction(
    () => {
      const h1 = document.querySelector('h1');
      return h1 && h1.innerText.trim().length > 3;
    },
    { timeout: 90000 }
  ).catch(() => {});

  const extracted = await page.evaluate(() => {
    const skipHost = /googletagmanager|google-analytics|facebook|doubleclick/i;
    const isInChrome = (el) =>
      !el.closest('header') && !el.closest('nav') && !el.closest('footer');

    const blocks = [];
    const root = document.querySelector('#root') || document.body;
    const seen = new Set();

    const pushText = (type, text) => {
      const t = text.replace(/\s+/g, ' ').trim();
      if (!t || t.length < 2 || seen.has(`${type}:${t}`)) return;
      seen.add(`${type}:${t}`);
      blocks.push({ type, text: t });
    };

    for (const el of root.querySelectorAll('h1,h2,h3,h4,p,li,button')) {
      if (!isInChrome(el)) continue;
      if (el.closest('form') && el.tagName !== 'BUTTON') continue;
      const tag = el.tagName.toLowerCase();
      const text = el.innerText?.trim();
      if (!text) continue;
      if (tag === 'li') {
        const parent = el.closest('ul,ol');
        if (parent && parent.dataset.listCaptured) continue;
        if (parent) {
          parent.dataset.listCaptured = '1';
          const items = [...parent.querySelectorAll(':scope > li')].map((li) =>
            li.innerText?.trim()
          ).filter(Boolean);
          if (items.length) blocks.push({ type: 'list', items });
          continue;
        }
      }
      if (tag === 'button') pushText('button', text);
      else pushText(tag, text);
    }

    for (const a of root.querySelectorAll('a[href]')) {
      if (!isInChrome(a)) continue;
      const text = a.innerText?.trim();
      const href = a.getAttribute('href');
      if (!text || !href || href === '#' || href.startsWith('javascript:')) continue;
      const key = `link:${text}:${href}`;
      if (seen.has(key)) continue;
      seen.add(key);
      blocks.push({ type: 'link', text, href });
    }

    const images = [];
    const addImg = (src, alt, width, height, section) => {
      if (!src || skipHost.test(src)) return;
      if (/logo/i.test(alt) && /logo/i.test(src)) return;
      images.push({ src, alt: alt || '', width, height, section });
    };

    for (const img of root.querySelectorAll('img')) {
      if (!isInChrome(img)) continue;
      const rect = img.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) continue;
      let section = '';
      let s = img;
      for (let i = 0; i < 8 && s; i++) {
        const h = s.querySelector?.(':scope > h1, :scope > h2, :scope > h3');
        if (h?.innerText) {
          section = h.innerText.trim().slice(0, 80);
          break;
        }
        s = s.parentElement;
      }
      addImg(
        img.currentSrc || img.src,
        img.alt,
        Math.round(rect.width),
        Math.round(rect.height),
        section
      );
    }

    for (const el of root.querySelectorAll('*')) {
      if (!isInChrome(el)) continue;
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none' && bg.includes('url(')) {
        const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (m && !skipHost.test(m[1])) {
          const rect = el.getBoundingClientRect();
          if (rect.width < 20 || rect.height < 20) continue;
          addImg(m[1], '', Math.round(rect.width), Math.round(rect.height), 'background');
        }
      }
    }

    const title = document.title;
    const metaDesc =
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      '';

    return { title, metaDesc, blocks, images, bodyText: root.innerText?.slice(0, 500) };
  });

  const outPath = path.join(OUT, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(extracted, null, 2));
  console.log(
    'wrote',
    outPath,
    extracted.blocks.length,
    'blocks',
    extracted.images.length,
    'images'
  );

  for (const img of extracted.images) {
    try {
      const absolute = new URL(img.src, url).href;
      const res = await fetch(absolute);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 12);
      const ext = path.extname(new URL(absolute).pathname) || '.bin';
      const fname = `${slug}-${hash}${ext}`;
      fs.writeFileSync(path.join(TMP, fname), buf);
    } catch {
      /* skip */
    }
  }

  await page.close();
}

await browser.close();
console.log('done');
