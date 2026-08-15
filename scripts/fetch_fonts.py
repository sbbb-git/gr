#!/usr/bin/env python3
"""Vendor the webfonts the site uses, so nothing is requested from Google.

Self-hosting keeps visitor IP addresses away from a third party (no consent
banner needed for fonts) and removes a render-blocking cross-origin round trip.

Two families are produced, both of which draw Greek and Latin from a single
design — Anna Studios publishes in Greek, Italian, French and English, and a
headline must not switch character halfway through a language:

* ``Alegreya`` — the headline face. A humanist serif with a genuine upright
  Greek, so Greek headings sit level with Latin ones instead of leaning.
* ``Commissioner`` — body text, low-contrast and quiet at small sizes, with the
  same Greek/Latin coverage.

    python3 scripts/fetch_fonts.py
"""

from __future__ import annotations

import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "fonts"

# A browser UA is required — Google serves woff2 only to modern clients.
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# (file prefix, css2 family spec, exposed family name, subsets, weight override)
SOURCES = [
    (
        "alegreya",
        "Alegreya:ital,wght@0,400..800;1,400..600",
        "Anna Display",
        {"latin", "latin-ext", "greek", "greek-ext"},
        None,
    ),
    (
        "commissioner",
        "Commissioner:wght@300..700",
        "Commissioner",
        {"latin", "latin-ext", "greek"},
        None,
    ),
]


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request) as response:
        return response.read()


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for stale in OUT.glob("*.woff2"):
        stale.unlink()

    blocks = ["/* Self-hosted webfonts. Regenerate with: python3 scripts/fetch_fonts.py */"]

    for prefix, spec, family, subsets, weights in SOURCES:
        css = get(f"https://fonts.googleapis.com/css2?family={spec}&display=swap").decode()

        # css2 emits a `/* subset */` comment immediately before each @font-face.
        chunks = re.split(r"/\*\s*([a-z-]+)\s*\*/", css)
        for i in range(1, len(chunks), 2):
            subset, face = chunks[i], chunks[i + 1]
            if subset not in subsets or "@font-face" not in face:
                continue

            source = re.search(r"url\((https://[^)]+\.woff2)\)", face)
            if not source:
                continue

            italic = "font-style: italic" in face
            weight = re.search(r"font-weight:\s*([^;]+);", face)
            weight_value = weight.group(1).strip() if weight else "400"

            name = f"{prefix}-{subset}{'-italic' if italic else ''}"
            if weights and weight_value in weights:
                name += f"-{weight_value}"
            name += ".woff2"

            (OUT / name).write_bytes(get(source.group(1)))

            face = face.replace(source.group(1), f"/fonts/{name}")
            face = re.sub(r"font-family:\s*'[^']+'", f"font-family: '{family}'", face)
            if weights and weight_value in weights:
                face = re.sub(
                    r"font-weight:\s*[^;]+;", f"font-weight: {weights[weight_value]};", face
                )

            blocks.append(face.strip())
            print(f"  {name:36s} {family:16s} {(OUT / name).stat().st_size / 1024:6.1f} KB")

    (OUT / "fonts.css").write_text("\n\n".join(blocks) + "\n")
    total = sum(f.stat().st_size for f in OUT.glob("*.woff2"))
    print(f"\n{len(list(OUT.glob('*.woff2')))} files, {total / 1024:.0f} KB -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
