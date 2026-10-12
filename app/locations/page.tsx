import type { Metadata } from "next";
import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { ButtonLink } from "@/components/brand/Button";
import { Eyebrow } from "@/components/brand/Bits";
import { LOCATIONS } from "@/data/locations";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "RoPot Hotpot in Adelaide CBD and Norwood. Opening hours, phone numbers and where to collect your takeaway.",
};

export default function LocationsPage() {
  return (
    <div className="pt-[var(--nav-h)]">
      <section className="dark-surface grain warm-vignette text-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
          <Eyebrow className="text-amber">Locations</Eyebrow>
          <h1 className="display-xl mt-5 uppercase">
            Two rooms.
            <br />
            Same arms.
          </h1>
          <p className="lede mt-7 max-w-lg text-cream/78">
            Both shops run the full ingredient station. Order ahead and collect
            from the takeaway counter, or sit in and let a service robot bring
            the trays over.
          </p>
        </div>
      </section>

      <section className="bg-warm-white py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[1400px] space-y-10 px-5 sm:px-8">
          {LOCATIONS.map((location, index) => (
            <article
              key={location.id}
              className="grid gap-8 rounded-[28px] bg-cream p-6 ring-1 ring-ink/8 lg:grid-cols-[minmax(0,40%)_minmax(0,1fr)] lg:p-8"
            >
              <BrandImage
                src={
                  index === 0 ? BRAND_IMAGES.ingredientLine : BRAND_IMAGES.robotServer
                }
                alt={`Inside ${location.name}`}
                className="aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[300px]"
                fallbackTone={index === 0 ? "red" : "deep"}
              />

              <div>
                <h2 className="display-md uppercase">{location.name}</h2>
                <p className="mt-3 text-[1.05rem] text-ink/72">
                  {location.address}
                  <br />
                  {location.suburb}
                </p>
                <a
                  href={`tel:${location.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-2 inline-block text-lg font-bold text-red-bright transition-opacity hover:opacity-70"
                >
                  {location.phone}
                </a>

                <dl className="mt-7 max-w-sm space-y-2 border-t border-ink/12 pt-5">
                  {location.hours.map((entry) => (
                    <div key={entry.days} className="flex justify-between gap-6">
                      <dt className="text-ink/58">{entry.days}</dt>
                      <dd className="font-semibold tabular-nums">{entry.time}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 max-w-md text-[0.92rem] leading-relaxed text-ink/60">
                  {location.note}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="/order" size="md">
                    Order from here
                  </ButtonLink>
                  <a
                    className="press inline-flex h-12 items-center justify-center rounded-full border-2 border-ink px-6 text-[0.78rem] font-bold uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-cream"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      location.mapsQuery,
                    )}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Open in maps
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
