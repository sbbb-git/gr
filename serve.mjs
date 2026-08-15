#!/usr/bin/env node
/**
 * Minimal static server for previewing dist/ locally.
 *
 * Exists so `npm start` works with no dependencies installed. It mirrors the
 * two behaviours a real host provides: directory URLs resolve to index.html,
 * and unknown paths serve 404.html with a 404 status.
 *
 *   node serve.mjs [port]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function resolve(urlPath) {
  // normalize() collapses any ../ segments before they escape dist/.
  const safe = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, safe);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
    return { file, status: 200 };
  } catch {
    return { file: join(ROOT, '404.html'), status: 404 };
  }
}

createServer(async (request, response) => {
  const { file, status } = await resolve(request.url);
  try {
    const body = await readFile(file);
    response.writeHead(status, {
      'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Anna Studios — http://localhost:${PORT}`);
});
