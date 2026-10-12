"use client";

import { BrandImage } from "@/components/brand/BrandImage";
import { Button } from "@/components/brand/Button";
import { HotpotBowl } from "./HotpotBowl";
import { Chilli } from "@/components/brand/Bits";
import { BROTHS } from "@/data/broths";
import { useOrder } from "@/hooks/useOrder";
import { money } from "@/lib/format";

export function BrothSelector({ onNext }: { onNext: () => void }) {
  const { state, setBroth } = useOrder();

  return (
    <div>
      <header className="max-w-2xl">
        <h2 className="display-lg uppercase">Start with the broth</h2>
        <p className="lede mt-3 text-cream/70">
          Everything else is built on this. Each base includes the pot, house
          dipping sauce and steamed rice.
        </p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {BROTHS.map((broth) => {
          const selected = state.brothId === broth.id;
          return (
            <li key={broth.id}>
              <button
                type="button"
                onClick={() => setBroth(broth.id)}
                aria-pressed={selected}
                className={`press group relative block w-full overflow-hidden rounded-3xl text-left ring-1 transition-shadow ${
                  selected
                    ? "shadow-[0_24px_60px_-30px_rgba(255,154,61,0.9)] ring-2 ring-amber"
                    : "ring-cream/12 hover:ring-cream/30"
                }`}
              >
                {broth.image ? (
                  <BrandImage
                    src={broth.image}
                    alt={`${broth.name} broth`}
                    className="h-44 w-full"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.06]"
                    fallbackLabel={broth.name}
                    fallbackTone={broth.heat >= 2 ? "red" : "deep"}
                  />
                ) : (
                  /* No photograph yet: show the pot itself, in this broth's
                     own colour, which is what the bowl will actually look
                     like once it's poured. */
                  <span
                    className="block h-44 w-full overflow-hidden bg-[#1F0708]"
                    role="img"
                    aria-label={`${broth.name} broth`}
                  >
                    <svg
                      viewBox="356 356 288 288"
                      className="h-full w-full transition-transform duration-500 group-hover:scale-[1.06]"
                    >
                      <HotpotBowl
                        lines={[]}
                        brothId={broth.id}
                        spiceLevel={broth.heat}
                        radius={126}
                        idPrefix="card-"
                      />
                    </svg>
                  </span>
                )}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(23,19,19,0)_38%,rgba(23,19,19,0.85)_100%)]" />

                <span className="absolute right-3 top-3 flex gap-0.5 rounded-full bg-ink/70 px-2.5 py-1.5 text-cream">
                  {[0, 1, 2].map((index) => (
                    <Chilli key={index} filled={index < broth.heat} className="h-3.5 w-3.5" />
                  ))}
                </span>

                {selected ? (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-ink">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                      <path
                        d="M5 12.5l4.5 4.5L19 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Chosen
                  </span>
                ) : null}

                <span className="block bg-[#3A0D0F] p-5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-2xl font-semibold leading-none">
                      {broth.name}
                    </span>
                    <span className="text-[0.95rem] font-extrabold tabular-nums text-amber">
                      {money(broth.price)}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-amber/80">
                    {broth.tagline}
                  </span>
                  <span className="mt-2.5 block text-[0.88rem] leading-relaxed text-cream/65">
                    {broth.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-end">
        <Button size="lg" variant="cream" onClick={onNext} disabled={!state.brothId}>
          Next — spice level
        </Button>
      </div>
    </div>
  );
}
