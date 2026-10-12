import type { Metadata } from "next";
import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { ButtonLink } from "@/components/brand/Button";
import { Eyebrow } from "@/components/brand/Bits";
import { RobotMark } from "@/components/brand/RobotMark";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Two collaborative arms select and portion your ingredients. Here's exactly what happens between your order and your box.",
};

const SEQUENCE = [
  {
    step: "01",
    title: "You place the order",
    body: "Online or at the counter. Broth, spice, then every ingredient you want. Your list goes straight to the station.",
  },
  {
    step: "02",
    title: "The nearest arm turns",
    body: "Whichever of the two arms is free and closest takes the job. If you order quickly, they alternate and share the queue.",
  },
  {
    step: "03",
    title: "It grips one portion",
    body: "The gripper lowers into the tray, closes on a single serve and lifts. The trays are weighed, so the portion is the portion.",
  },
  {
    step: "04",
    title: "It swings to the bowl",
    body: "Over the pot, jaws open, in it goes. About one and a half seconds a portion, twenty-four trays to choose from.",
  },
  {
    step: "05",
    title: "The kitchen finishes it",
    body: "A cook ladles the broth, seals it separately, adds your sauce and rice, and boxes the lot. That part is entirely human.",
  },
];

const FACTS = [
  {
    title: "What the arms do",
    body: "Select and portion raw ingredients from the station into your bowl. That's the whole job.",
  },
  {
    title: "What the arms don't do",
    body: "Cook. Season. Taste. Decide anything. No robot at RoPot has ever touched a wok.",
  },
  {
    title: "Who's in the room",
    body: "Service robots on the floor, a kitchen team out the back, and a manager who'll sort out anything that's gone sideways.",
  },
  {
    title: "If something's wrong",
    body: "Tell the manager. The arms are precise but they can't tell that you wanted the beef on the side.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-[var(--nav-h)]">
      <section className="dark-surface relative isolate grain overflow-hidden bg-[#3A0D0F] text-cream">
        <BrandImage
          src={BRAND_IMAGES.ingredientLine}
          alt="The RoPot ingredient line"
          className="absolute inset-0 -z-10 h-full w-full"
          fallbackTone="red"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(42,10,11,0.82)_0%,rgba(42,10,11,0.6)_40%,rgba(58,13,15,0.97)_100%)]" />

        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
          <Eyebrow className="text-amber">How RoPot works</Eyebrow>
          <h1 className="display-xl mt-5 max-w-4xl uppercase">
            You choose.
            <br />
            They pick.
            <br />
            You enjoy.
          </h1>
          <p className="lede mt-7 max-w-lg text-cream/75">
            The gimmick is real and it&rsquo;s narrow: two arms, one job. Here
            is exactly what happens between your order and your box.
          </p>
        </div>
      </section>

      <section className="bg-warm-white py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <ol className="grid gap-px overflow-hidden rounded-3xl bg-ink/10 md:grid-cols-2 xl:grid-cols-5">
            {SEQUENCE.map((item) => (
              <li key={item.step} className="bg-warm-white p-7">
                <span className="font-display text-4xl font-semibold leading-none text-red-bright">
                  {item.step}
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold uppercase leading-tight">
                  {item.title}
                </h2>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink/62">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="dark-surface grain bg-ink py-16 text-cream sm:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] lg:gap-16">
          <div>
            <BrandImage
              src={BRAND_IMAGES.robotServer}
              alt="A RoPot service robot carrying ingredient trays"
              className="aspect-[3/4] w-full overflow-hidden rounded-[28px]"
              fallbackTone="red"
            />
          </div>
          <div>
            <Eyebrow className="text-amber">Straight answers</Eyebrow>
            <h2 className="display-lg mt-4 uppercase">
              Where the robots
              <br />
              stop.
            </h2>
            <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {FACTS.map((fact) => (
                <div key={fact.title} className="border-t border-cream/15 pt-5">
                  <dt className="flex items-center gap-2.5 font-display text-xl font-semibold uppercase leading-none">
                    <RobotMark
                      className="h-5 w-5 shrink-0 text-amber"
                      withChopsticks={false}
                    />
                    {fact.title}
                  </dt>
                  <dd className="mt-2.5 text-[0.92rem] leading-relaxed text-cream/65">
                    {fact.body}
                  </dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="/order" variant="cream" size="lg" className="mt-11">
              Try it yourself
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
