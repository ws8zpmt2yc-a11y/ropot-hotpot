import type { Metadata } from "next";
import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { ButtonLink } from "@/components/brand/Button";
import { Eyebrow } from "@/components/brand/Bits";
import { Logo } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why a hotpot restaurant put two robotic arms on the ingredient station — and why the cooking is still done by people.",
};

export default function AboutPage() {
  return (
    <div className="pt-[var(--nav-h)]">
      <section className="dark-surface grain warm-vignette text-cream">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,38%)]">
          <div>
            <Eyebrow className="text-amber">About</Eyebrow>
            <h1 className="display-xl mt-5 uppercase">
              Good food.
              <br />
              Cuter robots.
            </h1>
            <p className="lede mt-7 max-w-lg text-cream/78">
              RoPot started with a problem every hotpot place has: the
              ingredient station is the slowest part of the night, and the part
              customers most want to look at. So we handed the reaching to two
              robotic arms and pointed a camera at it.
            </p>
          </div>

          {/* The poster, hung on the wall. */}
          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="rounded-[12px] bg-[#1B1512] p-2.5 shadow-[0_44px_100px_-40px_rgba(0,0,0,1)] ring-1 ring-cream/12">
              <BrandImage
                src={BRAND_IMAGES.poster}
                alt="RoPot Hotpot poster"
                className="aspect-[3/4] w-full"
                imgClassName="object-contain"
                fallbackTone="red"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-warm-white py-16 text-ink sm:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)] lg:gap-16">
          <div className="max-w-2xl space-y-6 text-[1.05rem] leading-relaxed text-ink/72">
            <h2 className="display-lg uppercase text-ink">
              Almost everyone here
              <br />
              is a robot.
            </h2>
            <p>
              The servers are robots. They bring trays out, clear plates and
              keep track of which pot belongs to which table — which turns out
              to be the thing humans get wrong most often on a Friday night.
            </p>
            <p>
              The ingredient station is run by two collaborative arms. When you
              order, the nearest free arm turns, reaches into the tray you
              picked, closes its gripper on exactly one portion and drops it
              into your bowl. About a second and a half, every time, whether
              it&rsquo;s six o&rsquo;clock or the middle of the rush.
            </p>
            <p>
              Two jobs are not automated and won&rsquo;t be. The kitchen is a
              team of people: broths simmered overnight, dumplings pleated by
              hand, every bit of knife work done by someone who has done it a
              thousand times. And there is always a manager on the floor,
              because when something has gone wrong you want a person, not a
              status light.
            </p>
            <p className="font-display text-2xl font-semibold uppercase leading-tight text-red-brand">
              Robots on the floor. People on the wok.
            </p>
            <p>
              We think that&rsquo;s the honest version of a robot restaurant.
              The machines do the repetitive, precise, boring part. The cooking
              — the part that actually decides whether dinner was any good —
              stays with the cooks.
            </p>
          </div>

          <aside>
            <BrandImage
              src={BRAND_IMAGES.robotServer}
              alt="A RoPot service robot carrying ingredient trays through the dining room"
              className="aspect-[3/4] w-full overflow-hidden rounded-[28px]"
              fallbackTone="red"
            />
            <div className="mt-6 rounded-3xl bg-cream p-6 ring-1 ring-ink/8">
              <Logo className="h-14 text-red-brand" />
              <p className="mt-4 text-[0.92rem] leading-relaxed text-ink/65">
                142 Gouger Street, Adelaide, and 88 The Parade, Norwood. Open
                seven days at the CBD shop, six at Norwood.
              </p>
              <ButtonLink href="/order" size="md" className="mt-5 w-full">
                Build a bowl
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
