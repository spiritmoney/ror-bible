import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(
  fs.existsSync('C:/temp/parity/package.json')
    ? 'C:/temp/parity/package.json'
    : path.join(process.cwd(), 'package.json')
);
const puppeteer = require('puppeteer-core');
const OUT = path.join(process.cwd(), 'docs', 'web', 'source-scrape');

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ||
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-first-run'],
});

for (const [slug, url] of [
  ['partner', 'https://rhapsodybible.web.app/partner'],
  ['give', 'https://rhapsodybible.web.app/give'],
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 10000));

  const extracted = await page.evaluate(() => {
    const isInChrome = (el) =>
      !el.closest('header') && !el.closest('nav') && !el.closest('footer');
    const root = document.querySelector('#root') || document.body;
    const blocks = [];
    const seen = new Set();
    for (const el of root.querySelectorAll('h1,h2,h3,h4,p,li,button')) {
      if (!isInChrome(el)) continue;
      const tag = el.tagName.toLowerCase();
      const text = el.innerText?.replace(/\s+/g, ' ').trim();
      if (!text || seen.has(text)) continue;
      seen.add(text);
      if (tag === 'li') continue;
      blocks.push({ type: tag, text });
    }
    for (const ul of root.querySelectorAll('ul,ol')) {
      if (!isInChrome(ul)) continue;
      const items = [...ul.querySelectorAll(':scope > li')].map((li) =>
        li.innerText?.trim()
      ).filter(Boolean);
      if (items.length) blocks.push({ type: 'list', items });
    }
    const images = [...root.querySelectorAll('img')]
      .filter(isInChrome)
      .map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      }));
    return {
      title: document.title,
      metaDesc:
        document.querySelector('meta[name="description"]')?.content || '',
      blocks,
      images,
    };
  });

  fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(extracted, null, 2));
  console.log(slug, extracted.blocks.length, 'blocks', extracted.images.length, 'images');
  await page.close();
}

await browser.close();
