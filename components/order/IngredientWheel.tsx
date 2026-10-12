"use client";

import { IngredientTray } from "./IngredientTray";
import { INGREDIENTS } from "@/data/ingredients";
import { slotPosition, STAGE } from "@/lib/geometry";
import type { Ingredient } from "@/types/order";

/**
 * The ring of ingredient dishes around the preparation station, ordered so
 * each category sits together the way the real ingredient line does.
 *
 * The whole ring sits slightly behind the focal plane, so it is drawn through
 * a gentle blur. Whatever the customer is pointing at — or whatever an arm is
 * on its way to — gets a sharp copy drawn over the top, which reads as the
 * camera pulling focus.
 */
export function IngredientWheel({
  items = INGREDIENTS,
  quantityOf,
  hovered,
  inFlight,
  onHover,
  onSelect,
  softFocus = true,
}: {
  items?: Ingredient[];
  quantityOf: (id: string) => number;
  hovered: string | null;
  inFlight: string[];
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  softFocus?: boolean;
}) {
  const focusIds = Array.from(
    new Set([hovered, ...inFlight].filter((id): id is string => Boolean(id))),
  );
  const focusItems = items.filter((item) => focusIds.includes(item.id));

  const tray = (ingredient: Ingredient, decorative: boolean) => {
    const point = slotPosition(ingredient.robotPosition.slot);
    return (
      <IngredientTray
        key={`${ingredient.id}${decorative ? "-focus" : ""}`}
        ingredient={ingredient}
        x={point.x}
        y={point.y}
        quantity={quantityOf(ingredient.id)}
        hovered={hovered === ingredient.id}
        inFlight={inFlight.includes(ingredient.id)}
        decorative={decorative}
        onHover={onHover}
        onSelect={onSelect}
      />
    );
  };

  return (
    <g>
      {/* The bench the dishes sit on, further out of focus than the dishes. */}
      <g filter={softFocus ? "url(#dof-bench)" : undefined}>
        <circle
          cx={STAGE.centre.x}
          cy={STAGE.centre.y}
          r={STAGE.ringRadius}
          fill="none"
          stroke="rgba(255,241,222,0.09)"
          strokeWidth={STAGE.trayRadius * 2.5}
        />
        <circle
          cx={STAGE.centre.x}
          cy={STAGE.centre.y}
          r={STAGE.ringRadius + STAGE.trayRadius * 1.25}
          fill="none"
          stroke="rgba(255,241,222,0.1)"
          strokeWidth="1.5"
        />
        <circle
          cx={STAGE.centre.x}
          cy={STAGE.centre.y}
          r={STAGE.ringRadius - STAGE.trayRadius * 1.25}
          fill="none"
          stroke="rgba(255,241,222,0.1)"
          strokeWidth="1.5"
        />
      </g>

      <g filter={softFocus ? "url(#dof-ring)" : undefined}>
        {items.map((ingredient) => tray(ingredient, false))}
      </g>

      {/* Focus pull. */}
      {softFocus && focusItems.length > 0 ? (
        <g style={{ pointerEvents: "none" }}>
          {focusItems.map((ingredient) => tray(ingredient, true))}
        </g>
      ) : null}
    </g>
  );
}
