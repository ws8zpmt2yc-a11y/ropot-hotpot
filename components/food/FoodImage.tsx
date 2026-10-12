import type { Ingredient } from "@/types/order";

/**
 * A photographed ingredient, drawn into the SVG stage in place of the built-in
 * art. Set `image` on an ingredient in data/ingredients.ts to switch it over —
 * anything without a photograph keeps using FoodArt, so the two can coexist
 * while the set is being shot.
 *
 * `crop` decides how much of the frame is used: the whole dish on the ring,
 * or just the food in the middle when it is a portion in the gripper or the
 * bowl, where the dish itself would make no sense.
 */
export function FoodImage({
  ingredient,
  size,
  crop = 1,
  clipId,
  softEdge = false,
}: {
  ingredient: Ingredient;
  /** Diameter in stage units. */
  size: number;
  /** 1 = the whole dish, 0.55 = the food in the centre of it. */
  crop?: number;
  /** Must be unique per drawn instance. */
  clipId: string;
  /**
   * Fade the edge instead of cutting it. A hard circle is right for a dish on
   * the ring, but a portion sitting in broth needs to lose its outline or it
   * reads as a coin floating on the surface.
   */
  softEdge?: boolean;
}) {
  const radius = size / 2;
  const drawn = size / crop;

  return (
    <g>
      <defs>
        {softEdge ? (
          <radialGradient id={`${clipId}-fade`}>
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="62%" stopColor="#fff" stopOpacity="1" />
            <stop offset="88%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        ) : null}
        {softEdge ? (
          <mask id={clipId}>
            <circle r={radius} fill={`url(#${clipId}-fade)`} />
          </mask>
        ) : (
          <clipPath id={clipId}>
            <circle r={radius} />
          </clipPath>
        )}
      </defs>
      <g
        clipPath={softEdge ? undefined : `url(#${clipId})`}
        mask={softEdge ? `url(#${clipId})` : undefined}
      >
        <image
          href={ingredient.image}
          x={-drawn / 2}
          y={-drawn / 2}
          width={drawn}
          height={drawn}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </g>
  );
}

export const hasPhoto = (ingredient: Ingredient): boolean =>
  Boolean(ingredient.image);
