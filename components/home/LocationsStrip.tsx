import { ButtonLink } from "@/components/brand/Button";
import { Eyebrow } from "@/components/brand/Bits";
import { LOCATIONS } from "@/data/locations";

export function LocationsStrip() {
  return (
    <section className="bg-cream py-16 text-ink sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="text-red-brand">Find us</Eyebrow>
            <h2 className="display-lg mt-4 uppercase">
              Two rooms.
              <br />
              Same arms.
            </h2>
          </div>
          <ButtonLink href="/locations" variant="ink" size="md">
            All locations
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {LOCATIONS.map((location) => (
            <article
              key={location.id}
              className="rounded-3xl bg-warm-white p-7 ring-1 ring-ink/8"
            >
              <h3 className="font-display text-3xl font-semibold uppercase leading-none">
                {location.name.replace("RoPot ", "")}
              </h3>
              <p className="mt-3 text-[0.95rem] text-ink/70">
                {location.address}
                <br />
                {location.suburb}
              </p>
              <a
                href={`tel:${location.phone.replace(/[^\d+]/g, "")}`}
                className="mt-2 inline-block font-bold text-red-bright transition-opacity hover:opacity-70"
              >
                {location.phone}
              </a>

              <dl className="mt-6 space-y-1.5 border-t border-ink/10 pt-5 text-[0.9rem]">
                {location.hours.map((entry) => (
                  <div key={entry.days} className="flex justify-between gap-4">
                    <dt className="text-ink/55">{entry.days}</dt>
                    <dd className="font-semibold tabular-nums">{entry.time}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-[0.86rem] leading-relaxed text-ink/55">
                {location.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
