/**
 * Compare nav full-window screenshots to a git baseline (top 68px strip).
 * Usage: node compare.mjs [baselineRef=6c33563]
 * Requires pngjs + pixelmatch (npm i -D pngjs pixelmatch), or NODE_PATH=C:/temp/parity/node_modules
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..', '..', '..');
const requireFromRoot = createRequire(path.join(repoRoot, 'package.json'));

function loadPngTools() {
  try {
    return {
      PNG: requireFromRoot('pngjs').PNG,
      pixelmatch: requireFromRoot('pixelmatch'),
    };
  } catch {
    try {
      const reqLocal = createRequire(import.meta.url);
      return {
        PNG: reqLocal('pngjs').PNG,
        pixelmatch: reqLocal('pixelmatch'),
      };
    } catch {
      return null;
    }
  }
}

function cropTop68(pngBuffer, PNG) {
  const img = PNG.sync.read(pngBuffer);
  const h = Math.min(68, img.height);
  const out = new PNG({ width: img.width, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < img.width; x++) {
      const si = (img.width * y + x) << 2;
      const di = (img.width * y + x) << 2;
      for (let i = 0; i < 4; i++) out.data[di + i] = img.data[si + i];
    }
  }
  return PNG.sync.write(out);
}

function diffPng(aBuf, bBuf, PNG, pixelmatch) {
  const a = PNG.sync.read(aBuf);
  const b = PNG.sync.read(bBuf);
  if (a.width !== b.width || a.height !== b.height) {
    return {
      match: false,
      diffPx: -1,
      diffPct: -1,
      note: `size mismatch ${a.width}x${a.height} vs ${b.width}x${b.height}`,
    };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const diffPx = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0.1,
  });
  const diffPct = (diffPx / (a.width * a.height)) * 100;
  return {
    match: diffPx === 0,
    diffPx,
    diffPct: Math.round(diffPct * 1e6) / 1e6,
  };
}

function gitShowPng(ref, relPath) {
  try {
    return execSync(`git show ${ref}:${relPath.replace(/\\/g, '/')}`, {
      cwd: repoRoot,
      encoding: null,
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

const tools = loadPngTools();
const baselineRef = process.argv[2] || process.env.NAV_TOP_BAR_BASELINE_REF || '6c33563';
const tags = ['1920', '2560', '1440', '1024', '800'];
const results = [];

if (!tools) {
  console.log(
    JSON.stringify({
      error:
        'Install pngjs and pixelmatch in the repo (npm i -D pngjs pixelmatch) or set NODE_PATH to a folder that has them',
      baselineRef,
    })
  );
  process.exit(1);
}

const { PNG, pixelmatch } = tools;

for (const tag of tags) {
  const rel = `docs/electron/shots/nav/app-chrome-electron-${tag}.png`;
  const curPath = path.join(__dirname, `app-chrome-electron-${tag}.png`);
  const baseBuf = gitShowPng(baselineRef, rel);
  if (!baseBuf || !fs.existsSync(curPath)) {
    results.push({ tag, note: !baseBuf ? 'no baseline in git' : 'missing current file', rel });
    continue;
  }
  const curBuf = fs.readFileSync(curPath);
  const a = cropTop68(baseBuf, PNG);
  const b = cropTop68(curBuf, PNG);
  const d = diffPng(a, b, PNG, pixelmatch);
  results.push({ tag, baselineRef, ...d });
}

console.log(JSON.stringify({ baselineRef, results }, null, 2));
