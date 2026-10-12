/**
 * Canonical paths for the five supplied RoPot brand assets.
 *
 * This deliberately lives outside the "use client" BrandImage module: a client
 * module's exports become client references when a server component imports
 * them, which would leave every path undefined.
 *
 * See public/images/ropot/README.md for what belongs at each path.
 */
import { asset } from "@/lib/asset";

export const BRAND_IMAGES = {
  robotServer: asset("/images/ropot/robot-server.jpg"),
  takeaway: asset("/images/ropot/takeaway-packaging.jpg"),
  food: asset("/images/ropot/hotpot-food.jpg"),
  ingredientLine: asset("/images/ropot/ingredient-line.jpg"),
  poster: asset("/images/ropot/ropot-hero-poster.jpg"),
} as const;
