"use client";

import { useCallback, useEffect, useRef } from "react";
import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { useOrder } from "@/hooks/useOrder";
import type { OrderStep } from "@/types/order";
import { StepBar } from "./StepBar";
import { BrothSelector } from "./BrothSelector";
import { SpiceSelector } from "./SpiceSelector";
import { RobotPicker } from "./RobotPicker";
import { ReviewPanel } from "./ReviewPanel";
import { CheckoutPanel } from "./CheckoutPanel";

/**
 * Five steps: broth, spice, the arms, the bowl, then pickup. The order state
 * lives in context and is written to localStorage, so leaving the page and
 * coming back doesn't lose the bowl.
 */
export function OrderFlow() {
  const { state, setStep } = useOrder();
  const topRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef<OrderStep | null>(null);

  const goTo = useCallback(
    (step: OrderStep) => {
      setStep(step);
    },
    [setStep],
  );

  // Only jump back to the step bar when the step genuinely changes, never on
  // mount (React runs effects twice in development).
  useEffect(() => {
    if (previousStep.current !== null && previousStep.current !== state.step) {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    previousStep.current = state.step;
  }, [state.step]);

  const reachable = useCallback(
    (step: OrderStep) => {
      if (step === "broth") return true;
      if (step === "spice") return Boolean(state.brothId);
      if (step === "pick") return Boolean(state.brothId && state.spiceId);
      return Boolean(state.brothId && state.spiceId) && state.lines.length > 0;
    },
    [state.brothId, state.spiceId, state.lines.length],
  );

  return (
    <div className="dark-surface bg-[#3A0D0F] text-cream">
      {/* The ingredient line, straight into the picker. */}
      <section className="relative isolate">
        <BrandImage
          src={BRAND_IMAGES.ingredientLine}
          alt="The RoPot ingredient line, trays of meat, mushrooms and greens"
          className="h-[46vh] min-h-[320px] w-full sm:h-[54vh]"
          fallbackTone="red"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,10,11,0.75)_0%,rgba(42,10,11,0.35)_45%,rgba(58,13,15,0.98)_100%)]" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1400px] px-5 pb-10 sm:px-8 sm:pb-14">
            <p className="eyebrow text-amber">Fresh ingredients. Faster hands.</p>
            <h1 className="display-xl mt-4 uppercase">
              You choose.
              <br />
              They pick.
            </h1>
            <p className="lede mt-4 max-w-lg text-cream/75">
              Five steps: broth, spice, ingredients, a look at the bowl, then
              when you want it.
            </p>
          </div>
        </div>
      </section>

      {/* Step bar. */}
      <div
        ref={topRef}
        className="sticky top-[var(--nav-h)] z-30 border-y border-cream/10 bg-[#2A0A0B]/95 backdrop-blur-md"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-3 sm:px-8">
          <StepBar current={state.step} onJump={goTo} reachable={reachable} />
        </div>
      </div>

      {/* The step itself. */}
      {state.step === "pick" ? (
        <RobotPicker onReview={() => goTo("review")} />
      ) : (
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16">
          {state.step === "broth" ? (
            <BrothSelector onNext={() => goTo("spice")} />
          ) : null}
          {state.step === "spice" ? (
            <SpiceSelector
              onBack={() => goTo("broth")}
              onNext={() => goTo("pick")}
            />
          ) : null}
          {state.step === "review" ? (
            <ReviewPanel
              onBack={() => goTo("pick")}
              onNext={() => goTo("details")}
            />
          ) : null}
          {state.step === "details" ? (
            <CheckoutPanel onBack={() => goTo("review")} />
          ) : null}
        </div>
      )}
    </div>
  );
}
