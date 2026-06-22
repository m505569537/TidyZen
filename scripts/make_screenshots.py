#!/usr/bin/env python3
"""Generate App Store screenshots at required sizes from design mockups.

Letterboxes the mockup with the TidyZen primary green background so each
output matches Apple's required pixel dimensions without stretching.
"""
import os
from PIL import Image

BG = (45, 106, 79)  # TidyZen colors.primary #2d6a4f

SIZES = {
    "6.7_iPhone15ProMax": (1290, 2796),
    "6.5_iPhone14Plus":   (1284, 2778),
    "5.5_iPhone8Plus":    (1242, 2208),
}

SOURCES = [
    ("01_home_score",        "26_整理足迹与趋势分析.png"),
    ("02_analysis_result",   "17_深度分析结果_TidyZen.png"),
    ("03_before_after",      "22_整理记录详情.png"),
]

SRC_DIR = "/Users/eeexu/web/ll/proving-ground/TidyZen/docs/designs"
OUT_DIR = "/Users/eeexu/web/ll/proving-ground/TidyZen/docs/screenshots"

os.makedirs(OUT_DIR, exist_ok=True)

def fit(im: Image.Image, target_w: int, target_h: int) -> Image.Image:
    canvas = Image.new("RGB", (target_w, target_h), BG)
    scale = min(target_w / im.width, target_h / im.height)
    new_w, new_h = int(im.width * scale), int(im.height * scale)
    resized = im.resize((new_w, new_h), Image.LANCZOS)
    canvas.paste(resized, ((target_w - new_w) // 2, (target_h - new_h) // 2))
    return canvas

for tag, fname in SOURCES:
    src_path = os.path.join(SRC_DIR, fname)
    src_im = Image.open(src_path).convert("RGB")
    for size_tag, (w, h) in SIZES.items():
        out = fit(src_im, w, h)
        out_name = f"{size_tag}__{tag}.png"
        out.save(os.path.join(OUT_DIR, out_name), "PNG", optimize=True)
        print(f"wrote {out_name} ({w}x{h}) from {fname}")
