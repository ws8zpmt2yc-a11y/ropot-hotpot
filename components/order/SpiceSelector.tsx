"use client";

import { Button } from "@/components/brand/Button";
import { Chilli } from "@/components/brand/Bits";
import { SPICE_LEVELS } from "@/data/spice";
import { getBroth } from "@/data/broths";
import { useOrder } from "@/hooks/useOrder";

export function SpiceSelector({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { state, setSpice } = useOrder();
  const broth = getBroth(state.brothId);

  return (
    <div>
      <header className="max-w-2xl">
        <h2 className="display-lg uppercase">How hot?</h2>
        <p className="lede mt-3 text-cream/70">
          {broth
            ? `We'll dial the ${broth.name.toLowerCase()} base to suit. You can always ask for extra chilli oil on the side.`
            : "Pick how much heat you want in the pot."}
        </p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SPICE_LEVELS.map((level) => {
          const selected = state.spiceId === level.id;
          return (
            <li key={level.id}>
              <button
                type="button"
                onClick={() => setSpice(level.id)}
                aria-pressed={selected}
                className={`press flex h-full w-full flex-col items-start rounded-3xl p-6 text-left ring-1 transition-colors ${
                  selected
                    ? "bg-cream text-red-brand ring-2 ring-amber"
                    : "bg-cream/6 text-cream ring-cream/12 hover:bg-cream/12"
                }`}
              >
                <span className="flex gap-1">
                  {[0, 1, 2].map((index) => (
                    <Chilli
                      key={index}
                      filled={index < level.chillies}
                      className={`h-6 w-6 ${
                        selected ? "text-red-bright" : "text-amber"
                      }`}
                    />
                  ))}
                  {level.chillies === 0 ? (
                    <span
                      className={`text-[0.72rem] font-bold uppercase tracking-[0.12em] ${
                        selected ? "text-red-brand/60" : "text-cream/45"
                      }`}
                    >
                      None
                    </span>
                  ) : null}
                </span>
                <span className="mt-4 font-display text-2xl font-semibold leading-none">
                  {level.name}
                </span>
                <span
                  className={`mt-1.5 text-[0.74rem] font-bold uppercase tracking-[0.11em] ${
                    selected ? "text-red-bright" : "text-amber/80"
                  }`}
                >
                  {level.scoville}
                </span>
                <span
                  className={`mt-3 text-[0.86rem] leading-relaxed ${
                    selected ? "text-red-brand/75" : "text-cream/60"
                  }`}
                >
                  {level.description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="text-cream">
          Back
        </Button>
        <Button size="lg" variant="cream" onClick={onNext} disabled={!state.spiceId}>
          Next — meet the arms
        </Button>
      </div>
    </div>
  );
}
