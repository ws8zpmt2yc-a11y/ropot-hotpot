"use client";

import { useState } from "react";
import { FoodThumb } from "@/components/food/FoodThumb";
import { FoodDefs } from "@/components/food/FoodDefs";
import { Button } from "@/components/brand/Button";
import { CountUp } from "@/components/brand/CountUp";
import { useOrder } from "@/hooks/useOrder";
import { getBroth } from "@/data/broths";
import { getSpice } from "@/data/spice";
import { getIngredient } from "@/data/ingredients";
import { money } from "@/lib/format";

function LineRow({
  ingredientId,
  quantity,
}: {
  ingredientId: string;
  quantity: number;
}) {
  const { addIngredient, decrementIngredient } = useOrder();
  const ingredient = getIngredient(ingredientId);
  if (!ingredient) return null;

  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#1A1513] ring-1 ring-cream/10">
        <FoodThumb ingredient={ingredient} className="h-full w-full" density={0.9} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.9rem] font-bold leading-tight">
          {ingredient.name}
        </span>
        <span className="block text-[0.76rem] opacity-55">
          {money(ingredient.price)} each
        </span>
      </span>

      <span className="flex items-center gap-1 rounded-full bg-current/10 p-1">
        <button
          type="button"
          onClick={() => decrementIngredient(ingredient.id)}
          aria-label={`Remove one ${ingredient.name}`}
          className="press flex h-7 w-7 items-center justify-center rounded-full bg-current/10 text-current hover:bg-current/20"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M6 12h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
        <span className="w-5 text-center text-[0.88rem] font-extrabold tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => addIngredient(ingredient.id)}
          aria-label={`Add one more ${ingredient.name}`}
          className="press flex h-7 w-7 items-center justify-center rounded-full bg-current/10 text-current hover:bg-current/20"
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

      <span className="w-14 shrink-0 text-right text-[0.9rem] font-extrabold tabular-nums">
        {money(ingredient.price * quantity)}
      </span>
    </li>
  );
}

function SummaryBody({ compact = false }: { compact?: boolean }) {
  const { state, itemCount, brothPrice, subtotal, prepMinutes } = useOrder();
  const broth = getBroth(state.brothId);
  const spice = getSpice(state.spiceId);

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">
          Your bowl
        </h3>
        <span className="text-[0.74rem] font-bold uppercase tracking-[0.12em] opacity-55">
          {itemCount} {itemCount === 1 ? "portion" : "portions"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-current/8 px-4 py-3">
        <div>
          <p className="text-[0.95rem] font-bold leading-tight">
            {broth ? broth.name : "No broth chosen yet"}
          </p>
          <p className="text-[0.78rem] opacity-60">
            {spice ? `${spice.name} spice` : "Pick a spice level"}
          </p>
        </div>
        <span className="text-[0.9rem] font-extrabold tabular-nums">
          {broth ? money(brothPrice) : "—"}
        </span>
      </div>

      {state.lines.length > 0 ? (
        <ul
          className={`mt-1 divide-y divide-current/10 ${
            compact ? "max-h-[38vh] overflow-y-auto" : "max-h-[34vh] overflow-y-auto"
          }`}
        >
          {state.lines.map((line) => (
            <LineRow
              key={line.ingredientId}
              ingredientId={line.ingredientId}
              quantity={line.quantity}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-2xl border border-dashed border-current/25 px-4 py-6 text-center text-[0.86rem] opacity-65">
          Nothing in the bowl yet. Pick an ingredient and watch an arm go and
          get it.
        </p>
      )}

      <div className="mt-4 border-t border-current/15 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow opacity-60">Subtotal</span>
          <CountUp
            value={subtotal}
            className="font-display text-3xl font-semibold tabular-nums"
          />
        </div>
        <p className="mt-1.5 text-[0.78rem] opacity-55">
          Ready about {prepMinutes} minutes after you order.
        </p>
      </div>
    </>
  );
}

/** Desktop: a card that sits beside the picker. */
export function OrderSummaryPanel({
  onReview,
  onAddMore,
}: {
  onReview: () => void;
  onAddMore?: () => void;
}) {
  const { ready } = useOrder();

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[calc(var(--nav-h)+20px)] rounded-3xl bg-warm-white p-6 text-ink shadow-[0_28px_70px_-40px_rgba(0,0,0,0.8)] ring-1 ring-ink/8">
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <FoodDefs />
        </svg>
        <SummaryBody />
        <div className="mt-5 grid gap-2.5">
          <Button onClick={onReview} disabled={!ready} size="md">
            Review order
          </Button>
          {onAddMore ? (
            <Button variant="ghost" size="md" onClick={onAddMore}>
              Add more
            </Button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

/** Mobile: a bottom sheet that expands over the picker. */
export function OrderSummarySheet({ onReview }: { onReview: () => void }) {
  const [open, setOpen] = useState(false);
  const { itemCount, subtotal, ready } = useOrder();

  return (
    <div className="lg:hidden">
      {open ? (
        <button
          type="button"
          aria-label="Close order summary"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-[2px]"
        />
      ) : null}

      <div
        className={`fixed inset-x-0 bottom-0 z-40 rounded-t-3xl bg-warm-white text-ink shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.9)] transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-[calc(100%-88px)]"
        }`}
        style={{ maxHeight: "82vh" }}
      >
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <FoodDefs />
        </svg>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex h-[88px] w-full items-center gap-4 px-5 text-left"
        >
          <span className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-ink/20" />
          <span className="flex-1">
            <span className="block text-[0.72rem] font-bold uppercase tracking-[0.14em] opacity-55">
              Your bowl · {itemCount}{" "}
              {itemCount === 1 ? "portion" : "portions"}
            </span>
            <CountUp
              value={subtotal}
              className="font-display text-2xl font-semibold tabular-nums"
            />
          </span>
          <span className="press inline-flex h-11 items-center rounded-full bg-red-bright px-5 text-[0.74rem] font-bold uppercase tracking-[0.13em] text-cream">
            {open ? "Close" : "View"}
          </span>
        </button>

        <div className="max-h-[calc(82vh-88px)] overflow-y-auto px-5 pb-8">
          <SummaryBody compact />
          <Button
            onClick={onReview}
            disabled={!ready}
            size="lg"
            className="mt-5 w-full"
          >
            Review order
          </Button>
        </div>
      </div>
    </div>
  );
}
