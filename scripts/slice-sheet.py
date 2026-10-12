"""Cuts a grid sheet of dishes into individual square crops.

Each cell is searched for the dish itself rather than sliced blindly, because
the generator never spaces a grid perfectly evenly.

  python3 scripts/slice-sheet.py sheet.png 3 2 id-a id-b id-c id-d id-e id-f
"""
import sys, pathlib
import numpy as np
from PIL import Image

src = pathlib.Path(sys.argv[1])
cols, rows = int(sys.argv[2]), int(sys.argv[3])
names = sys.argv[4:]
assert len(names) == cols * rows, f"expected {cols * rows} names, got {len(names)}"

img = Image.open(src).convert("RGB")
a = np.asarray(img).astype(np.float32)
lum = a.mean(axis=2)
# The dishes sit on near-black; anything above this is dish or food.
ink = lum > 26

H, W = lum.shape
out_dir = pathlib.Path("public/images/ingredients")
out_dir.mkdir(parents=True, exist_ok=True)

for r in range(rows):
    for c in range(cols):
        name = names[r * cols + c]
        y0, y1 = r * H // rows, (r + 1) * H // rows
        x0, x1 = c * W // cols, (c + 1) * W // cols
        # Inset before searching, or a neighbouring dish that creeps over the
        # cell boundary drags the detected bounds out with it.
        iy, ix = int((y1 - y0) * 0.07), int((x1 - x0) * 0.07)
        y0, y1, x0, x1 = y0 + iy, y1 - iy, x0 + ix, x1 - ix
        cell = ink[y0:y1, x0:x1]
        ys, xs = np.where(cell)
        if len(ys) == 0:
            print(f"  !! {name}: nothing found in cell")
            continue
        cy = (ys.min() + ys.max()) / 2 + y0
        cx = (xs.min() + xs.max()) / 2 + x0
        # Square crop around the dish, with a little breathing room.
        half = max(ys.max() - ys.min(), xs.max() - xs.min()) / 2 * 1.06
        # Never reach past the cell: an oversized dish would otherwise pull a
        # slice of its neighbour into the crop.
        half = min(half, (W / cols) * 0.46, (H / rows) * 0.46)
        left, top = int(cx - half), int(cy - half)
        size = int(half * 2)
        left, top = max(0, left), max(0, top)
        size = min(size, W - left, H - top)
        crop = img.crop((left, top, left + size, top + size)).resize(
            (640, 640), Image.LANCZOS
        )
        dst = out_dir / f"{name}.jpg"
        crop.save(dst, quality=88, optimize=True)
        print(f"  {name}.jpg  ({size}px source)")
