#!/usr/bin/env node
/**
 * Fails if a web hosting bundle was built with the Electron env flag baked in.
 * Usage: node scripts/assert-web-build-not-electron.mjs [buildDir]
 */
import fs from 'node:fs';
import path from 'node:path';

const buildDir = process.argv[2] || 'build';
const jsDir = path.join(buildDir, 'static', 'js');

if (!fs.existsSync(jsDir)) {
  console.error(`assert-web-build-not-electron: missing ${jsDir}`);
  process.exit(1);
}

const needle = 'REACT_APP_IS_ELECTRON:"true"';
const files = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'));

let hits = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
  if (content.includes(needle)) {
    console.error(`Electron flag found in ${file}`);
    hits += 1;
  }
}

if (hits > 0) {
  console.error(
    `assert-web-build-not-electron: FAIL (${hits} bundle file(s) contain ${needle})`
  );
  process.exit(1);
}

console.log(`assert-web-build-not-electron: OK (${files.length} files checked)`);
