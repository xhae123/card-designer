#!/usr/bin/env python3
"""
PNG → embedded SVG converter.

Wraps a PNG inside an SVG `<image>` tag with base64 data URI.
Produces pixel-perfect SVG output (the raster IS the source — no tracing,
no posterization, no detail loss). Industry-standard for illustrations
with gradients / soft edges (how Figma, Canva export non-vector layers).

Usage:
    python3 png-to-svg.py INPUT.png OUTPUT.svg [--no-compress]

Behavior:
- Auto-compresses input with pngquant (quality 75-92) if available, then embeds
- viewBox matches source dimensions
- Output is self-contained, inline-safe (no external dependencies)
- File size ~1.3× the compressed PNG (base64 inflation)

When to use this:
- USER-PROVIDED rasters (logos, mascots, photos, screenshots) → always
- Brand assets that must match the original exactly → always
- Complex illustrations with gradients → always

When NOT to use this:
- AI-generated brand-mood SVGs (paperclip, calendar icon, decorative shapes
  drawn fresh in a mood) → those are hand-crafted pure SVG paths/gradients;
  use the mood library in references/asset-moods.md instead
"""
import argparse
import base64
import shutil
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow required: pip3 install --break-system-packages pillow", file=sys.stderr)
    sys.exit(2)


def compress_png(src: Path, dst: Path, quality: str = "75-92") -> bool:
    """Compress PNG via pngquant if available. Returns True if compressed."""
    if not shutil.which("pngquant"):
        return False
    try:
        subprocess.run(
            ["pngquant", "--quality", quality, "--force", "--output", str(dst), str(src)],
            check=True, capture_output=True,
        )
        return True
    except subprocess.CalledProcessError:
        return False


def png_to_svg(src: Path, out: Path, compress: bool = True) -> None:
    img = Image.open(src)
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    w, h = img.size

    work_png = src
    if compress:
        tmp_compressed = out.with_suffix(".tmp.png")
        if compress_png(src, tmp_compressed):
            work_png = tmp_compressed

    png_bytes = work_png.read_bytes()
    b64 = base64.b64encode(png_bytes).decode("ascii")

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
        f'<image href="data:image/png;base64,{b64}" '
        f'width="{w}" height="{h}"/>'
        f'</svg>\n'
    )
    out.write_text(svg)

    if work_png != src and work_png.exists():
        work_png.unlink()

    src_kb = src.stat().st_size / 1024
    svg_kb = out.stat().st_size / 1024
    print(f"OK  {src.name} ({src_kb:.1f} KB) → {out.name} ({svg_kb:.1f} KB) · {w}×{h}")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("input", help="Input PNG path")
    ap.add_argument("output", help="Output SVG path")
    ap.add_argument("--no-compress", action="store_true",
                    help="Skip pngquant compression (keep source bytes verbatim)")
    args = ap.parse_args()

    src = Path(args.input)
    out = Path(args.output)
    if not src.exists():
        print(f"Input not found: {src}", file=sys.stderr)
        sys.exit(1)
    out.parent.mkdir(parents=True, exist_ok=True)
    png_to_svg(src, out, compress=not args.no_compress)


if __name__ == "__main__":
    main()
