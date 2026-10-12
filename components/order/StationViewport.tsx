"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";

/**
 * The frame the station is watched through.
 *
 * Everything here sits between the viewer and the SVG scene — grain, haze,
 * bloom, vignette and the corner tally — so the picker reads as a live feed
 * off a camera bolted above the bench rather than as an illustration.
 */
export function StationViewport({
  children,
  label = "Station 01 · Adelaide CBD",
  live = true,
  className = "",
}: {
  children: ReactNode;
  label?: string;
  /** Shows the corner tally. It says "Live preview", not "Live": this is a
   *  simulation of the station, not a camera in the shop. */
  live?: boolean;
  className?: string;
}) {
  return (
    <div
      data-station-viewport=""
      className={`relative isolate overflow-hidden rounded-[28px] bg-[#1A0708] ring-1 ring-cream/12 ${className}`}
    >
      {/* The room behind the bench, thrown well out of focus.
          BrandImage sets its own `relative`, so the positioning has to live on
          a wrapper rather than fight it in the class list. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-14%] -z-10 block"
      >
        <BrandImage
          src={BRAND_IMAGES.ingredientLine}
          alt=""
          className="h-full w-full"
          imgClassName="scale-125 blur-[26px] brightness-[0.42] saturate-[1.15]"
          fallbackTone="deep"
        />
      </span>

      <div className="relative aspect-square w-full">{children}</div>

      {/* Warm haze rolling through the shot. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      >
        <span
          className="lens-haze"
          style={{
            left: "-8%",
            top: "6%",
            width: "56%",
            height: "44%",
            background:
              "radial-gradient(circle, rgba(255,182,110,0.22), rgba(255,154,61,0) 70%)",
          }}
        />
        <span
          className="lens-haze"
          style={{
            right: "-10%",
            bottom: "2%",
            width: "62%",
            height: "48%",
            background:
              "radial-gradient(circle, rgba(255,106,50,0.18), rgba(240,58,46,0) 72%)",
            animationDelay: "-7s",
            animationDuration: "24s",
          }}
        />
      </div>

      {/* Lens vignette and a soft top light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(118% 92% at 50% 8%, rgba(255,196,128,0.14), rgba(0,0,0,0) 46%), radial-gradient(96% 96% at 50% 50%, rgba(0,0,0,0) 60%, rgba(12,4,5,0.38) 88%, rgba(8,3,3,0.62) 100%)",
        }}
      />

      {/* Auto-exposure hunting, very slightly. */}
      <div
        aria-hidden="true"
        className="exposure pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(70%_70%_at_50%_46%,rgba(255,170,90,0.16),transparent_70%)]"
      />

      {/* Sensor grain, two sizes so it never reads as a fixed pattern. */}
      <div aria-hidden="true" className="film-grain z-30" />
      <div aria-hidden="true" className="film-grain film-grain--coarse z-30" />

      {/* Corner tally. */}
      {live ? (
        <div className="pointer-events-none absolute inset-x-4 top-4 z-40 flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/55 px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-cream/85 backdrop-blur-sm">
            <span className="rec-dot h-1.5 w-1.5 rounded-full bg-red-glow" />
            Live preview
          </span>
          <span className="rounded-full bg-ink/45 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cream/55 backdrop-blur-sm">
            {label}
          </span>
        </div>
      ) : null}

      {live ? <Timecode /> : null}
    </div>
  );
}

/** A quiet running timecode in the corner, like any kitchen camera. */
function Timecode() {
  const reduced = usePrefersReducedMotion();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const hh = String(Math.floor(seconds / 3600) + 18).padStart(2, "0");
  const mm = String(Math.floor(seconds / 60) % 60).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-4 right-4 z-40 rounded-full bg-ink/45 px-3 py-1.5 font-mono text-[0.62rem] tracking-[0.1em] text-cream/45 tabular-nums backdrop-blur-sm"
    >
      {hh}:{mm}:{ss}
    </span>
  );
}
