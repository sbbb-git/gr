/**
 * URL construction.
 *
 * The default language lives at the root (`/facilities/`); the others sit under
 * a locale prefix (`/fr/facilities/`). Slugs are shared across languages, which
 * makes the hreflang mapping exactly one-to-one and keeps every URL the old
 * WordPress site published still valid.
 */

import { site, routes } from '../content/site.mjs';

const BY_KEY = new Map(routes.map((r) => [r.key, r]));

/** Site-root-relative path for a route in a given language, always trailing-slashed. */
export function path(key, lang = site.defaultLanguage) {
  const route = BY_KEY.get(key);
  if (!route) throw new Error(`Unknown route: "${key}"`);

  const prefix = lang === site.defaultLanguage ? '' : `/${lang}`;
  return route.slug ? `${prefix}/${route.slug}/` : `${prefix}/`;
}

/** Absolute URL, for canonicals, hreflang, Open Graph and the sitemap. */
export function url(key, lang = site.defaultLanguage) {
  return `${site.origin}${path(key, lang)}`;
}

/** Where the built HTML file goes inside dist/. */
export function outputFile(key, lang = site.defaultLanguage) {
  return `${path(key, lang).replace(/^\/|\/$/g, '')}/index.html`.replace(/^\//, '');
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
