import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { Eyebrow } from "@/components/brand/Bits";
import { ButtonLink } from "@/components/brand/Button";

const CREW = [
  {
    who: "The servers",
    what: "Robot",
    body: "They carry trays to your table, clear plates and never forget which pot was yours. Say hello — they like it.",
  },
  {
    who: "The picking arms",
    what: "Robot",
    body: "Two collaborative arms on the ingredient station. They select and portion, precisely, the second you order.",
  },
  {
    who: "The kitchen",
    what: "Human",
    body: "Broths, dumplings, knife work, seasoning. Every bit of cooking is done by people out the back.",
  },
  {
    who: "The manager",
    what: "Human",
    body: "Runs the floor, sorts your booking, and is the one to talk to when something isn't right.",
  },
];

export function MeetRoPot() {
  return (
    <section className="bg-warm-white py-16 text-ink sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)] lg:gap-16">
          {/* The badge hangs off the picture, so it is positioned against a
              wrapper that is exactly the picture's height — not against the
              grid column, which stretches to match the taller text beside it. */}
          <div className="relative self-start">
            <BrandImage
              src={BRAND_IMAGES.food}
              alt="A bubbling pot of Sichuan hotpot, marbled beef lifted on chopsticks"
              className="aspect-[4/3] w-full overflow-hidden rounded-[28px]"
              fallbackTone="red"
            />
            <span className="absolute -right-3 bottom-6 rotate-[-4deg] rounded-2xl bg-ink px-5 py-4 text-cream shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:-right-6">
              <span className="block font-display text-2xl font-semibold uppercase leading-none">
                Good food.
              </span>
              <span className="block font-display text-2xl font-semibold uppercase leading-none text-amber">
                Cuter robots.
              </span>
            </span>
          </div>

          <div>
            <Eyebrow className="text-red-brand">Meet RoPot</Eyebrow>
            <h2 className="display-lg mt-4 uppercase">
              Robots on the floor.
              <br />
              People on the wok.
            </h2>
            <p className="lede mt-6 max-w-lg text-ink/70">
              Almost everyone you meet at RoPot is a robot. The servers bring
              your trays, and two arms on the ingredient station pick every
              portion the moment you order it. It makes the whole thing quicker,
              more precise and — we&rsquo;ll admit it — more fun to watch.
            </p>
            <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-ink/60">
              What the robots don&rsquo;t do is cook. The broths, the dumplings
              and every bit of knife work belong to the kitchen team out the
              back, and there&rsquo;s a manager on the floor for anything that
              needs a person.
            </p>

            <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {CREW.map((member) => (
                <div key={member.who} className="border-t-2 border-ink/12 pt-4">
                  <dt className="flex items-baseline gap-2.5">
                    <span className="font-display text-xl font-semibold uppercase leading-none">
                      {member.who}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] ${
                        member.what === "Robot"
                          ? "bg-red-bright text-cream"
                          : "bg-ink text-cream"
                      }`}
                    >
                      {member.what}
                    </span>
                  </dt>
                  <dd className="mt-2 text-[0.9rem] leading-relaxed text-ink/62">
                    {member.body}
                  </dd>
                </div>
              ))}
            </dl>

            <ButtonLink href="/about" variant="ink" size="lg" className="mt-10">
              More about RoPot
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
