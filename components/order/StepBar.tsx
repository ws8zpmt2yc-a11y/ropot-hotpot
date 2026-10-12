"use client";

import type { OrderStep } from "@/types/order";

const STEPS: { id: OrderStep; label: string }[] = [
  { id: "broth", label: "Broth" },
  { id: "spice", label: "Spice" },
  { id: "pick", label: "Ingredients" },
  { id: "review", label: "Review" },
  { id: "details", label: "Pickup" },
];

export function StepBar({
  current,
  onJump,
  reachable,
}: {
  current: OrderStep;
  onJump: (step: OrderStep) => void;
  reachable: (step: OrderStep) => boolean;
}) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <nav aria-label="Order steps" className="w-full">
      <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto">
        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const enabled = reachable(step.id);
          return (
            <li key={step.id} className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => enabled && onJump(step.id)}
                disabled={!enabled}
                aria-current={active ? "step" : undefined}
                className={`press inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.72rem] font-bold uppercase tracking-[0.11em] transition-colors disabled:cursor-not-allowed ${
                  active
                    ? "bg-cream text-red-brand"
                    : done
                      ? "text-cream/85 hover:bg-cream/12"
                      : "text-cream/40"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.64rem] ${
                    active
                      ? "bg-red-brand text-cream"
                      : done
                        ? "bg-jade text-warm-white"
                        : "bg-cream/15 text-cream/60"
                  }`}
                >
                  {done ? (
                    <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true">
                      <path
                        d="M5 12.5l4.5 4.5L19 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                {step.label}
              </button>
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`mx-1 h-px w-4 sm:w-7 ${
                    done ? "bg-jade" : "bg-cream/20"
                  }`}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
