#!/usr/bin/env node
/** Single-page app static server for production build verification. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'build');
const port = Number(process.env.PORT || 4173);

const types = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json',
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(
      root,
      urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '')
    );
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(root, 'index.html');
    }
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).on('error', () => {
      res.statusCode = 500;
      res.end('read error');
    }).pipe(res);
  })
  .listen(port, () => {
    console.log(`serve-spa: http://127.0.0.1:${port} → ${root}`);
  });
