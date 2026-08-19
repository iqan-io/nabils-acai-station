#!/usr/bin/env python
"""Normalise approved Nabil's studio product photography onto one 4:5 card canvas.

    python scripts/build-studio-assets.py --src <dir-of-approved-pngs>

`python` on the build machine is broken; use the absolute interpreter:
    C:\\Users\\aliha\\AppData\\Local\\Programs\\Python\\Python310\\python.exe

WHAT THIS DOES NOT DO: it does not retouch, re-grade, relight or regenerate the
food. The approved assets arrive as one shoot and must stay that way. The only
operation here is canvas — getting eight differently-proportioned frames onto
the single 1200x1500 (4:5) box that `src/lib/productImages.ts` promises the
card system, without ever cropping through a product.

Three of the eight are not natively 4:5, so their own cream sweep is continued
outwards to reach the ratio:

  * the low-frequency sweep is linearly extrapolated from a lightly-smoothed
    edge profile, with the slope decaying across the fill so a long extension
    flattens out instead of drifting off tone;
  * grain is re-added as matched noise. Mirroring the edge pixels instead
    repeats their structure and reads as vertical streaks — that was the first
    attempt and it was visible at card size.

Outputs are written next to the repo's other product assets, at
`public/images/products/studio/`. Re-running is idempotent.
"""

from __future__ import annotations

import argparse
import os

import numpy as np
from PIL import Image, ImageFilter

TARGET_W, TARGET_H = 1200, 1500  # 4 : 5
RATIO = TARGET_W / TARGET_H
OUT_DIR = os.path.join("public", "images", "products", "studio")

rng = np.random.default_rng(7)


def _smooth_along(profile: np.ndarray, sigma: float) -> np.ndarray:
    """Blur a 1-D colour profile along the edge, keeping real tonal structure.

    Sigma is deliberately small. Smoothing hard enough to erase the contact
    shadow would smear that shadow's tone evenly across the whole extension.
    """
    radius = int(sigma * 3)
    x = np.arange(-radius, radius + 1)
    k = np.exp(-(x**2) / (2 * sigma**2))
    k /= k.sum()
    padded = np.pad(profile, ((radius, radius), (0, 0)), mode="edge")
    return np.stack(
        [np.convolve(padded[:, c], k, mode="valid") for c in range(3)], axis=1
    )


def _extend_edge(a: np.ndarray, n: int, axis: int, side: str) -> np.ndarray:
    """Continue a smooth studio sweep outwards by `n` px."""
    if n <= 0:
        return a
    if axis == 1:
        a = a.transpose(1, 0, 2)
    if side == "end":
        a = a[::-1]

    k = min(140, a.shape[0] // 4)
    strip = a[:k].astype(float)  # strip[0] is the outer edge
    edge = _smooth_along(strip[:20].mean(axis=0), 12.0)
    inner = _smooth_along(strip[k - 20 : k].mean(axis=0), 12.0)
    slope = np.clip((edge - inner) / max(k - 20, 1), -0.05, 0.05)
    grain = float(np.clip((strip - strip.mean(axis=0)).std(), 0.6, 4.0))

    d = np.arange(1, n + 1, dtype=float)
    span = max(n * 0.6, 1.0)
    damp = (1.0 - np.exp(-d / span)) * span
    grown = edge[None, :, :] + slope[None, :, :] * damp[:, None, None]
    grown += rng.normal(0.0, grain, grown.shape)
    grown = np.clip(grown, 0, 255)

    out = np.concatenate([grown[::-1], a], axis=0)
    if side == "end":
        out = out[::-1]
    if axis == 1:
        out = out.transpose(1, 0, 2)
    return out


def to_card(path: str, crop=None, bias: float = 0.5) -> Image.Image:
    """1200x1500 RGB.

    `bias` is the share of the pad taken on the start (top/left) edge, so the
    fill can be steered away from an edge the product's shadow already reaches.
    """
    im = Image.open(path).convert("RGB")
    if crop:
        im = im.crop(crop)
    a = np.asarray(im).astype(float)
    h, w = a.shape[:2]
    r = w / h
    if abs(r - RATIO) > 0.004:
        if r < RATIO:  # too narrow -> grow width
            need = int(round(h * RATIO)) - w
            first = int(round(need * bias))
            a = _extend_edge(a, first, axis=1, side="start")
            a = _extend_edge(a, need - first, axis=1, side="end")
        else:  # too wide -> grow height
            need = int(round(w / RATIO)) - h
            first = int(round(need * bias))
            a = _extend_edge(a, first, axis=0, side="start")
            a = _extend_edge(a, need - first, axis=0, side="end")
    return Image.fromarray(a.astype(np.uint8)).resize(
        (TARGET_W, TARGET_H), Image.LANCZOS
    )


# Approved source -> published name. `crop` trims empty sweep only, never product.
PLAN = [
    ("nabil-acai.png", "acai-build-your-own-studio", None, 0.5),
    ("nabil-crepe.png", "crepe-signature-studio", None, 0.5),
    ("nabil-strawberry-cup.png", "strawberry-cup-studio", None, 0.5),
    ("nabil-dubai-chocolate.png", "dubai-chocolate-studio", None, 0.5),
    ("nabil-brownie.png", "brownie-studio", None, 0.5),
    # The only landscape asset (4:3). Centred on the bowl (x 126-1308) with a
    # small margin, then grown upward rather than slicing the bowl's sides off.
    # The fill is biased to the top because the bowl's contact shadow runs to
    # the bottom edge and extending down would smear it.
    ("nabil-waffle-snackpack.png", "waffle-snack-pack-studio", (92, 0, 1342, 1086), 0.80),
    ("nabil-fruit-cocktail.png", "fruit-cocktail-studio", None, 0.5),
    ("nabil-probiotic.png", "probiotic-splash-studio", None, 0.5),
]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="directory holding the approved PNGs")
    ap.add_argument("--out", default=OUT_DIR)
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    for src, name, crop, bias in PLAN:
        path = os.path.join(args.src, src)
        if not os.path.exists(path):
            print(f"SKIP {name}: no source at {path}")
            continue
        card = to_card(path, crop, bias)
        dest = os.path.join(args.out, name + ".webp")
        card.save(dest, "WEBP", quality=88, method=6)
        print(f"{name + '.webp':<34} {os.path.getsize(dest) // 1024:>5} KB  {card.size}")


if __name__ == "__main__":
    main()
