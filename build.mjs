#!/usr/bin/env node
/**
 * Static site generator for aglaiastudios.gr.
 *
 * Renders every route in every language to plain HTML in dist/, copies the
 * static assets, and emits robots.txt, the sitemap and the web manifest.
 * Zero dependencies: `node build.mjs` is the whole toolchain.
 */

import { cp, mkdir, rm, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join as joinPath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, routes } from './src/content/site.mjs';
import { layout } from './src/layout.mjs';
import { path as routePath, url as routeUrl, outputFile } from './src/lib/routing.mjs';
import { esc, tidy } from './src/lib/html.mjs';

import en from './src/content/en.mjs';
import el from './src/content/el.mjs';
import fr from './src/content/fr.mjs';

import cookiesEn from './src/content/cookies-en.mjs';
import cookiesEl from './src/content/cookies-el.mjs';
import cookiesFr from './src/content/cookies-fr.mjs';

import * as home from './src/pages/home.mjs';
import * as studios from './src/pages/studios.mjs';
import * as facilities from './src/pages/facilities.mjs';
import * as location from './src/pages/location.mjs';
import * as gallery from './src/pages/gallery.mjs';
import * as contact from './src/pages/contact.mjs';
import * as cookies from './src/pages/cookies.mjs';
import * as notFound from './src/pages/notfound.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = joinPath(ROOT, 'dist');

const LANGUAGES = [en, el, fr];
const PACKS = Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));
const COOKIES = { en: cookiesEn, el: cookiesEl, fr: cookiesFr };

const TEMPLATES = { home, studios, facilities, location, gallery, contact, cookies };

/** Fail loudly if a language pack is missing keys the templates rely on. */
function checkParity() {
  const shape = (obj, prefix = '') =>
    Object.entries(obj).flatMap(([key, value]) =>
      value && typeof value === 'object' && !Array.isArray(value)
        ? shape(value, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    );

  const reference = new Set(shape(en));
  const problems = [];

  for (const pack of LANGUAGES.slice(1)) {
    const keys = new Set(shape(pack));
    for (const key of reference) {
      if (!keys.has(key)) problems.push(`${pack.code}: missing ${key}`);
    }
    for (const key of keys) {
      if (!reference.has(key)) problems.push(`${pack.code}: unexpected ${key}`);
    }
  }

  if (problems.length) {
    throw new Error(`Language packs are out of sync:\n  ${problems.join('\n  ')}`);
  }
}

/** Warn on metadata that search engines will truncate or ignore. */
function auditSeo(pages) {
  const warnings = [];
  const seenTitles = new Map();

  for (const page of pages) {
    const where = `${page.lang} ${page.route}`;
    if (page.title.length > 62) warnings.push(`${where}: title is ${page.title.length} chars`);
    if (page.description.length > 160)
      warnings.push(`${where}: description is ${page.description.length} chars`);
    if (page.description.length < 70)
      warnings.push(`${where}: description is only ${page.description.length} chars`);

    const key = `${page.lang}:${page.title}`;
    if (seenTitles.has(key)) warnings.push(`${where}: duplicate title of ${seenTitles.get(key)}`);
    seenTitles.set(key, where);

    const h1 = page.html.match(/<h1[\s>]/g) ?? [];
    if (h1.length !== 1) warnings.push(`${where}: page has ${h1.length} <h1> elements`);

    if (/<img(?![^>]*\balt=)/.test(page.html)) warnings.push(`${where}: an <img> has no alt`);
  }

  return warnings;
}

function sitemap(pages) {
  const entries = routes
    .map((route) => {
      const alternates = site.languages
        .map(
          (lang) =>
            `      <xhtml:link rel="alternate" hreflang="${lang}" href="${routeUrl(route.key, lang)}"/>`,
        )
        .join('\n');

      return site.languages
        .map(
          (lang) => `  <url>
    <loc>${routeUrl(route.key, lang)}</loc>
${alternates}
      <xhtml:link rel="alternate" hreflang="x-default" href="${routeUrl(route.key, site.defaultLanguage)}"/>
    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
        )
        .join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`;
}

function webmanifest() {
  return `${JSON.stringify(
    {
      name: site.name,
      short_name: site.name,
      description: en.home.description,
      start_url: '/',
      display: 'standalone',
      background_color: '#fbf9f5',
      theme_color: '#0e5c7e',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    null,
    2,
  )}\n`;
}

/**
 * Redirects for the language-prefixed URLs the old site never published, plus
 * host-level rules. Netlify reads _redirects; other hosts ignore the file.
 */
function netlifyRedirects() {
  return `# Legacy WordPress endpoints that no longer exist.
/wp-admin/*        /                 301
/wp-login.php      /                 301
/xmlrpc.php        /                 410
/feed              /                 301
/comments/feed     /                 301
/wp-json/*         /                 301
/sitemap_index.xml /sitemap.xml      301
/page-sitemap.xml  /sitemap.xml      301
`;
}

async function writePage(relativePath, html) {
  const file = joinPath(DIST, relativePath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

async function directorySize(dir) {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = joinPath(dir, entry.name);
    total += entry.isDirectory() ? await directorySize(full) : (await stat(full)).size;
  }
  return total;
}

async function main() {
  const started = Date.now();
  checkParity();

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const rendered = [];

  for (const pack of LANGUAGES) {
    for (const route of routes) {
      const template = TEMPLATES[route.template];
      const info = template.meta(pack);

      const body = template.render(pack, pack.code, { cookies: COOKIES[pack.code] });

      const html = tidy(
        layout({
          t: pack,
          lang: pack.code,
          route: route.key,
          languages: LANGUAGES,
          body,
          schema: template.schema ? template.schema(pack, pack.code) : [],
          ...info,
        }),
      );

      await writePage(outputFile(route.key, pack.code), html);
      rendered.push({
        lang: pack.code,
        route: route.key,
        title: info.title,
        description: info.description,
        html,
      });
    }
  }

  // A single 404 in the default language; hosts serve it for any unknown path.
  const notFoundInfo = notFound.meta(en);
  await writePage(
    '404.html',
    tidy(
      layout({
        t: en,
        lang: en.code,
        route: 'home',
        languages: LANGUAGES,
        body: notFound.render(en, en.code),
        schema: [],
        ...notFoundInfo,
      }),
    ),
  );

  await writeFile(joinPath(DIST, 'sitemap.xml'), sitemap(rendered));
  await writeFile(joinPath(DIST, 'robots.txt'), robots());
  await writeFile(joinPath(DIST, 'site.webmanifest'), webmanifest());
  await writeFile(joinPath(DIST, '_redirects'), netlifyRedirects());

  await cp(joinPath(ROOT, 'public'), DIST, { recursive: true });
  await cp(joinPath(ROOT, 'src/styles'), joinPath(DIST, 'styles'), { recursive: true });
  await cp(joinPath(ROOT, 'src/js'), joinPath(DIST, 'scripts'), { recursive: true });

  const warnings = auditSeo(rendered);
  const size = await directorySize(DIST);

  console.log(`Built ${rendered.length} pages + 404 in ${Date.now() - started}ms`);
  console.log(`  languages : ${site.languages.join(', ')}`);
  console.log(`  output    : dist/ (${(size / 1_048_576).toFixed(1)} MB)`);

  if (warnings.length) {
    console.log('\nSEO audit:');
    for (const w of warnings) console.log(`  ! ${w}`);
  } else {
    console.log('  SEO audit : clean');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
