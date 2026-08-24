#!/usr/bin/env python
"""Normalise approved Nabil's studio product photography onto one 4:5 card canvas.

    python scripts/build-studio-assets.py --src <dir-of-approved-pngs>

`python` on the build machine is broken; use the absolute interpreter:
    C:\\Users\\aliha\\AppData\\Local\\Programs\\Python\\Python310\\python.exe

WHAT THIS DOES NOT DO: it does not retouch, relight or regenerate the food. The
approved assets arrive as one shoot and must stay that way.

There are two operations here, and the line between them matters.

CANVAS — getting ten differently-proportioned frames onto the single 1200x1500
(4:5) box that `src/lib/productImages.ts` promises the card system, without
ever cropping through a product.

GROUND — mapping every frame's studio sweep onto one shared backdrop anchored
on the site's own paper, `--ds-paper` / #f5ecdf. This is a white balance of the
BACKDROP, derived from each frame's own sweep. It is not a grade of the food:
the correction is a smooth low-frequency field, so every local thing — the
food, its texture, its grain, the contact shadow — survives as a residual on
top of it and keeps its relationship to the light it was shot under.

Why the ground pass exists at all: the menu renders these with no border, no
radius and no drop shadow, deliberately, because the photograph is supposed to
BE the card (see Page.module.css). The only thing hiding the edge of the box is
the pixels at the edge of the box. As delivered, the set did not do that job —
measured at the 8px frame ring against #f5ecdf, every asset was off (worst
single side 64), and worse, they were off by DIFFERENT amounts: the mocktails
sat on tan and the waffle pack on near-white, a 27-unit spread on blue across a
set that is supposed to read as one shoot. So ten menu rows rendered as ten
rectangles on the cream. Run `--check` to see the numbers.

Assets already on 4:5 are only resized. The rest reach the ratio one of two
ways, preferring the one that invents nothing: if there is dead sweep to spare
it is trimmed (the two crepe/mocktail frames), and only where trimming would
cut the product is the asset's own cream sweep continued outwards instead
(acai, the strawberry cup, the waffle pack). When extending:

  * the low-frequency sweep is linearly extrapolated from a lightly-smoothed
    edge profile, with the slope decaying across the fill so a long extension
    flattens out instead of drifting off tone;
  * grain is re-added as matched noise. Mirroring the edge pixels instead
    repeats their structure and reads as vertical streaks — that was the first
    attempt and it was visible at card size.

The ground pass runs LAST, on the finished 1200x1500 canvas, so the edge it
locks is the edge that actually ships. Running it before the extension would
leave `_extend_edge` free to extrapolate back off-target.

Outputs are written next to the repo's other product assets, at
`public/images/products/studio/`. Re-running is idempotent.

Approved sources live outside the repo by policy — raw client media is tracked
by path reference, not by content (see AGENTS.md). They are at:
    clients/nabils-acai-station/assets/source/studio-2026-08-18/
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


# --------------------------------------------------------------------- ground

# --ds-paper. The page the cards are printed on; globals.css owns the original.
PAPER = np.array([245.0, 236.0, 223.0])
LOW_W = 128  # the sweep is low-frequency; model it small and upsample


def _box_blur(a: np.ndarray, passes: int = 3) -> np.ndarray:
    """Cheap separable blur by array shifts. Three passes ~ a gaussian."""
    for _ in range(passes):
        for axis in (0, 1):
            lo = np.roll(a, 1, axis=axis)
            hi = np.roll(a, -1, axis=axis)
            idx = [slice(None)] * a.ndim
            idx[axis] = 0
            lo[tuple(idx)] = a[tuple(idx)]
            idx[axis] = -1
            hi[tuple(idx)] = a[tuple(idx)]
            a = (lo + a + hi) / 3.0
    return a


def _resize_plane(p: np.ndarray, size, mode) -> np.ndarray:
    return np.asarray(
        Image.fromarray(p.astype(np.float32), mode="F").resize(size, mode), dtype=float
    )


def _background_mask(a: np.ndarray) -> np.ndarray:
    """Pixels belonging to the sweep rather than to the food.

    Chromaticity, not brightness. The sweep holds one hue all the way from the
    key light down into the contact shadow, so r:g:b separates ground from food
    where a luminance threshold would call the shadow "product" and the pale
    banana slices "ground".
    """
    h, w = a.shape[:2]
    chroma = a / np.maximum(a.sum(axis=2, keepdims=True), 1e-6)
    band = max(4, h // 100)
    edge = np.concatenate(
        [
            chroma[:band].reshape(-1, 3),
            chroma[-band:].reshape(-1, 3),
            chroma[:, :band].reshape(-1, 3),
            chroma[:, -band:].reshape(-1, 3),
        ]
    )
    return np.abs(chroma - np.median(edge, axis=0)).sum(axis=2) < 0.045


def _sweep_field(a: np.ndarray, mask: np.ndarray, iters: int = 160) -> np.ndarray:
    """Smooth model of the sweep, diffused in under the product.

    Normalised convolution at 128px wide, then a diffusion fill so the model is
    defined behind the food too, then back up. Working small is what keeps the
    field low-frequency by construction: it cannot chase the product's edges
    even if the mask is imperfect.
    """
    h, w = a.shape[:2]
    lw = LOW_W
    lh = max(8, int(round(h * lw / w)))
    m = mask.astype(float)

    den = _resize_plane(m, (lw, lh), Image.BOX)
    known = den > 0.35
    if known.sum() < 16:
        known = np.ones_like(den, dtype=bool)

    out = np.zeros((lh, lw, 3))
    for c in range(3):
        num = _resize_plane(a[..., c] * m, (lw, lh), Image.BOX)
        v = np.where(known, num / np.maximum(den, 1e-6), 0.0)
        cur = np.where(known, v, v[known].mean())
        for _ in range(iters):
            cur = _box_blur(cur, passes=1)
            cur[known] = v[known]
        out[..., c] = cur

    out = _box_blur(out, passes=4)
    return np.stack(
        [_resize_plane(out[..., c], (w, h), Image.BICUBIC) for c in range(3)], axis=2
    )


def _target(h: int, w: int, amp: float = 8.0) -> np.ndarray:
    """The one backdrop every card is mapped onto.

    Exactly --ds-paper at all four edges — that is the whole point, it is what
    makes the box vanish into the band — deepening gently toward a point below
    centre so the ground still reads as a lit sweep and not as a flat fill.
    Blue falls off fastest because the light was warm.
    """
    yy = np.linspace(0.0, 1.0, h)[:, None]
    xx = np.linspace(0.0, 1.0, w)[None, :]
    g = np.sin(np.pi * xx) * np.sin(np.pi * (yy**0.85))
    g = np.clip(g, 0.0, 1.0) ** 1.25
    warm = np.array([0.62, 0.80, 1.0])
    return PAPER[None, None, :] - amp * g[..., None] * warm[None, None, :]


def _edge_weight(h: int, w: int, frac: float = 0.055) -> np.ndarray:
    """1 through the middle, falling to 0 at the frame edge.

    The contact shadow is preserved everywhere this is 1. Where the shadow runs
    all the way to the frame edge — the waffle pack does, and it was the last
    asset still drawing a rectangle — preserving it and landing the border on
    paper are the same pixel asking for two different values. A real sweep
    resolves that by having the shadow fall off before the frame ends, so the
    residual is dissolved into the target across this band and the shadow pools
    under the bowl instead of running off the bottom of the card.
    """
    y = np.arange(h)
    x = np.arange(w)
    dy = np.clip(np.minimum(y, h - 1 - y) / (frac * h), 0.0, 1.0)[:, None]
    dx = np.clip(np.minimum(x, w - 1 - x) / (frac * w), 0.0, 1.0)[None, :]
    d = np.minimum(dy, dx)
    return (d * d * (3.0 - 2.0 * d))[..., None]  # smoothstep


def ground_normalise(a: np.ndarray) -> np.ndarray:
    """Map one frame's sweep onto the shared #f5ecdf backdrop."""
    mask = _background_mask(a)
    sweep = _sweep_field(a, mask)

    # Refit with the contact shadow excluded. Left in, the shadow pulls the
    # model down where it sits, the correction lifts it back up, and the
    # shadow is graded away — which is the one piece of the sweep the shoot
    # actually paid for.
    lit = mask & (a.sum(axis=2) > sweep.sum(axis=2) - 14.0)
    if lit.mean() > 0.05:
        sweep = _sweep_field(a, lit)

    target = _target(*a.shape[:2])
    graded = a + (target - sweep)

    w = _edge_weight(*a.shape[:2])
    return np.clip(target + (graded - target) * w, 0.0, 255.0)


# ---------------------------------------------------------------------- shelf

# Where a gallery card's product stands. Height as a share of the frame, and
# the y its contact point sits on. 0.86 is close to the tallest card as
# delivered (0.921) so most frames scale UP and are cropped — cropping empty
# sweep invents nothing, and only one card has to grow any sweep at all.
SHELF_H = 0.86
SHELF_BASELINE = 1420
SHELF_MAX_W = 0.90  # never let a wide product touch the side of the frame


def _product_bbox(a: np.ndarray) -> tuple[int, int, int, int]:
    """Where the food is, as (x0, y0, x1, y1).

    Reuses the chromaticity mask that the ground pass already trusts, so the
    contact shadow counts as ground and does not drag the box downwards. The
    per-line thresholds drop stray specks without eroding a real edge.
    """
    fg = ~_background_mask(a)
    h, w = a.shape[:2]
    rows = np.where(fg.sum(axis=1) > w * 0.012)[0]
    cols = np.where(fg.sum(axis=0) > h * 0.012)[0]
    if rows.size == 0 or cols.size == 0:
        return 0, 0, w - 1, h - 1
    return int(cols[0]), int(rows[0]), int(cols[-1]), int(rows[-1])


def _place(a: np.ndarray, top: int, left: int, h: int, w: int) -> np.ndarray:
    """Window a resampled frame back onto the h x w canvas.

    Positive offsets crop; negative ones continue the sweep outwards with the
    same extrapolation the canvas step uses.
    """
    if top > 0:
        a = a[top:]
    elif top < 0:
        a = _extend_edge(a, -top, axis=0, side="start")
    if a.shape[0] > h:
        a = a[:h]
    elif a.shape[0] < h:
        a = _extend_edge(a, h - a.shape[0], axis=0, side="end")

    if left > 0:
        a = a[:, left:]
    elif left < 0:
        a = _extend_edge(a, -left, axis=1, side="start")
    if a.shape[1] > w:
        a = a[:, :w]
    elif a.shape[1] < w:
        a = _extend_edge(a, w - a.shape[1], axis=1, side="end")
    return a


def shelf_normalise(a: np.ndarray) -> np.ndarray:
    """Stand every gallery card's product at one size on one ground line.

    ONLY for the açaí build gallery, never for the editorial-row heroes — the
    heroes are shipped, approved artwork and each is seen alone, so nothing is
    gained by rescaling them and an approved asset would silently change.

    The gallery is different: five cards sit side by side in one strip, and as
    built they ranged 0.735-0.921 of the frame in height with 84px between
    their contact points. Read as a row that is not five sizes of cup, it is
    five photographs taken from five distances. Products keep their own aspect
    ratio — a wide tub stays wide, which is real — but they share a scale and
    a baseline, which is how a lineup is actually shot.

    The whole frame is resampled, sweep and contact shadow included, so the
    shadow keeps its size relative to the cup it belongs to. Runs BEFORE
    ground_normalise, which must stay last so it locks the edge that ships.
    """
    h, w = a.shape[:2]
    x0, y0, x1, y1 = _product_bbox(a)
    scale = min(
        (SHELF_H * h) / max(y1 - y0 + 1, 1),
        (SHELF_MAX_W * w) / max(x1 - x0 + 1, 1),
    )

    big = np.asarray(
        Image.fromarray(a.astype(np.uint8)).resize(
            (int(round(w * scale)), int(round(h * scale))), Image.LANCZOS
        )
    ).astype(float)

    bottom = (y1 + 1) * scale
    centre = ((x0 + x1 + 1) / 2.0) * scale
    return _place(
        big,
        int(round(bottom - SHELF_BASELINE)),
        int(round(centre - w / 2.0)),
        h,
        w,
    )


def to_card(path: str, crop=None, bias: float = 0.5, shelf: bool = False) -> Image.Image:
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
    card = np.asarray(
        Image.fromarray(a.astype(np.uint8)).resize((TARGET_W, TARGET_H), Image.LANCZOS)
    ).astype(float)
    if shelf:
        card = shelf_normalise(card)
    return Image.fromarray(ground_normalise(card).astype(np.uint8))


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
    # Second batch (2026-08-19), closing the two gaps flagged on the first pass.
    # Both are 3:4 (1086x1448) and both carry dead sweep above the subject, so
    # they reach 4:5 by dropping 91px off the top rather than growing 72px of
    # width. Trimming empty sweep invents no pixels at all, which beats even a
    # good extension; the shadow sits ~150px clear of the bottom either way.
    ("nabil-classic-crepe.png", "crepe-classic-studio", (0, 91, 1086, 1448), 0.5),
    ("nabil-mocktails.png", "mocktail-studio", (0, 91, 1086, 1448), 0.5),
    # Third batch (2026-08-24), from Ali's own counter photographs of açaí
    # builds. Unlike the first two batches these did not arrive as studio
    # frames: they were phone shots on the shop's purple/blue backdrop, in
    # hand, or against the counter. Each was relit onto the System B sweep by
    # a gpt-image-2 image-to-image edit that changed the ENVIRONMENT ONLY —
    # the food is the food in Ali's photograph, not a generated dessert. The
    # unedited originals are kept beside them at
    # ../assets/source/soft-serve-2026-08-24/ so the pair can be compared.
    #
    # All six arrive already on 4:5 (1024x1280), so they are only resized and
    # grounded — no crop, no extension, nothing invented at the canvas step.
    ("nabil-acai-chocolate.png", "acai-chocolate-studio", None, 0.5),
    ("nabil-acai-biscoff.png", "acai-biscoff-studio", None, 0.5),
    ("nabil-acai-pistachio.png", "acai-pistachio-studio", None, 0.5),
    ("nabil-acai-pistachio-choc.png", "acai-pistachio-choc-studio", None, 0.5),
    ("nabil-acai-pistachio-loaded.png", "acai-loaded-studio", None, 0.5),
    ("nabil-brownie-bowl.png", "brownie-bowl-studio", None, 0.5),
]


# The açaí build gallery. These five run side by side in one strip on /menu, so
# they get the shelf pass; every other asset is an editorial-row hero, seen
# alone, and is left exactly as approved.
SHELF_ASSETS = {
    "acai-loaded-studio",
    "acai-chocolate-studio",
    "acai-biscoff-studio",
    "acai-pistachio-studio",
    "acai-pistachio-choc-studio",
}


RING = 8
TOL = 2.0  # per-asset: how far the frame ring may sit from paper
SPREAD = 1.5  # across the set: how far the assets may sit from each other


def check(out_dir: str) -> int:
    """Measure what the eye is actually judging: the pixels at the frame edge.

    Two conditions, because there are two ways for this set to look wrong. An
    asset can miss the page (TOL), or the assets can miss each other (SPREAD) —
    and the second is the one that makes ten rows read as ten photographs
    instead of one shoot.
    """
    paths = sorted(
        os.path.join(out_dir, f) for f in os.listdir(out_dir) if f.endswith(".webp")
    )
    means, failed = [], []
    print(f"{'asset':<36}{'ring mean RGB':<24}{'off':>6}{'worst side':>12}")
    print("-" * 78)
    for p in paths:
        a = np.asarray(Image.open(p).convert("RGB")).astype(float)
        sides = {
            "top": a[:RING],
            "bottom": a[-RING:],
            "left": a[:, :RING],
            "right": a[:, -RING:],
        }
        ring = np.concatenate([s.reshape(-1, 3) for s in sides.values()])
        mean = ring.mean(axis=0)
        means.append(mean)
        off = np.abs(mean - PAPER).max()
        worst = max(
            np.abs(s.reshape(-1, 3).mean(axis=0) - PAPER).max() for s in sides.values()
        )
        bad = off > TOL
        if bad:
            failed.append(os.path.basename(p))
        print(
            f"{os.path.basename(p):<36}"
            f"({mean[0]:5.1f},{mean[1]:5.1f},{mean[2]:5.1f})       "
            f"{off:5.1f}{worst:12.1f}{'   <-- off' if bad else ''}"
        )

    means = np.array(means)
    std = means.std(axis=0)
    print("-" * 78)
    print(f"paper is ({PAPER[0]:.0f},{PAPER[1]:.0f},{PAPER[2]:.0f})")
    print(f"cross-asset std     R {std[0]:.2f}  G {std[1]:.2f}  B {std[2]:.2f}")
    spread_ok = bool((std <= SPREAD).all())
    if failed:
        print(f"FAIL — off the page: {', '.join(failed)}")
    if not spread_ok:
        print("FAIL — the assets do not match each other")
    ok = not failed and spread_ok
    print("PASS" if ok else "")
    return 0 if ok else 1


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", help="directory holding the approved PNGs")
    ap.add_argument("--out", default=OUT_DIR)
    ap.add_argument(
        "--check",
        action="store_true",
        help="measure the shipped cards' frame ring against --ds-paper and exit",
    )
    args = ap.parse_args()

    if args.check:
        raise SystemExit(check(args.out))
    if not args.src:
        ap.error("--src is required unless --check is given")

    os.makedirs(args.out, exist_ok=True)
    for src, name, crop, bias in PLAN:
        path = os.path.join(args.src, src)
        if not os.path.exists(path):
            print(f"SKIP {name}: no source at {path}")
            continue
        card = to_card(path, crop, bias, shelf=name in SHELF_ASSETS)
        dest = os.path.join(args.out, name + ".webp")
        card.save(dest, "WEBP", quality=88, method=6)
        print(f"{name + '.webp':<34} {os.path.getsize(dest) // 1024:>5} KB  {card.size}")


if __name__ == "__main__":
    main()
