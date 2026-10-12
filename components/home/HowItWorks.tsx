import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { Eyebrow } from "@/components/brand/Bits";

const STEPS = [
  {
    number: "1",
    title: "You choose",
    body: "Pick your broth, set the spice, then tap the ingredients you want from the ring. Twenty-four trays, no menu-reading.",
  },
  {
    number: "2",
    title: "They pick",
    body: "Two robotic arms turn, reach into the tray you chose and portion it straight into your bowl. You watch the whole thing happen.",
  },
  {
    number: "3",
    title: "You enjoy",
    body: "The kitchen ladles the broth, boxes it up and texts you. Collect, get home, cook it exactly how you like it.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-warm-white py-16 text-ink sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="max-w-4xl">
          <Eyebrow className="text-red-brand">How RoPot works</Eyebrow>
          <h2 className="display-lg mt-4 text-balance uppercase">
            Tell us what you want.
            <br />
            Our arms pick it fresh.
            <br />
            You cook it your way.
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,44%)] lg:items-stretch">
          <ol className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="relative border-t-2 border-ink/12 pt-5 lg:flex lg:gap-6 lg:border-t lg:pt-6"
              >
                <span className="font-display text-5xl font-semibold leading-none text-red-bright lg:w-14 lg:shrink-0">
                  {step.number}
                </span>
                <div className="mt-3 lg:mt-0">
                  <h3 className="font-display text-2xl font-semibold uppercase leading-none">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-ink/65">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="relative min-h-[460px]">
            <BrandImage
              src={BRAND_IMAGES.ingredientLine}
              alt="The RoPot ingredient line: trays of sliced beef, enoki, bok choy and tofu"
              className="aspect-[4/5] w-full overflow-hidden rounded-[28px] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
              fallbackTone="red"
            />
            <figcaption className="absolute bottom-5 left-5 right-5 rounded-2xl bg-ink/78 px-5 py-4 text-cream backdrop-blur-sm">
              <p className="font-display text-xl font-semibold uppercase leading-none">
                Fresh ingredients. Faster hands.
              </p>
              <p className="mt-1.5 text-[0.82rem] text-cream/70">
                Everything on the line is cut that morning. Nothing is portioned
                until you order it.
              </p>
            </figcaption>
          </figure>
        </div>

        <p className="mt-10 max-w-2xl border-l-2 border-red-bright pl-5 text-[0.95rem] leading-relaxed text-ink/60">
          To be clear about who does what: the arms select and portion
          ingredients, and our service robots run the floor. The cooking is done
          by people — a kitchen team out the back, and a manager who has never
          once been a robot.
        </p>
      </div>
    </section>
  );
}
