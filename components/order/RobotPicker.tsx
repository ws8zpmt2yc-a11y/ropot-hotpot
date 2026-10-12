"use client";

import { useCallback, useState } from "react";
import { StatusDot } from "@/components/brand/Bits";
import { useOrder } from "@/hooks/useOrder";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useRobotQueue } from "@/hooks/useRobotQueue";
import { useSound } from "@/hooks/useSound";
import { getSpice } from "@/data/spice";
import { RobotStage } from "./RobotStage";
import { StationViewport } from "./StationViewport";
import { MobileIngredientRail } from "./MobileIngredientRail";
import { OrderSummaryPanel, OrderSummarySheet } from "./OrderSummary";
import { VoiceButton } from "./VoiceButton";

/**
 * The signature screen: pick an ingredient, an arm goes and gets it, the
 * bowl fills, the price moves.
 */
export function RobotPicker({ onReview }: { onReview: () => void }) {
  const { state, quantityOf, addIngredient } = useOrder();
  const reducedMotion = usePrefersReducedMotion();
  const sound = useSound();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleDeliver = useCallback(
    (ingredientId: string) => addIngredient(ingredientId),
    [addIngredient],
  );

  const robots = useRobotQueue({
    onDeliver: handleDeliver,
    onSound: (event) => sound.play(event),
    reducedMotion,
  });

  const handleSelect = useCallback(
    (ingredientId: string) => {
      sound.play("ui");
      robots.request(ingredientId);
    },
    [robots, sound],
  );

  const handleVoice = useCallback(
    (ingredientId: string, quantity: number) => {
      for (let index = 0; index < quantity; index += 1) {
        robots.request(ingredientId);
      }
    },
    [robots],
  );

  const spice = getSpice(state.spiceId);
  const liveMessage = robots.statuses.find((status) => status.busy)?.message;

  return (
    <section className="dark-surface relative grain overflow-hidden bg-[#2A0A0B] text-cream">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(255,154,61,0.16),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
        {/* ---- Header ---- */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="display-lg uppercase">Build your hotpot</h2>
            <p className="lede mt-3 max-w-md text-cream/70">
              Pick an ingredient. We&rsquo;ll handle the reaching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <VoiceButton onCommand={handleVoice} />
            <button
              type="button"
              onClick={sound.toggle}
              aria-pressed={sound.enabled}
              className="press inline-flex h-11 items-center gap-2 rounded-full bg-cream/12 px-4 text-[0.72rem] font-bold uppercase tracking-[0.13em] text-cream hover:bg-cream/20"
            >
              {sound.enabled ? <SpeakerOn /> : <SpeakerOff />}
              {sound.enabled ? "Sound on" : "Sound off"}
            </button>
          </div>
        </div>

        {/* ---- Robot status strip ---- */}
        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          {robots.statuses.map((status) => (
            <span
              key={status.id}
              className="inline-flex items-center gap-2.5 rounded-full bg-cream/8 py-2 pl-3 pr-4 text-[0.74rem] font-bold uppercase tracking-[0.1em] ring-1 ring-cream/10"
            >
              <StatusDot busy={status.busy} />
              <span className="text-cream/55">Robot {status.id}</span>
              <span className="text-cream/25">—</span>
              <span
                className={`transition-colors duration-200 ${
                  status.busy ? "text-amber" : "text-cream"
                }`}
              >
                {status.message}
              </span>
            </span>
          ))}

          {robots.queueLength > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-ink">
              {robots.queueLength} in the queue
            </span>
          ) : null}

          {reducedMotion ? (
            <span className="rounded-full bg-cream/8 px-4 py-2 text-[0.72rem] font-semibold text-cream/55">
              Reduced motion on — ingredients transfer without the full reach.
            </span>
          ) : null}
        </div>

        {/* Screen-reader commentary. */}
        <p className="sr-only" role="status" aria-live="polite">
          {liveMessage ?? "Robots ready."}
        </p>

        {/* ---- Stage + summary ---- */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <StationViewport label="Station 01 · Adelaide CBD">
              <RobotStage
                  lines={state.lines}
                  brothId={state.brothId}
                  spiceLevel={spice?.chillies ?? 1}
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
              />
            </StationViewport>

            <p className="mt-4 hidden text-[0.8rem] text-cream/45 lg:block">
              Tab through the trays and press Enter to send an arm. Clicking an
              ingredient you already have adds another portion.
            </p>

            <div className="mt-6 lg:hidden">
              <MobileIngredientRail
                quantityOf={quantityOf}
                inFlight={robots.inFlight}
                onSelect={handleSelect}
              />
            </div>
          </div>

          <OrderSummaryPanel onReview={onReview} />
        </div>
      </div>

      <div className="h-[88px] lg:hidden" />
      <OrderSummarySheet onReview={onReview} />
    </section>
  );
}

function SpeakerOn() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path
        d="M16.5 9.5l5 5M21.5 9.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
