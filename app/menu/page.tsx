import type { Metadata } from "next";
import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { ButtonLink } from "@/components/brand/Button";
import { Chilli, Eyebrow } from "@/components/brand/Bits";
import { FoodThumb } from "@/components/food/FoodThumb";
import { FoodDefs } from "@/components/food/FoodDefs";
import { BROTHS } from "@/data/broths";
import { INGREDIENTS_BY_CATEGORY, CATEGORY_COLORS } from "@/data/ingredients";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Five house broths and twenty-four ingredients, all portioned to order. Prices, spice levels and what goes in each pot.",
};

export default function MenuPage() {
  return (
    <div className="pt-[var(--nav-h)]">
      <section className="dark-surface relative isolate grain overflow-hidden bg-ink text-cream">
        <BrandImage
          src={BRAND_IMAGES.food}
          alt="A pot of Sichuan hotpot at a rolling boil"
          className="absolute inset-0 -z-10 h-full w-full"
          fallbackTone="red"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(23,19,19,0.85)_0%,rgba(23,19,19,0.55)_45%,rgba(23,19,19,0.96)_100%)]" />
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
          <Eyebrow className="text-amber">The menu</Eyebrow>
          <h1 className="display-xl mt-5 uppercase">
            Pick a pot.
            <br />
            Fill it up.
          </h1>
          <p className="lede mt-7 max-w-lg text-cream/75">
            Every broth includes the pot, our house dipping sauce and steamed
            rice. Ingredients are priced per portion — build the ratio you
            actually want.
          </p>
        </div>
      </section>

      {/* Broths */}
      <section className="bg-warm-white py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow className="text-red-brand">Broths</Eyebrow>
          <h2 className="display-lg mt-4 uppercase">The base</h2>

          <ul className="mt-10 divide-y divide-ink/10">
            {BROTHS.map((broth) => (
              <li
                key={broth.id}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6"
              >
                <h3 className="font-display text-3xl font-semibold uppercase leading-none">
                  {broth.name}
                </h3>
                <span className="flex gap-0.5 text-red-bright">
                  {[0, 1, 2].map((index) => (
                    <Chilli key={index} filled={index < broth.heat} className="h-4 w-4" />
                  ))}
                </span>
                <span className="ml-auto font-display text-2xl font-semibold tabular-nums text-red-bright">
                  {money(broth.price)}
                </span>
                <p className="w-full max-w-2xl text-[0.95rem] leading-relaxed text-ink/62">
                  {broth.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ingredients */}
      <section className="dark-surface grain bg-[#2A0A0B] py-16 text-cream sm:py-24">
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <FoodDefs />
        </svg>
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow className="text-amber">Ingredients</Eyebrow>
              <h2 className="display-lg mt-4 uppercase">The ring</h2>
              <p className="lede mt-4 max-w-lg text-cream/70">
                Twenty-four trays, all within reach of both arms. Priced per
                portion.
              </p>
            </div>
            <ButtonLink href="/order" variant="cream" size="lg">
              Build your bowl
            </ButtonLink>
          </div>

          <div className="mt-12 space-y-12">
            {INGREDIENTS_BY_CATEGORY.map((group) => (
              <div key={group.category}>
                <h3
                  className="eyebrow flex items-center gap-3"
                  style={{ color: CATEGORY_COLORS[group.category] }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: CATEGORY_COLORS[group.category] }}
                  />
                  {group.category}
                </h3>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className="flex gap-4 rounded-2xl bg-cream/6 p-4 ring-1 ring-cream/10"
                    >
                      <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#1A1513] ring-1 ring-cream/10">
                        <FoodThumb ingredient={ingredient} className="h-full w-full" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-bold leading-tight">
                            {ingredient.name}
                          </span>
                          <span className="shrink-0 font-extrabold tabular-nums text-amber">
                            {money(ingredient.price)}
                          </span>
                        </span>
                        <span className="mt-1 block text-[0.82rem] leading-snug text-cream/60">
                          {ingredient.blurb}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
