"""Keys a chroma-green background out of a generated arm segment.

Green screen rather than white or black, because the arm itself is white with
dark grey joints — neither of those could be separated from a matching ground.
"""
import sys, pathlib
import numpy as np
from PIL import Image


def key(src: pathlib.Path, dst: pathlib.Path) -> tuple[int, int]:
    img = Image.open(src).convert("RGB")
    a = np.asarray(img).astype(np.float32)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]

    # Greenness: how far the green channel runs ahead of the other two.
    greenness = g - np.maximum(r, b)
    alpha = np.clip(1.0 - (greenness - 25.0) / 55.0, 0.0, 1.0)

    # Spill suppression: pull green back down to the neighbouring channels so
    # the white shell doesn't keep a green rim.
    cap = np.maximum(r, b) + 12.0
    a[:, :, 1] = np.minimum(g, cap)

    rgba = np.zeros((a.shape[0], a.shape[1], 4), dtype=np.uint8)
    rgba[:, :, :3] = np.clip(a, 0, 255).astype(np.uint8)
    rgba[:, :, 3] = (alpha * 255).astype(np.uint8)

    out = Image.fromarray(rgba, "RGBA")
    solid = np.argwhere(alpha > 0.4)
    if solid.size:
        y0, x0 = solid.min(axis=0)
        y1, x1 = solid.max(axis=0)
        out = out.crop((int(x0), int(y0), int(x1) + 1, int(y1) + 1))
    out.save(dst, optimize=True)
    return out.size


if __name__ == "__main__":
    size = key(pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]))
    print(f"{pathlib.Path(sys.argv[2]).name}: {size[0]}x{size[1]}")
