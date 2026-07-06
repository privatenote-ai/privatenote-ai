#!/usr/bin/env python3
"""Generate Chrome Web Store–compliant extension icons from the PrivateNote brand asset."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parents[1] / "packages/privatenote-vscode/icons/icon.png"
OUT_DIR = ROOT / "public/icons"

CANVAS = 128
CONTENT = 96
PADDING = (CANVAS - CONTENT) // 2  # 16px per side


def load_source() -> Image.Image:
    img = Image.open(SOURCE).convert("RGBA")
    return img.resize((CONTENT, CONTENT), Image.Resampling.LANCZOS)


def subtle_glow(layer: Image.Image, spread: int = 3, opacity: int = 90) -> Image.Image:
    """Soft white halo so the icon reads on dark browser chrome."""
    alpha = layer.split()[3]
    glow = Image.new("RGBA", layer.size, (255, 255, 255, 0))
    glow.putalpha(alpha)
    glow = glow.filter(ImageFilter.GaussianBlur(radius=spread))
    glow = ImageChops.multiply(glow, Image.new("RGBA", layer.size, (255, 255, 255, opacity)))
    return glow


def compose_store_icon(content: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    glow = subtle_glow(content)
    canvas.alpha_composite(glow, (PADDING, PADDING))
    canvas.alpha_composite(content, (PADDING, PADDING))
    return canvas


def save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, format="PNG", optimize=True)


def main() -> None:
    content = load_source()
    icon128 = compose_store_icon(content)

    save_png(icon128, OUT_DIR / "icon128.png")
    save_png(icon128, OUT_DIR / "icon.png")
    save_png(icon128.resize((48, 48), Image.Resampling.LANCZOS), OUT_DIR / "icon48.png")
    save_png(icon128.resize((16, 16), Image.Resampling.LANCZOS), OUT_DIR / "icon16.png")

    print(f"Wrote icons to {OUT_DIR}")
    print(f"  icon128.png  {icon128.size}  (96×96 content + {PADDING}px padding)")
    print(f"  icon48.png, icon16.png, icon.png")


if __name__ == "__main__":
    main()
