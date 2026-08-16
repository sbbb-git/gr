/**
 * Responsive image helpers.
 *
 * Reads src/content/media.json (written by scripts/optimize_images.py) so that
 * every <img> ships intrinsic width/height — no layout shift — plus a WebP
 * srcset and a JPEG fallback for the handful of clients that still need one.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { esc } from './html.mjs';

const MEDIA = JSON.parse(
  readFileSync(fileURLToPath(new URL('../content/media.json', import.meta.url)), 'utf8'),
);

export function media(slug) {
  const entry = MEDIA[slug];
  if (!entry) throw new Error(`Unknown image slug: "${slug}"`);
  return entry;
}

export function hasMedia(slug) {
  return Boolean(MEDIA[slug]);
}

/** Absolute URL of the JPEG rendition — used for Open Graph and JSON-LD. */
export function imageUrl(slug, origin) {
  return `${origin}${media(slug).src}`;
}

function srcset(entry) {
  if (!entry.widths.length) return '';
  const base = entry.src.replace(/\.jpg$/, '');
  return entry.widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
}

/**
 * Render a <picture>.
 *
 * @param {string} slug      key in media.json
 * @param {object} options
 * @param {string} options.alt         required; pass '' only for decoration
 * @param {string} [options.sizes]     the `sizes` attribute; defaults to full width
 * @param {string} [options.className] class applied to the <img>
 * @param {boolean} [options.priority] eager-load and fetch with high priority
 * @param {string} [options.ratio]     CSS aspect-ratio override, e.g. '4 / 3'
 */
export function picture(slug, options = {}) {
  const {
    alt,
    sizes = '100vw',
    className = '',
    priority = false,
    ratio,
    pictureClass = '',
    deferred = false,
  } = options;

  const entry = media(slug);
  const set = srcset(entry);
  const aspect = ratio || `${entry.width} / ${entry.height}`;

  const imgAttrs = [
    // A deferred image ships no `src` at all. `loading="lazy"` is no help
    // inside the slideshow: every slide sits at inset 0, so the browser counts
    // all six as visible and fetches all six. Script promotes them one ahead of
    // where the viewer is, which is why the home page costs one photograph
    // rather than six. Without script only the first slide is ever shown.
    deferred ? `data-src="${esc(entry.src)}"` : `src="${esc(entry.src)}"`,
    `alt="${esc(alt ?? '')}"`,
    `width="${entry.width}"`,
    `height="${entry.height}"`,
    className && `class="${esc(className)}"`,
    priority ? 'fetchpriority="high"' : 'loading="lazy"',
    priority ? '' : 'decoding="async"',
    `style="--img-ratio:${aspect};--img-tint:${esc(entry.colour)}"`,
  ]
    .filter(Boolean)
    .join(' ');

  const srcsetAttr = deferred ? 'data-srcset' : 'srcset';
  const source = set
    ? `<source type="image/webp" ${srcsetAttr}="${esc(set)}" sizes="${esc(sizes)}">`
    : '';

  return `<picture${pictureClass ? ` class="${esc(pictureClass)}"` : ''}>${source}<img ${imgAttrs}></picture>`;
}

/**
 * The `<link rel="preload">` for a hero image, so the largest contentful paint
 * starts downloading before the CSS has even parsed.
 */
export function preload(slug, sizes = '100vw') {
  const entry = media(slug);
  const set = srcset(entry);
  if (!set) return `<link rel="preload" as="image" href="${esc(entry.src)}" fetchpriority="high">`;
  return `<link rel="preload" as="image" type="image/webp" imagesrcset="${esc(set)}" imagesizes="${esc(sizes)}" fetchpriority="high">`;
}

export const allMedia = MEDIA;
