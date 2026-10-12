import { asset } from "@/lib/asset";
import Link from "next/link";

/**
 * The RoPot Hotpot wordmark.
 *
 * This is the approved artwork itself, lifted from the poster and stored as an
 * alpha mask, so it is the real lettering rather than a typeset imitation.
 * Because it is painted with `currentColor` through a CSS mask, it takes the
 * colour of whatever it sits on — cream on the red header, red on cream.
 *
 * Size it with a height class: <Logo className="h-11 text-cream" />
 */
const WORDMARK = asset("/images/ropot/wordmark.png");
const RATIO = "871 / 439";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="RoPot Hotpot"
      className={`block shrink-0 ${className}`}
      style={{
        aspectRatio: RATIO,
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${WORDMARK})`,
        maskImage: `url(${WORDMARK})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function LogoLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className="press inline-flex items-center rounded-lg"
      aria-label="RoPot Hotpot — home"
    >
      <Logo className={className} />
    </Link>
  );
}
