#!/usr/bin/env node
/**
 * Static site generator for studioannaparos.gr.
 *
 * Renders every route in every language to plain HTML in dist/, copies the
 * static assets, and emits robots.txt, the sitemap, the web manifest and the
 * redirect stubs for the URLs the old WordPress site published.
 * Zero dependencies: `node build.mjs` is the whole toolchain.
 */

import { cp, mkdir, rm, writeFile, readdir, stat } from 'node:fs/promises';
import { dirname, join as joinPath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, routes, legacyRedirects } from './src/content/site.mjs';
import { layout } from './src/layout.mjs';
import { path as routePath, url as routeUrl, outputFile } from './src/lib/routing.mjs';
import { esc, tidy } from './src/lib/html.mjs';

import en from './src/content/en.mjs';
import el from './src/content/el.mjs';
import it from './src/content/it.mjs';
import fr from './src/content/fr.mjs';

import * as home from './src/pages/home.mjs';
import * as accommodation from './src/pages/accommodation.mjs';
import * as location from './src/pages/location.mjs';
import * as gallery from './src/pages/gallery.mjs';
import * as reservations from './src/pages/reservations.mjs';
import * as notice from './src/pages/notice.mjs';
import * as notFound from './src/pages/notfound.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = joinPath(ROOT, 'dist');

const LANGUAGES = [en, el, it, fr];
const TEMPLATES = { home, accommodation, location, gallery, reservations, notice };

/**
 * Fail loudly if a language pack has drifted. Key shapes must match exactly,
 * and so must the length of every array — otherwise a translation can quietly
 * lose an amenity or an FAQ entry without anything complaining.
 */
function checkParity() {
  const shape = (obj, prefix = '') =>
    Object.entries(obj).flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        const own = [`${prefix}${key}[${value.length}]`];
        return value.every((v) => v && typeof v === 'object' && !Array.isArray(v))
          ? own.concat(value.length ? shape(value[0], `${prefix}${key}[].`) : [])
          : own;
      }
      if (value && typeof value === 'object') return shape(value, `${prefix}${key}.`);
      return [`${prefix}${key}`];
    });

  const reference = new Set(shape(en));
  const problems = [];

  for (const pack of LANGUAGES.slice(1)) {
    const keys = new Set(shape(pack));
    for (const key of reference) if (!keys.has(key)) problems.push(`${pack.code}: missing ${key}`);
    for (const key of keys) if (!reference.has(key)) problems.push(`${pack.code}: unexpected ${key}`);
  }

  if (problems.length) {
    throw new Error(`Language packs are out of sync:\n  ${problems.join('\n  ')}`);
  }
}

/** Warn on metadata that search engines will truncate or ignore. */
function auditSeo(pages) {
  const warnings = [];
  const seenTitles = new Map();
  const seenDescriptions = new Map();

  for (const page of pages) {
    const where = `${page.lang} ${page.route}`;
    if (page.title.length > 62) warnings.push(`${where}: title is ${page.title.length} chars`);
    if (page.description.length > 160)
      warnings.push(`${where}: description is ${page.description.length} chars`);
    if (page.description.length < 70)
      warnings.push(`${where}: description is only ${page.description.length} chars`);

    const titleKey = `${page.lang}:${page.title}`;
    if (seenTitles.has(titleKey)) warnings.push(`${where}: duplicate title of ${seenTitles.get(titleKey)}`);
    seenTitles.set(titleKey, where);

    const descKey = `${page.lang}:${page.description}`;
    if (seenDescriptions.has(descKey))
      warnings.push(`${where}: duplicate description of ${seenDescriptions.get(descKey)}`);
    seenDescriptions.set(descKey, where);

    const h1 = page.html.match(/<h1[\s>]/g) ?? [];
    if (h1.length !== 1) warnings.push(`${where}: page has ${h1.length} <h1> elements`);

    if (/<img(?![^>]*\balt=)/.test(page.html)) warnings.push(`${where}: an <img> has no alt`);
  }

  return warnings;
}

function sitemap() {
  const entries = routes
    .map((route) => {
      const alternates = site.languages
        .map(
          (lang) =>
            `    <xhtml:link rel="alternate" hreflang="${lang}" href="${routeUrl(route.key, lang)}"/>`,
        )
        .concat(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${routeUrl(route.key, site.defaultLanguage)}"/>`,
        )
        .join('\n');

      return site.languages
        .map(
          (lang) => `  <url>
    <loc>${routeUrl(route.key, lang)}</loc>
${alternates}
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
      background_color: '#fcfbf9',
      theme_color: '#1d5a96',
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
 * Netlify-style rules: the old language home pages carried auto-generated
 * WordPress slugs and are 301'd to the clean locale roots, plus the usual
 * WordPress endpoints that no longer exist.
 */
function netlifyRedirects() {
  const legacy = legacyRedirects
    .map((r) => `${r.from.padEnd(26)} ${routePath(r.to, r.lang).padEnd(18)} 301`)
    .join('\n');

  return `# Language home pages the old site published under WordPress slugs.
${legacy}

# Legacy WordPress endpoints that no longer exist.
/wp-admin/*                /                  301
/wp-login.php              /                  301
/xmlrpc.php                /                  410
/feed                      /                  301
/comments/feed             /                  301
/wp-json/*                 /                  301
/wp-sitemap.xml            /sitemap.xml       301
/wp-sitemap-index.xsl      /sitemap.xml       301
/sitemap_index.xml         /sitemap.xml       301
`;
}

/**
 * A static stub for each retired URL, so the redirect also works on hosting
 * with no rules engine. It is noindex, canonicalises to the new address and
 * moves the visitor along without needing JavaScript.
 */
function redirectStub(from, target, t) {
  const absolute = `${site.origin}${target}`;
  return `<!doctype html>
<html lang="${esc(t.htmlLang)}">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${esc(target)}">
<title>${esc(t.nav.home)} — ${esc(site.name)}</title>
<link rel="canonical" href="${esc(absolute)}">
<meta name="robots" content="noindex, follow">
</head>
<body>
<p>${esc(t.nav.home)}: <a href="${esc(target)}">${esc(absolute)}</a></p>
</body>
</html>
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
      const body = template.render(pack, pack.code);

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
        bytes: Buffer.byteLength(html),
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

  // Retired URLs.
  const byCode = Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));
  for (const rule of legacyRedirects) {
    const target = routePath(rule.to, rule.lang);
    const file = `${rule.from.replace(/^\/|\/$/g, '')}/index.html`;
    await writePage(file, redirectStub(rule.from, target, byCode[rule.lang]));
  }

  await writeFile(joinPath(DIST, 'sitemap.xml'), sitemap());
  await writeFile(joinPath(DIST, 'robots.txt'), robots());
  await writeFile(joinPath(DIST, 'site.webmanifest'), webmanifest());
  await writeFile(joinPath(DIST, '_redirects'), netlifyRedirects());

  await cp(joinPath(ROOT, 'public'), DIST, { recursive: true });
  await cp(joinPath(ROOT, 'src/styles'), joinPath(DIST, 'styles'), { recursive: true });
  await cp(joinPath(ROOT, 'src/js'), joinPath(DIST, 'scripts'), { recursive: true });

  const warnings = auditSeo(rendered);
  const size = await directorySize(DIST);
  const avgHtml = rendered.reduce((n, p) => n + p.bytes, 0) / rendered.length;
  const biggest = rendered.reduce((a, b) => (a.bytes > b.bytes ? a : b));

  console.log(`Built ${rendered.length} pages + 404 + ${legacyRedirects.length} redirects in ${Date.now() - started}ms`);
  console.log(`  languages : ${site.languages.join(', ')}`);
  console.log(`  routes    : ${routes.map((r) => r.key).join(', ')}`);
  console.log(`  html      : ${(avgHtml / 1024).toFixed(1)} KB average, ${(biggest.bytes / 1024).toFixed(1)} KB largest (${biggest.lang} ${biggest.route})`);
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
