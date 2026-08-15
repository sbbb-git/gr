/**
 * URL construction.
 *
 * Unlike a site with one slug per page, studioannaparos.gr published a
 * *different* slug in every language — `/accomodation/`, `/it/sistemazione/`,
 * `/fr/hebergement/`, `/el/διαμονή/`. Those URLs are what search engines have
 * indexed, so the route table carries the slug per language and this module
 * simply looks it up. The default language lives at the root; the others sit
 * under a locale prefix.
 *
 * Greek slugs are real UTF-8 on disk and percent-encoded in markup, which is
 * what the old WordPress install served and what the sitemap listed.
 */

import { site, routes } from '../content/site.mjs';

const BY_KEY = new Map(routes.map((r) => [r.key, r]));

/** The raw, un-encoded slug for a route in a language. */
function slugFor(key, lang) {
  const route = BY_KEY.get(key);
  if (!route) throw new Error(`Unknown route: "${key}"`);
  const slug = route.slugs[lang];
  if (slug === undefined) throw new Error(`Route "${key}" has no slug for "${lang}"`);
  return slug;
}

/** Site-root-relative path, percent-encoded, always trailing-slashed. */
export function path(key, lang = site.defaultLanguage) {
  const prefix = lang === site.defaultLanguage ? '' : `/${lang}`;
  const slug = slugFor(key, lang);
  return slug ? `${prefix}/${encodeURIComponent(slug)}/` : `${prefix}/`;
}

/** Absolute URL, for canonicals, hreflang, Open Graph and the sitemap. */
export function url(key, lang = site.defaultLanguage) {
  return `${site.origin}${path(key, lang)}`;
}

/** Where the built HTML file goes inside dist/ — raw UTF-8, not encoded. */
export function outputFile(key, lang = site.defaultLanguage) {
  const prefix = lang === site.defaultLanguage ? '' : `${lang}/`;
  const slug = slugFor(key, lang);
  return `${prefix}${slug ? `${slug}/` : ''}index.html`;
}

/** The same page in every language — used to emit alternate links. */
export function alternates(key) {
  return site.languages.map((lang) => ({ lang, href: url(key, lang) }));
}

export function routeByKey(key) {
  const route = BY_KEY.get(key);
  if (!route) throw new Error(`Unknown route: "${key}"`);
  return route;
}

export { routes };
