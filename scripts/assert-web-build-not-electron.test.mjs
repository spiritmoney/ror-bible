#!/usr/bin/env node
/** Dev check: assert-web-build-not-electron passes on web build, fails on electron strings. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const script = path.join('scripts', 'assert-web-build-not-electron.mjs');

function run(buildDir) {
  return spawnSync(process.execPath, [script, buildDir], { encoding: 'utf8' });
}

assert.equal(run('build').status, 0, 'expected current web build to pass');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ror-web-assert-'));
const jsDir = path.join(tmp, 'static', 'js');
fs.mkdirSync(jsDir, { recursive: true });
fs.writeFileSync(
  path.join(jsDir, 'main.js'),
  'process.env={REACT_APP_IS_ELECTRON:"true"};'
);
const bad = run(tmp);
assert.notEqual(bad.status, 0, 'expected fake electron bundle to fail');
fs.rmSync(tmp, { recursive: true, force: true });

console.log('assert-web-build-not-electron self-check: OK');
