"use client";

import { useState } from "react";
import { FoodThumb } from "@/components/food/FoodThumb";
import { FoodDefs } from "@/components/food/FoodDefs";
import {
  CATEGORY_COLORS,
  CATEGORY_ORDER,
  INGREDIENTS_BY_CATEGORY,
} from "@/data/ingredients";
import type { Category } from "@/types/order";

/**
 * Mobile ingredient picker. Tapping a card sends the same job to the arms as
 * clicking a tray on the desktop ring, so the choreography above stays the
 * hero on every screen size.
 */
export function MobileIngredientRail({
  quantityOf,
  inFlight,
  onSelect,
}: {
  quantityOf: (id: string) => number;
  inFlight: string[];
  onSelect: (id: string) => void;
}) {
  const [category, setCategory] = useState<Category>(CATEGORY_ORDER[0]);
  const group = INGREDIENTS_BY_CATEGORY.find(
    (entry) => entry.category === category,
  );

  return (
    <div className="lg:hidden">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <FoodDefs />
      </svg>

      <div className="no-scrollbar edge-fade-r -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {CATEGORY_ORDER.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setCategory(name)}
            className={`press shrink-0 rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] transition-colors ${
              category === name
                ? "bg-cream text-red-brand"
                : "bg-cream/10 text-cream/70"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
        {group?.items.map((ingredient) => {
          const quantity = quantityOf(ingredient.id);
          const busy = inFlight.includes(ingredient.id);
          return (
            <button
              key={ingredient.id}
              type="button"
              onClick={() => onSelect(ingredient.id)}
              aria-label={`${ingredient.name}, $${ingredient.price.toFixed(
                2,
              )}. Tap to have a robot add one.`}
              className="press relative w-[126px] shrink-0 rounded-2xl bg-[#241C1A] p-3 text-left ring-1 ring-cream/10"
            >
              <div className="relative mx-auto h-[84px] w-[84px] overflow-hidden rounded-full bg-[#1A1513] ring-1 ring-cream/10">
                <FoodThumb ingredient={ingredient} className="h-full w-full" />
                {busy ? (
                  <span className="absolute inset-0 rounded-full ring-[3px] ring-amber" />
                ) : null}
              </div>
              <p className="mt-2.5 text-[0.8rem] font-bold leading-tight text-cream">
                {ingredient.name}
              </p>
              <p
                className="mt-0.5 text-[0.72rem] font-semibold"
                style={{ color: CATEGORY_COLORS[ingredient.category] }}
              >
                +${ingredient.price.toFixed(2)}
              </p>
              {quantity > 0 ? (
                <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-jade px-1.5 text-[0.72rem] font-extrabold text-warm-white ring-2 ring-[#241C1A]">
                  {quantity}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
