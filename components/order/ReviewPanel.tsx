"use client";

import { FoodThumb } from "@/components/food/FoodThumb";
import { FoodDefs } from "@/components/food/FoodDefs";
import { Button } from "@/components/brand/Button";
import { CountUp } from "@/components/brand/CountUp";
import { Chilli } from "@/components/brand/Bits";
import { HotpotBowl } from "./HotpotBowl";
import { StationDefs } from "./StationDefs";
import { useOrder } from "@/hooks/useOrder";
import { getBroth } from "@/data/broths";
import { getSpice } from "@/data/spice";
import { getIngredient } from "@/data/ingredients";
import { money } from "@/lib/format";
import { STAGE } from "@/lib/geometry";

export function ReviewPanel({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const {
    state,
    itemCount,
    brothPrice,
    ingredientsSubtotal,
    subtotal,
    prepMinutes,
    addIngredient,
    decrementIngredient,
    removeIngredient,
    ready,
  } = useOrder();

  const broth = getBroth(state.brothId);
  const spice = getSpice(state.spiceId);

  return (
    <div>
      <header className="max-w-2xl">
        <h2 className="display-lg uppercase">Check the bowl</h2>
        <p className="lede mt-3 text-cream/70">
          This is exactly what goes in the box. Change anything you like —
          removing a portion won&rsquo;t send the arms back out.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)]">
        {/* Finished bowl. */}
        <div>
          <div className="overflow-hidden rounded-3xl bg-[#1F0708] ring-1 ring-cream/12">
            <svg viewBox="304 304 392 392" className="h-auto w-full">
              <StationDefs />
              <rect x="304" y="304" width="392" height="392" fill="url(#station-floor)" />
              <rect x="304" y="304" width="392" height="392" fill="url(#station-spot)" />
              <HotpotBowl
                lines={state.lines}
                brothId={state.brothId}
                spiceLevel={spice?.chillies ?? 1}
                radius={STAGE.bowlRadius * 1.35}
              />
            </svg>
          </div>

          <dl className="mt-5 space-y-2.5 rounded-3xl bg-cream/6 p-5 ring-1 ring-cream/10">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[0.8rem] uppercase tracking-[0.11em] text-cream/50">
                Broth
              </dt>
              <dd className="text-right font-bold">
                {broth?.name ?? "Not chosen"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[0.8rem] uppercase tracking-[0.11em] text-cream/50">
                Spice
              </dt>
              <dd className="flex items-center gap-2 font-bold">
                {spice?.name ?? "—"}
                <span className="flex gap-0.5 text-amber">
                  {[0, 1, 2].map((index) => (
                    <Chilli
                      key={index}
                      filled={index < (spice?.chillies ?? 0)}
                      className="h-4 w-4"
                    />
                  ))}
                </span>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[0.8rem] uppercase tracking-[0.11em] text-cream/50">
                Ready in
              </dt>
              <dd className="text-right font-bold">about {prepMinutes} min</dd>
            </div>
          </dl>
        </div>

        {/* Line items. */}
        <div>
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <FoodDefs />
          </svg>

          {state.lines.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-cream/25 p-10 text-center">
              <p className="text-cream/70">
                The bowl is empty. Send the arms out for something.
              </p>
              <Button variant="cream" className="mt-5" onClick={onBack}>
                Add ingredients with the robots
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-cream/10 rounded-3xl bg-cream/6 px-5 ring-1 ring-cream/10">
              {state.lines.map((line) => {
                const ingredient = getIngredient(line.ingredientId);
                if (!ingredient) return null;
                return (
                  <li key={line.ingredientId} className="flex items-center gap-4 py-4">
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#1A1513] ring-1 ring-cream/10">
                      <FoodThumb
                        ingredient={ingredient}
                        className="h-full w-full"
                        density={0.9}
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-bold leading-tight">
                        {ingredient.name}
                      </span>
                      <span className="block text-[0.8rem] text-cream/50">
                        {ingredient.category} · {money(ingredient.price)} each
                      </span>
                    </span>

                    <span className="flex items-center gap-1 rounded-full bg-cream/10 p-1">
                      <button
                        type="button"
                        onClick={() => decrementIngredient(ingredient.id)}
                        aria-label={`Remove one ${ingredient.name}`}
                        className="press flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 hover:bg-cream/25"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                          <path d="M6 12h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      </button>
                      <span className="w-6 text-center font-extrabold tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addIngredient(ingredient.id)}
                        aria-label={`Add one more ${ingredient.name}`}
                        className="press flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 hover:bg-cream/25"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                          <path
                            d="M12 6v12M6 12h12"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </span>

                    <span className="w-16 text-right font-extrabold tabular-nums">
                      {money(ingredient.price * line.quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient.id)}
                      aria-label={`Remove ${ingredient.name} entirely`}
                      className="press flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream/40 hover:bg-cream/10 hover:text-cream"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-6 rounded-3xl bg-cream/6 p-6 ring-1 ring-cream/10">
            <div className="flex items-baseline justify-between text-[0.9rem] text-cream/65">
              <span>Broth base</span>
              <span className="tabular-nums">{money(brothPrice)}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between text-[0.9rem] text-cream/65">
              <span>
                {itemCount} {itemCount === 1 ? "portion" : "portions"}
              </span>
              <span className="tabular-nums">{money(ingredientsSubtotal)}</span>
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-cream/15 pt-4">
              <span className="eyebrow text-cream/55">Subtotal</span>
              <CountUp
                value={subtotal}
                className="font-display text-4xl font-semibold tabular-nums"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <Button variant="outline" size="lg" onClick={onBack} className="text-cream">
              Add more with the robots
            </Button>
            <Button size="lg" variant="cream" onClick={onNext} disabled={!ready}>
              Pickup details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
