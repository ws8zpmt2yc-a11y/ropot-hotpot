import { FoodArt } from "./FoodArt";
import { FoodImage, hasPhoto } from "./FoodImage";
import { getIngredient } from "@/data/ingredients";

/**
 * A single serve of an ingredient — in the gripper, mid-fall, or settled in
 * the bowl. Takes a tight crop out of the middle of the dish photograph, so
 * it reads as a handful of food rather than a whole dish shrunk down.
 */
export function FoodPortion({
  ingredientId,
  size,
  seed = 0,
  instance,
}: {
  ingredientId: string;
  size: number;
  seed?: number;
  /** Must be unique per drawn copy, or clip paths collide. */
  instance: string;
}) {
  const ingredient = getIngredient(ingredientId);
  if (!ingredient) return null;

  if (hasPhoto(ingredient)) {
    return (
      <FoodImage
        ingredient={ingredient}
        size={size}
        crop={0.58}
        softEdge
        clipId={`portion-${instance}`}
      />
    );
  }
  return <FoodArt id={ingredientId} size={size} density={0.36} seed={seed} />;
}
