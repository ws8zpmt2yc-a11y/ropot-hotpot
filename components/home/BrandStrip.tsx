import { RobotMark } from "@/components/brand/RobotMark";

const PHRASES = [
  "Good food. Cuter robots.",
  "Hot pot with a helping hand.",
  "Fresh ingredients. Faster hands.",
  "You choose. They pick.",
];

/** Scrolling brand strip, straight off the restaurant wall. */
export function BrandStrip() {
  const row = [...PHRASES, ...PHRASES];
  return (
    <section
      aria-label="RoPot Hotpot"
      className="dark-surface overflow-hidden border-y border-cream/12 bg-red-bright py-4 text-cream"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
            {row.map((phrase, index) => (
              <span key={`${copy}-${index}`} className="flex items-center gap-8">
                <span className="font-display text-xl font-semibold uppercase tracking-[0.02em] sm:text-2xl">
                  {phrase}
                </span>
                <RobotMark className="h-6 w-6 shrink-0 text-cream/60" withChopsticks={false} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
