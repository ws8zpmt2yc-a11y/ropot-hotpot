"""Crops a dish photograph down to just the food.

The station draws its own dish under every tray, so a photo that still has its
own rim in it ends up as a dish inside a dish with the food shrunk into the
middle. Cropping to the food lets it fill the tray the way the drawn art does.

  python3 scripts/crop-to-food.py <src> <dst> [size]
"""
import sys, pathlib
import numpy as np
from PIL import Image


def crop_to_food(src: pathlib.Path, dst: pathlib.Path, size: int = 640) -> None:
    img = Image.open(src).convert("RGB")
    a = np.asarray(img).astype(np.float32)
    lum = a.mean(axis=2)

    # The food is markedly brighter than both the black ground and the dark
    # dish rim it sits in.
    food = lum > 72
    ys, xs = np.where(food)
    if len(ys) < 50:
        food = lum > 45
        ys, xs = np.where(food)
    if len(ys) < 50:
        img.resize((size, size), Image.LANCZOS).save(dst, quality=88, optimize=True)
        return

    cy, cx = (ys.min() + ys.max()) / 2, (xs.min() + xs.max()) / 2
    half = max(ys.max() - ys.min(), xs.max() - xs.min()) / 2 * 1.04
    half = min(half, cx, cy, img.width - cx, img.height - cy)

    box = (int(cx - half), int(cy - half), int(cx + half), int(cy + half))
    img.crop(box).resize((size, size), Image.LANCZOS).save(
        dst, quality=88, optimize=True
    )


if __name__ == "__main__":
    out = pathlib.Path(sys.argv[2])
    crop_to_food(pathlib.Path(sys.argv[1]), out, int(sys.argv[3]) if len(sys.argv) > 3 else 640)
    print(f"  {out.name}")
