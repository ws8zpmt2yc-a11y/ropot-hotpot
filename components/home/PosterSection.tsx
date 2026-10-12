import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { Eyebrow } from "@/components/brand/Bits";

/**
 * The RoPot poster, hung on the restaurant wall. Deliberately uncropped —
 * the artwork carries the two brand lines on its own.
 */
export function PosterSection() {
  return (
    <section className="dark-surface relative grain overflow-hidden bg-[#3A0D0F] py-16 text-cream sm:py-24">
      {/* Wall behind the frame. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_28%_36%,rgba(255,154,61,0.16),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-[420px]">
          {/* Frame. */}
          <div className="rounded-[14px] bg-[#1B1512] p-3 shadow-[0_50px_110px_-45px_rgba(0,0,0,1)] ring-1 ring-cream/12">
            <div className="rounded-[6px] bg-[#0F0C0B] p-1.5">
              <BrandImage
                src={BRAND_IMAGES.poster}
                alt="RoPot Hotpot poster: hot pot with a helping hand, good food, cuter robots"
                className="aspect-[3/4] w-full"
                imgClassName="object-contain"
                fallbackTone="red"
              />
            </div>
          </div>
          <span className="pointer-events-none absolute inset-x-8 -bottom-4 h-8 rounded-full bg-black/45 blur-xl" />
        </div>

        <div>
          <Eyebrow className="text-amber">On the wall</Eyebrow>
          <h2 className="display-lg mt-4 uppercase">
            Two lines,
            <br />
            one restaurant.
          </h2>
          <div className="mt-8 space-y-7">
            <blockquote>
              <p className="font-display text-3xl font-semibold uppercase leading-none sm:text-4xl">
                Hot pot with a helping hand.
              </p>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-cream/60">
                The helping hand is literal. Two of them, actually, on the
                ingredient station.
              </p>
            </blockquote>
            <blockquote>
              <p className="font-display text-3xl font-semibold uppercase leading-none text-amber sm:text-4xl">
                Good food. Cuter robots.
              </p>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-cream/60">
                In that order. The robots are the reason people come the first
                time; the broth is the reason they come back.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
