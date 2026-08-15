/**
 * Inline SVG icon set — drawn on a 24×24 grid, stroked with currentColor.
 *
 * Inlining keeps them themable and costs no extra request; the whole set is a
 * few kB and only the icons a page actually uses are emitted.
 */

const PATHS = {
  // Feature / amenity icons
  wave: '<path d="M2 9c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><path d="M2 15c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>',
  view: '<circle cx="12" cy="9" r="3.5"/><path d="M2 17h20"/><path d="M12 2.5v1.5M12 14v1.5M4.9 9h1.6M17.5 9h1.6M6.9 3.9l1.1 1.1M16 13l1.1 1.1M17.1 3.9 16 5M8 13l-1.1 1.1"/>',
  sparkle:
    '<path d="M12 3c.6 3.6 1.8 4.8 5.4 5.4-3.6.6-4.8 1.8-5.4 5.4-.6-3.6-1.8-4.8-5.4-5.4C10.2 7.8 11.4 6.6 12 3Z"/><path d="M18 14.5c.3 1.8.9 2.4 2.7 2.7-1.8.3-2.4.9-2.7 2.7-.3-1.8-.9-2.4-2.7-2.7 1.8-.3 2.4-.9 2.7-2.7Z"/><path d="M6.5 15c.25 1.5.75 2 2.25 2.25-1.5.25-2 .75-2.25 2.25-.25-1.5-.75-2-2.25-2.25C5.75 17 6.25 16.5 6.5 15Z"/>',
  parking:
    '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 17V7h3.2a3.1 3.1 0 0 1 0 6.2H9.5"/>',
  ladder:
    '<path d="M8 21V7a2.5 2.5 0 0 1 5 0"/><path d="M16 21V7a2.5 2.5 0 0 1 5 0"/><path d="M8 11h8M8 15h8M8 19h8"/><path d="M2 21c1.6 0 1.6 1.2 3.2 1.2"/>',
  quiet:
    '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z"/>',
  heart:
    '<path d="M12 20s-7.5-4.7-7.5-9.8A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.9C19.5 15.3 12 20 12 20Z"/>',
  pottery:
    '<path d="M8.5 3h7l-1 2.6a5.6 5.6 0 0 0 .6 5.2 6.5 6.5 0 0 1-1.4 9.1H10.3a6.5 6.5 0 0 1-1.4-9.1 5.6 5.6 0 0 0 .6-5.2Z"/><path d="M9 13.5h6"/>',

  // Added for Anna Studios
  beach:
    '<path d="M12 21V11"/><path d="M3.6 11a8.4 8.4 0 0 1 16.8 0Z"/><path d="M12 2.6c2 0 3.4 3.6 3.4 8.4M12 2.6C10 2.6 8.6 6.2 8.6 11"/><path d="M4 21h16"/>',
  kitchen:
    '<rect x="3" y="3.5" width="18" height="17" rx="2.5"/><path d="M3 8.5h18"/><circle cx="8.5" cy="6" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="6" r=".9" fill="currentColor" stroke="none"/><circle cx="9.5" cy="13.5" r="2.2"/><circle cx="15.5" cy="13.5" r="2.2"/>',
  bed: '<path d="M2.5 19v-9"/><path d="M2.5 13.5h19V19"/><path d="M6.5 13.5v-3h5.5a3 3 0 0 1 3 3"/><circle cx="18" cy="9.5" r="2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/><path d="M6.5 15h3"/>',
  play: '<path d="M8 5.5 18.5 12 8 18.5Z"/>',
  pause: '<path d="M9 5.5v13M15 5.5v13"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  tripadvisor:
    '<circle cx="7" cy="12.5" r="4.2"/><circle cx="17" cy="12.5" r="4.2"/><circle cx="7" cy="12.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="17" cy="12.5" r="1.4" fill="currentColor" stroke="none"/><path d="M8.4 7.2A9.7 9.7 0 0 1 12 6.5c1.3 0 2.5.25 3.6.7"/><path d="M4.2 8.6 2.5 6.8h4"/>',
  whatsapp:
    '<path d="M3.5 20.5 4.9 16A8.3 8.3 0 1 1 8 19.1Z"/><path d="M9 9.3c.3-.7.6-.8 1-.8h.6c.2 0 .5 0 .7.5l.7 1.7c.1.3 0 .5-.1.7l-.4.5c-.2.2-.3.4-.1.7a6 6 0 0 0 2.7 2.3c.3.1.5.1.7-.1l.5-.6c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5a2 2 0 0 1-1.4 1.6c-.5.2-1.2.2-2.4-.3a9.4 9.4 0 0 1-4.6-4.2c-.5-1-.7-1.9-.5-2.6Z"/>',
  viber:
    '<path d="M12 2.8c4.6 0 7.5 2.8 7.5 7.1 0 4.4-2.9 7.2-7.5 7.2h-.6l-3.2 3.3v-3.9C6 15.6 4.5 13.4 4.5 9.9c0-4.3 2.9-7.1 7.5-7.1Z"/><path d="M9.4 7.4c.2-.5.5-.6.8-.6h.4c.2 0 .4 0 .5.4l.5 1.2c.1.2 0 .4-.1.5l-.3.4c-.1.1-.2.3 0 .5a4.3 4.3 0 0 0 1.9 1.6c.2.1.4.1.5-.1l.4-.4c.1-.1.3-.2.5-.1l1.1.6c.2.1.3.2.3.4a1.4 1.4 0 0 1-1 1.1c-.4.1-.9.1-1.7-.2a6.7 6.7 0 0 1-3.3-3c-.4-.7-.5-1.4-.4-1.9Z"/><path d="M13.2 5.6a3.9 3.9 0 0 1 3.2 3.1"/>',
  // The scallop from the original Anna Studios logo, redrawn as geometry.
  // Its own 64x64 grid, so `icon()` overrides the viewBox for this one.
  shell:
    '<path d="M32 55 L5.57 47.42 Q4.09 42.45 8.79 40.25 Q8.79 35.06 13.92 34.28 Q15.38 29.3 20.52 30.01 Q23.34 25.65 28.07 27.78 Q32 24.4 35.93 27.78 Q40.66 25.65 43.48 30.01 Q48.62 29.3 50.08 34.28 Q55.21 35.06 55.21 40.25 Q59.91 42.45 58.43 47.42 Z" fill="currentColor" fill-opacity=".14"/>' +
    '<path d="M32 55 L5.57 47.42 Q4.09 42.45 8.79 40.25 Q8.79 35.06 13.92 34.28 Q15.38 29.3 20.52 30.01 Q23.34 25.65 28.07 27.78 Q32 24.4 35.93 27.78 Q40.66 25.65 43.48 30.01 Q48.62 29.3 50.08 34.28 Q55.21 35.06 55.21 40.25 Q59.91 42.45 58.43 47.42 Z" stroke-width="2.6"/>' +
    '<path d="M28.62 52.85 L10.06 41.05 M29.37 51.99 L14.9 35.41 M30.33 51.36 L21.15 31.37 M31.43 51.04 L28.28 29.27 M32.57 51.04 L35.72 29.27 M33.67 51.36 L42.85 31.37 M34.63 51.99 L49.1 35.41 M35.38 52.85 L53.94 41.05" stroke-width="2" opacity=".8"/>',

  // Amenities
  shower:
    '<path d="M4 12h9a4.5 4.5 0 0 0-9 0Z"/><path d="M8.5 12V6.2A2.7 2.7 0 0 1 11.2 3.5h1.5A2.8 2.8 0 0 1 15.5 6.3V8"/><path d="M17 12v9"/><path d="M6 16v1.5M9 15.5V17M11.5 17v1.5"/>',
  ac: '<rect x="2.5" y="4" width="19" height="8" rx="2.5"/><path d="M6 8h12"/><path d="M7 16c0 1.6 1.5 1.6 1.5 3.2M12 15.5c0 1.8 1.5 1.8 1.5 3.6M17 16c0 1.6-1.5 1.6-1.5 3.2"/>',
  tv: '<rect x="2.5" y="4" width="19" height="12.5" rx="2.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',
  wifi: '<path d="M2.8 9a13.5 13.5 0 0 1 18.4 0"/><path d="M6.2 12.6a8.6 8.6 0 0 1 11.6 0"/><path d="M9.6 16.2a3.8 3.8 0 0 1 4.8 0"/><circle cx="12" cy="19.6" r=".9" fill="currentColor" stroke="none"/>',
  safe: '<rect x="2.5" y="4" width="19" height="16" rx="2.5"/><circle cx="10" cy="12" r="3.6"/><path d="M10 8.4v-1M10 16.6v1M6.4 12h-1M14.6 12h1"/><path d="M18 9.5v5"/>',
  hairdryer:
    '<path d="M3 8.5A4.5 4.5 0 0 1 7.5 4h5.7a4.5 4.5 0 0 1 0 9H7.5A4.5 4.5 0 0 1 3 8.5Z"/><path d="M9.5 13v3.5a3 3 0 0 0 3 3h.8"/><path d="M17.5 8.5H21"/>',
  fridge:
    '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M5 10h14"/><path d="M8.5 6v2M8.5 12.5v3"/>',
  espresso:
    '<path d="M3.5 9h13v4.5a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5Z"/><path d="M16.5 10.5h1.8a2.6 2.6 0 0 1 0 5.2h-1.2"/><path d="M7 5.5c0-.8.8-.8.8-1.6M11 5.5c0-.8.8-.8.8-1.6"/><path d="M2.5 21.5h16"/>',
  kettle:
    '<path d="M6 9h10l1.6 10.2A2 2 0 0 1 15.6 21.5H6.4a2 2 0 0 1-2-2.3Z"/><path d="M16 11.5 21 8"/><path d="M8 9V6.6A2.1 2.1 0 0 1 10.1 4.5h1.8A2.1 2.1 0 0 1 14 6.6V9"/>',
  toaster:
    '<rect x="2.5" y="8.5" width="19" height="11" rx="2.5"/><path d="M7.5 8.5V6.5M12 8.5V5M16.5 8.5V6.5"/><path d="M17.5 14h1.5"/>',
  plates:
    '<circle cx="8" cy="12" r="6.5"/><circle cx="8" cy="12" r="2.8"/><path d="M17 21.5v-6.2a3.2 3.2 0 0 0 3.2-3.2L19.5 3h-2l-.7 9.1a3.2 3.2 0 0 0 3.2 3.2"/>',
  sunbed:
    '<path d="M2.5 19.5h19"/><path d="M4 19.5 5.5 13h13l1.5 6.5"/><path d="M5.5 13 8 6.5l9 2.6"/><circle cx="18.5" cy="4.5" r="2"/>',

  // Interface
  pin: '<path d="M12 21.5s7-6 7-11.2a7 7 0 1 0-14 0C5 15.5 12 21.5 12 21.5Z"/><circle cx="12" cy="10" r="2.8"/>',
  phone:
    '<path d="M6.2 3.5h3l1.6 4-2 1.4a11.5 11.5 0 0 0 5.8 5.8l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  users:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M17.5 14.4a6.5 6.5 0 0 1 4 5.6"/>',
  camera:
    '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3v9l-6-3Z"/>',
  star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8Z"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  arrowRight: '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
  arrowUp: '<path d="M12 20V4"/><path d="m6 10 6-6 6 6"/>',
  chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
  chevronLeft: '<path d="m14.5 6-6 6 6 6"/>',
  chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  menu: '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
  external:
    '<path d="M13.5 4H20v6.5"/><path d="M20 4 11 13"/><path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
  expand: '<path d="M9 3.5H3.5V9M15 3.5H20.5V9M9 20.5H3.5V15M15 20.5H20.5V15"/>',

  // Social — filled marks, no stroke
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>',
  facebook:
    '<path d="M14.5 21.5v-8h2.7l.5-3.3h-3.2V8.1c0-.95.35-1.6 1.8-1.6h1.55V3.6a22 22 0 0 0-2.5-.13c-2.6 0-4.35 1.55-4.35 4.4v2.32H8.2v3.3h2.8v8Z" fill="currentColor" stroke="none"/>',
};

/**
 * @param {string} name  key of PATHS
 * @param {object} [options]
 * @param {string} [options.className]
 * @param {string} [options.title] accessible name; omit for decorative icons
 */
export function icon(name, options = {}) {
  const body = PATHS[name];
  if (!body) throw new Error(`Unknown icon: "${name}"`);

  const { className = 'icon', title } = options;
  const a11y = title
    ? `role="img" aria-label="${title.replace(/"/g, '&quot;')}"`
    : 'aria-hidden="true"';

  const box = name === 'shell' ? '0 0 64 64' : '0 0 24 24';

  return (
    `<svg class="${className}" ${a11y} viewBox="${box}" fill="none" ` +
    `stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ` +
    `stroke-linejoin="round">${body}</svg>`
  );
}

export const iconNames = Object.keys(PATHS);
