#!/usr/bin/env python
"""Web derivatives of the owner's Lebanese sweets photos for `/shop`.

    C:\\Users\\aliha\\AppData\\Local\\Programs\\Python\\Python310\\python.exe scripts/build-sweets-assets.py

Source: `clients/nabils-acai-station/assets/source/client-photos/sweets-2026-11-04/`
(the owner's WhatsApp photos, 2026-11-04). Output: `public/images/products/sweets/`.

Deliberately deterministic and global: a crop to the shop's 4:3 card, then a
light contrast, colour and sharpening pass applied to the whole frame. Nothing
is generated, retouched or removed, so the tub and label in each photo are
exactly what a customer receives. (A generative "improve" was considered and
rejected: it redraws the food and the label text.)
"""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

SITE = Path(__file__).resolve().parent.parent
SRC = SITE.parent / "assets/source/client-photos/sweets-2026-11-04"
OUT = SITE / "public/images/products/sweets"

# Crop boxes in source pixels (left, top, right, bottom), each 4:3. The granite
# counter shots are 1194x672 (16:9), so their 4:3 is the centred 896px. The two
# hand-held phone shots are cropped to the tub, leaving out the warehouse boxes.
CENTRED = (149, 0, 1045, 672)
PHOTOS = {
    "pistachio-baklava-350g": CENTRED,
    "walnut-baklava-350g": CENTRED,
    "assorted-baklava-500g": CENTRED,
    "barazik-400g": CENTRED,
    "almond-crescent-400g": CENTRED,
    "assorted-batifore-400g": CENTRED,
    "lady-fingers-400g-handheld": (0, 470, 1536, 1622),
    "almond-baklava-350g-handheld": (40, 520, 1152, 1354),
}


def improve(image: Image.Image) -> Image.Image:
    image = ImageOps.autocontrast(image, cutoff=0.4)
    image = ImageEnhance.Contrast(image).enhance(1.05)
    image = ImageEnhance.Color(image).enhance(1.06)
    return image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=3))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, box in PHOTOS.items():
        image = Image.open(SRC / f"{name}.jpg").convert("RGB").crop(box)
        if image.width > 1200:
            image = image.resize((1200, 900), Image.LANCZOS)
        target = OUT / f"{name.removesuffix('-handheld')}.webp"
        improve(image).save(target, "WEBP", quality=86, method=6)
        print(f"{target.relative_to(SITE)}  {image.width}x{image.height}")


if __name__ == "__main__":
    main()
