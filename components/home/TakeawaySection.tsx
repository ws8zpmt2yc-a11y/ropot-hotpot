import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { ButtonLink } from "@/components/brand/Button";
import { Eyebrow } from "@/components/brand/Bits";

const POINTS = [
  {
    title: "Broth travels separately",
    body: "Sealed hot in its own container so your greens don't turn to soup on the drive home.",
  },
  {
    title: "Everything raw, everything labelled",
    body: "You cook it at your table, at your pace, at your heat.",
  },
  {
    title: "Boxed in about fifteen minutes",
    body: "Build the bowl online before you leave and it's waiting at the counter.",
  },
];

export function TakeawaySection() {
  return (
    <section className="dark-surface grain relative overflow-hidden bg-red-brand py-16 text-cream sm:py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative overflow-hidden rounded-[32px] shadow-[0_40px_100px_-45px_rgba(0,0,0,0.9)] ring-1 ring-cream/15">
          <BrandImage
            src={BRAND_IMAGES.takeaway}
            alt="Two red RoPot Hotpot takeaway boxes stacked on the counter"
            className="aspect-[5/4] w-full"
            fallbackTone="deep"
          />
        </div>

        <div>
          <Eyebrow className="text-amber-soft">Takeaway</Eyebrow>
          <h2 className="display-lg mt-4 uppercase">
            Built your way.
            <br />
            Boxed for home.
          </h2>
          <p className="lede mt-6 max-w-md text-cream/78">
            The same ingredients, the same arms, the same broth — packed to
            travel. Your hotpot, ready to roll.
          </p>

          <ul className="mt-8 space-y-5">
            {POINTS.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber" />
                <div>
                  <h3 className="font-bold">{point.title}</h3>
                  <p className="mt-1 max-w-sm text-[0.9rem] leading-relaxed text-cream/60">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <ButtonLink href="/order" variant="cream" size="lg" className="mt-9">
            Build a takeaway bowl
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
