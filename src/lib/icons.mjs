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

  return (
    `<svg class="${className}" ${a11y} viewBox="0 0 24 24" fill="none" ` +
    `stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ` +
    `stroke-linejoin="round">${body}</svg>`
  );
}

export const iconNames = Object.keys(PATHS);
