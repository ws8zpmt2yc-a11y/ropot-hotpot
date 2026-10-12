#!/bin/bash
# Copies the five RoPot brand images into place.
#
#   ./scripts/add-brand-images.sh <robot-server> <takeaway> <food> <line> <poster>
#
# Any extension works; the files are renamed to the names the site expects.
set -euo pipefail

if [ "$#" -ne 5 ]; then
  echo "Usage: $0 <robot-server> <takeaway-boxes> <hotpot-food> <ingredient-line> <poster>"
  exit 1
fi

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/images/ropot"
NAMES=(robot-server takeaway-packaging hotpot-food ingredient-line ropot-hero-poster)

i=0
for src in "$@"; do
  ext="${src##*.}"
  cp "$src" "$DIR/${NAMES[$i]}.$ext"
  echo "→ ${NAMES[$i]}.$ext"
  i=$((i + 1))
done

echo
echo "Done. If any extension is not .png, update BRAND_IMAGES in"
echo "components/brand/BrandImage.tsx to match."
