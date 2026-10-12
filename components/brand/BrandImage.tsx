"use client";

import { useEffect, useRef, useState } from "react";
import { RobotMark } from "./RobotMark";

/**
 * Renders a brand photograph, falling back to an on-brand panel if the file
 * hasn't been dropped into /public/images/ropot yet. The moment the real file
 * exists at that path it takes over — nothing else needs to change.
 */
export interface BrandImageProps {
  /** Omit it and the fallback panel renders without any network request. */
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Shown in the fallback panel so an empty slot still reads as intentional. */
  fallbackLabel?: string;
  fallbackTone?: "red" | "deep" | "cream" | "ink";
  priority?: boolean;
  sizes?: string;
}

const TONES = {
  red: {
    panel:
      "bg-[linear-gradient(150deg,#D62424_0%,#B51618_46%,#8E0F12_100%)] text-cream",
    mark: "text-cream/22",
    rule: "bg-cream/25",
  },
  deep: {
    panel:
      "bg-[linear-gradient(150deg,#8E0F12_0%,#5E0A0C_60%,#2A0708_100%)] text-cream",
    mark: "text-cream/18",
    rule: "bg-cream/20",
  },
  cream: {
    panel:
      "bg-[linear-gradient(150deg,#FFF9F2_0%,#FFF1DE_55%,#F3DFC4_100%)] text-red-brand",
    mark: "text-red-brand/16",
    rule: "bg-red-brand/20",
  },
  ink: {
    panel:
      "bg-[linear-gradient(150deg,#2A2222_0%,#171313_60%,#0B0909_100%)] text-cream",
    mark: "text-amber/22",
    rule: "bg-amber/25",
  },
} as const;

/** Try the given path first, then the other common extensions. */
function candidatesFor(src: string | undefined): string[] {
  if (!src) return [];
  const match = src.match(/^(.*)\.(png|jpg|jpeg|webp|avif)$/i);
  if (!match) return [src];
  const [, stem] = match;
  const rest = ["png", "jpg", "jpeg", "webp"]
    .map((ext) => `${stem}.${ext}`)
    .filter((candidate) => candidate.toLowerCase() !== src.toLowerCase());
  return [src, ...rest];
}

export function BrandImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  fallbackLabel,
  fallbackTone = "red",
  priority = false,
  sizes,
}: BrandImageProps) {
  const candidates = candidatesFor(src);
  const [attempt, setAttempt] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const tone = TONES[fallbackTone];
  const failed = attempt >= candidates.length;
  const current = candidates[Math.min(attempt, candidates.length - 1)];

  // The <img> is server-rendered, so a missing file can 404 before React has
  // attached onError. Re-check once on mount.
  useEffect(() => {
    setAttempt(0);
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setAttempt((value) => value + 1);
    }
  }, [current]);

  if (failed) {
    return (
      <div
        className={`relative grain overflow-hidden ${tone.panel} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <RobotMark
            className={`h-[42%] w-[42%] ${tone.mark}`}
            withChopsticks={false}
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-5 sm:p-7">
          <span className={`h-px w-10 ${tone.rule}`} />
          <span className="eyebrow opacity-70">
            {fallbackLabel ?? "RoPot Hotpot"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-red-deep ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        key={current}
        src={current}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={() => setAttempt((value) => value + 1)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
