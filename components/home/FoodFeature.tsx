import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { ButtonLink } from "@/components/brand/Button";
import { Eyebrow } from "@/components/brand/Bits";

export function FoodFeature() {
  return (
    <section className="dark-surface relative isolate grain overflow-hidden bg-ink text-cream">
      <BrandImage
        src={BRAND_IMAGES.food}
        alt="Sichuan broth at a rolling boil with beef, shiitake and corn"
        className="absolute inset-0 -z-10 h-full w-full"
        imgClassName="object-cover"
        fallbackTone="red"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgba(23,19,19,0.94)_0%,rgba(23,19,19,0.72)_42%,rgba(23,19,19,0.15)_100%)]" />

      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-36">
        <div className="max-w-xl">
          <Eyebrow className="text-amber">The food, first</Eyebrow>
          <h2 className="display-lg mt-4 uppercase">
            Hot pot worth
            <br />
            reaching for.
          </h2>
          <p className="lede mt-6 text-cream/78">
            Five broths, all made here. The Sichuan base gets erjingtiao chilli
            and whole peppercorn bloomed in beef tallow; the beef bones go
            twelve hours. Wagyu sliced to 1.2mm, greens cut the same morning,
            dumplings pleated by hand before service.
          </p>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-cream/55">
            You decide the ratio of meat to greens to noodles. Nobody standardises
            your bowl but you.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/menu" variant="cream" size="lg">
              See the menu
            </ButtonLink>
            <ButtonLink href="/order" variant="outline" size="lg" className="text-cream">
              Build a bowl
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
