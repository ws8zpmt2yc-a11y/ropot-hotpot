import { FoodArt } from "./FoodArt";
import { FoodImage, hasPhoto } from "./FoodImage";
import type { Ingredient } from "@/types/order";

/**
 * A round thumbnail of one ingredient, used everywhere outside the station:
 * the mobile rail, the order summary, the review list and the menu.
 *
 * Prefers the photograph and falls back to the drawn art, so a half-shot set
 * still looks deliberate rather than broken.
 */
export function FoodThumb({
  ingredient,
  className = "",
  density = 1,
}: {
  ingredient: Ingredient;
  className?: string;
  density?: number;
}) {
  return (
    <svg viewBox="-50 -50 100 100" className={className}>
      {hasPhoto(ingredient) ? (
        <FoodImage
          ingredient={ingredient}
          size={100}
          clipId={`thumb-${ingredient.id}`}
        />
      ) : (
        <FoodArt id={ingredient.id} size={92} density={density} />
      )}
    </svg>
  );
}
