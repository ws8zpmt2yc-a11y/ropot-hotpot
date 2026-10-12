import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { ButtonLink } from "@/components/brand/Button";
import { Logo } from "@/components/brand/Logo";
import { RobotMark } from "@/components/brand/RobotMark";

export function Hero() {
  return (
    <section className="dark-surface relative grain overflow-hidden warm-vignette text-cream">
      <div className="relative mx-auto grid min-h-[92vh] max-w-[1500px] items-center gap-10 px-5 pb-16 pt-[calc(var(--nav-h)+40px)] sm:px-8 lg:min-h-[88vh] lg:grid-cols-[minmax(0,1fr)_minmax(0,50%)] lg:gap-14 lg:pb-24">
        <div className="relative z-10">
          <Logo className="h-[clamp(5.5rem,13vw,10.5rem)] text-cream" />

          <p className="display-md mt-7 max-w-lg uppercase text-cream/95">
            Hot pot with a helping hand.
          </p>

          <p className="lede mt-6 max-w-md text-cream/72">
            Choose your ingredients. Watch RoPot pick them. Take your perfect
            hotpot home.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/order" variant="cream" size="lg">
              Build your bowl
            </ButtonLink>
            <ButtonLink
              href="/how-it-works"
              variant="outline"
              size="lg"
              className="text-cream"
            >
              How RoPot works
            </ButtonLink>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-cream/15 pt-7">
            {[
              { value: "24", label: "ingredients on the ring" },
              { value: "2", label: "picking arms" },
              { value: "5", label: "broths, all made in-house" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-4xl font-semibold leading-none">
                  {stat.value}
                </dt>
                <dd className="mt-1.5 max-w-[7.5rem] text-[0.78rem] uppercase leading-snug tracking-[0.1em] text-cream/50">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The food comes first. The robots are the second thing you notice. */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[32px] shadow-[0_50px_120px_-50px_rgba(0,0,0,0.95)] ring-1 ring-cream/15 lg:-mr-8 lg:rounded-[40px]">
            <BrandImage
              src={BRAND_IMAGES.robotServer}
              alt="A RoPot service robot carrying trays of hotpot ingredients through the dining room"
              // Portrait at every width: the robot photo is portrait, and a
              // landscape box at tablet size would crop its head off.
              className="aspect-[4/5] w-full"
              fallbackTone="deep"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(200deg,transparent_50%,rgba(23,19,19,0.5)_100%)]" />
          </div>

          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-full bg-cream py-3 pl-3 pr-6 text-red-brand shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)] sm:left-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-bright">
              <RobotMark className="h-6 w-6 text-cream" withChopsticks={false} />
            </span>
            <span className="text-[0.74rem] font-extrabold uppercase leading-tight tracking-[0.12em]">
              Good food.
              <br />
              Cuter robots.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
