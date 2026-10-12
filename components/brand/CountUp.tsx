"use client";

import { useEffect, useRef, useState } from "react";
import { easeOutCubic } from "@/lib/geometry";
import { money } from "@/lib/format";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

/** A dollar figure that rolls up to its new value instead of snapping. */
export function CountUp({
  value,
  className = "",
  duration = 520,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    if (from === value) return;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(from + (value - from) * easeOutCubic(t));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration, reduced]);

  return (
    <span className={className} aria-live="polite">
      {money(display)}
    </span>
  );
}
