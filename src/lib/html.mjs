/** Small HTML helpers shared by every template. No dependencies by design. */

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape a value for use in text content or a quoted attribute. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Escape for a JSON-LD <script> body: only `<` needs neutralising. */
export function jsonLd(data) {
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
}

/** Join template fragments, dropping null/undefined/false so `cond && html` works. */
export function join(parts, separator = '\n') {
  return parts.filter((p) => p || p === 0).join(separator);
}

/** Build an attribute string from an object, skipping empty values. */
export function attrs(map) {
  return Object.entries(map)
    .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== '')
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');
}

/** Class list built from strings and conditionals. */
export function cx(...values) {
  return values.filter(Boolean).join(' ');
}

/**
 * Wrap plain paragraphs. Strings are treated as trusted HTML because all copy
 * lives in this repository — never pass user input through here.
 */
export function paragraphs(list, className = '') {
  const cls = className ? ` class="${esc(className)}"` : '';
  return (Array.isArray(list) ? list : [list]).map((p) => `<p${cls}>${p}</p>`).join('\n');
}

/** Collapse insignificant whitespace between tags to keep the output tidy. */
export function tidy(html) {
  return html
    .replace(/\n\s*\n+/g, '\n')
    .replace(/^\s+$/gm, '')
    .trim();
}
