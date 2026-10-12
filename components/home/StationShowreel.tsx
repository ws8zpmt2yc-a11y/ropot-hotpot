"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StatusDot } from "@/components/brand/Bits";
import { ButtonLink } from "@/components/brand/Button";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useRobotQueue } from "@/hooks/useRobotQueue";
import { RobotStage } from "@/components/order/RobotStage";
import { StationViewport } from "@/components/order/StationViewport";
import type { OrderLine } from "@/types/order";

/**
 * The station on the home page. The arms sit idle until a visitor clicks a
 * dish — nothing moves on its own — and anything they pick goes into a demo
 * bowl without touching their real order.
 */
export function StationShowreel() {
  const reducedMotion = usePrefersReducedMotion();
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Only keep the arms powered while somebody can see them.
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  void onScreen;

  const handleDeliver = useCallback((ingredientId: string) => {
    setLines((previous) => {
      const existing = previous.find(
        (line) => line.ingredientId === ingredientId,
      );
      const next = existing
        ? previous.map((line) =>
            line.ingredientId === ingredientId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...previous, { ingredientId, quantity: 1 }];
      // Empty the demo bowl once it fills, so it never overflows.
      const total = next.reduce((sum, line) => sum + line.quantity, 0);
      return total > 9 ? [] : next;
    });
  }, []);

  const robots = useRobotQueue({
    onDeliver: handleDeliver,
    reducedMotion,
    speed: 0.92,
  });

  const request = robots.request;

  const quantityOf = useCallback(
    (id: string) =>
      lines.find((line) => line.ingredientId === id)?.quantity ?? 0,
    [lines],
  );

  const handleSelect = useCallback((id: string) => request(id), [request]);

  const busy = robots.statuses.find((status) => status.busy);

  return (
    <section className="dark-surface relative grain overflow-hidden bg-[#2A0A0B] py-16 text-cream sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,154,61,0.18),transparent_72%)]" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-5 sm:px-8 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        <div className="order-2 min-w-0 lg:order-1">
          <p className="eyebrow text-amber">Pick an ingredient. Watch what happens.</p>
          <h2 className="display-lg mt-4 uppercase">
            Your bowl.
            <br />
            Their hands.
          </h2>
          <p className="lede mt-5 max-w-md text-cream/70">
            Click any dish and the nearest arm turns, reaches, grips a portion
            and drops it in the pot — the same thing that happens on the bench
            at Gouger Street. Two arms, twenty-four trays, no waiting on
            anybody.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            {robots.statuses.map((status) => (
              <span
                key={status.id}
                className="inline-flex items-center gap-2.5 rounded-full bg-cream/8 py-2 pl-3 pr-4 text-[0.72rem] font-bold uppercase tracking-[0.1em] ring-1 ring-cream/10"
              >
                <StatusDot busy={status.busy} />
                <span className="text-cream/50">Robot {status.id}</span>
                <span className="text-cream/25">—</span>
                <span className={status.busy ? "text-amber" : "text-cream"}>
                  {status.message}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/order" variant="cream" size="lg">
              Build your bowl
            </ButtonLink>
            <ButtonLink
              href="/how-it-works"
              variant="outline"
              size="lg"
              className="text-cream"
            >
              How it works
            </ButtonLink>
          </div>

          <p className="mt-5 text-[0.8rem] text-cream/40">
            {busy
              ? "Demo bowl — nothing here is added to your order."
              : "Click a dish to send an arm. Demo bowl — your real order starts on Build your bowl."}
          </p>
        </div>

        <div ref={stageRef} className="order-1 min-w-0 lg:order-2">
          <StationViewport label="Station 01 · Simulation">
            <RobotStage
                lines={lines}
                brothId="spicy-sichuan"
                spiceLevel={2}
                quantityOf={quantityOf}
                hovered={hovered}
                inFlight={robots.inFlight}
                falling={robots.falling}
              ripples={robots.ripples}
                framesRef={robots.framesRef}
                subscribe={robots.subscribe}
                onHover={setHovered}
                onSelect={handleSelect}
                reducedMotion={reducedMotion}
              compact
            />
          </StationViewport>
        </div>
      </div>
    </section>
  );
}
