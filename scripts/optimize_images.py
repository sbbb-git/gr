#!/usr/bin/env python3
"""Build the responsive image set served by the site.

Reads full-resolution masters from ``assets/originals`` and writes, for every
photo, a WebP ladder plus a single JPEG fallback into ``public/images``.
Also emits ``src/content/media.json`` — the manifest the site generator reads to
get intrinsic dimensions (so every <img> ships width/height and never shifts
layout) and an average colour used as the placeholder while the file loads.

    pip install Pillow
    python3 scripts/optimize_images.py

Re-running is safe: outputs are deterministic and simply overwritten.
"""

from __future__ import annotations

import json
import math
import pathlib
import sys

from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageStat

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "originals"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "content" / "media.json"

# Ladder of rendered widths. A width is skipped when it would upscale the
# master, so small sources simply produce fewer files.
WIDTHS = [480, 768, 1200, 1600, 2000]
FALLBACK_WIDTH = 1200
# AVIF at 68 is visually indistinguishable from WebP at 86 on these images and
# roughly a quarter smaller, so it is offered first and WebP catches the
# browsers that cannot read it.
AVIF_QUALITY = 68
AVIF_SPEED = 6
WEBP_QUALITY = 86
JPEG_QUALITY = 90

# The brand mark is inline SVG, so nothing needs transparency passthrough;
# only the square favicon master is treated specially.
PASSTHROUGH: set[str] = set()


# --- Tone -----------------------------------------------------------------
# The masters come straight out of the camera. What follows is deliberately
# mild: clip a sliver of the histogram, lift the midtones of anything darker
# than a normal exposure, and add a touch of saturation. Nothing is invented,
# and no frame is brightened by more than a third of a stop.
TARGET_LUMA = 122.0
MAX_GAMMA = 1.30


def enhance(im: Image.Image) -> Image.Image:
    """Gentle, uniform tone correction applied to every photograph."""
    out = ImageOps.autocontrast(im, cutoff=(0.5, 0.02), preserve_tone=True)

    luma = ImageStat.Stat(out.convert("L")).mean[0]
    if luma < TARGET_LUMA:
        gamma = min(MAX_GAMMA, math.log(TARGET_LUMA / 255) / math.log(max(luma, 1) / 255))
        lut = [round(255 * ((i / 255) ** (1 / gamma))) for i in range(256)]
        out = out.point(lut * 3)

    return ImageEnhance.Color(out).enhance(1.06)


def resample(im: Image.Image, width: int, height: int) -> Image.Image:
    """Downscale, then restore the edge definition Lanczos softens."""
    small = im.resize((width, height), Image.Resampling.LANCZOS)
    return small.filter(ImageFilter.UnsharpMask(radius=0.8, percent=58, threshold=3))


def average_colour(im: Image.Image) -> str:
    """Average colour of the image, as #rrggbb — used as a load-in placeholder."""
    tiny = im.convert("RGB").resize((1, 1), Image.Resampling.LANCZOS)
    r, g, b = tiny.getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


def build_favicons(master: Image.Image) -> None:
    """Emit the favicon/app-icon set from the square brand image."""
    icons = ROOT / "public"
    square = master.convert("RGB")
    for size, name in [
        (32, "favicon-32.png"),
        (180, "apple-touch-icon.png"),
        (192, "icon-192.png"),
        (512, "icon-512.png"),
    ]:
        square.resize((size, size), Image.Resampling.LANCZOS).save(icons / name, optimize=True)
    # Multi-resolution .ico for legacy browsers and search-engine crawlers.
    square.resize((64, 64), Image.Resampling.LANCZOS).save(
        icons / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("  favicons -> public/favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192/512.png")


def main() -> int:
    if not SRC.is_dir():
        print(f"error: no masters found at {SRC}", file=sys.stderr)
        return 1

    name_map = json.loads((ROOT / "scripts" / "image-map.json").read_text())["map"]
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict] = {}

    for original, slug in sorted(name_map.items(), key=lambda kv: kv[1]):
        path = SRC / original
        if not path.is_file():
            print(f"  ! missing master, skipped: {original}", file=sys.stderr)
            continue

        with Image.open(path) as im:
            im.load()
            width, height = im.size

            if slug == "favicon-source":
                build_favicons(im)
                continue

            if slug in PASSTHROUGH:
                rgba = im.convert("RGBA")
                rgba.save(OUT / f"{slug}.png", optimize=True)
                rgba.save(OUT / f"{slug}.webp", quality=90, method=6)
                manifest[slug] = {
                    "src": f"/images/{slug}.png",
                    "webp": f"/images/{slug}.webp",
                    "width": width,
                    "height": height,
                    "fallback": [width, height],
                    "widths": [],
                    "colour": average_colour(rgba),
                }
                print(f"  {slug:44s} {width}x{height} (passthrough)")
                continue

            rgb = im.convert("RGB")
            rgb = enhance(rgb)
            colour = average_colour(rgb)
            made: list[int] = []

            for w in WIDTHS:
                if w > width:
                    continue
                h = round(height * w / width)
                rendition = resample(rgb, w, h)
                rendition.save(OUT / f"{slug}-{w}.webp", quality=WEBP_QUALITY, method=6)
                rendition.save(OUT / f"{slug}-{w}.avif", quality=AVIF_QUALITY, speed=AVIF_SPEED)
                made.append(w)

            # Always ship at least the native size, even for very small masters.
            if not made:
                rgb.save(OUT / f"{slug}-{width}.webp", quality=WEBP_QUALITY, method=6)
                rgb.save(OUT / f"{slug}-{width}.avif", quality=AVIF_QUALITY, speed=AVIF_SPEED)
                made.append(width)

            fallback = min(made, key=lambda w: abs(w - FALLBACK_WIDTH))
            fh = round(height * fallback / width)
            resample(rgb, fallback, fh).save(
                OUT / f"{slug}.jpg", quality=JPEG_QUALITY, optimize=True, progressive=True
            )

            manifest[slug] = {
                "src": f"/images/{slug}.jpg",
                "width": width,
                "height": height,
                # Real pixel size of the JPEG at `src`. Open Graph must describe
                # the file it actually points at, not the master it came from.
                "fallback": [fallback, fh],
                "widths": made,
                "colour": colour,
            }
            print(f"  {slug:44s} {width}x{height} -> {made}")

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")

    total = sum(f.stat().st_size for f in OUT.glob("*"))
    print(f"\n{len(manifest)} images -> {OUT} ({total / 1_048_576:.1f} MB)")
    print(f"manifest -> {MANIFEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
