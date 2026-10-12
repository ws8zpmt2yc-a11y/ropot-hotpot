"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandImage } from "@/components/brand/BrandImage";
import { BRAND_IMAGES } from "@/data/brand-images";
import { Button, ButtonLink } from "@/components/brand/Button";
import { RobotMark } from "@/components/brand/RobotMark";
import { useOrder } from "@/hooks/useOrder";
import { LOCATIONS, PICKUP_SLOTS } from "@/data/locations";
import { getBroth } from "@/data/broths";
import { getSpice } from "@/data/spice";
import { money } from "@/lib/format";

const FIELD =
  "h-13 w-full rounded-2xl border-2 border-cream/15 bg-cream/6 px-4 py-3.5 text-cream placeholder:text-cream/35 focus:border-amber focus:outline-none";

export function CheckoutPanel({ onBack }: { onBack: () => void }) {
  const { state, setDetails, placeOrder, subtotal, itemCount, prepMinutes, reset } =
    useOrder();
  const [touched, setTouched] = useState(false);

  const location = LOCATIONS.find((item) => item.id === state.details.locationId);
  const broth = getBroth(state.brothId);
  const spice = getSpice(state.spiceId);

  const nameOk = state.details.name.trim().length >= 2;
  const mobileOk = state.details.mobile.replace(/\D/g, "").length >= 8;
  const valid = nameOk && mobileOk;

  if (state.placed) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-jade text-warm-white">
          <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="display-lg mt-7 uppercase">Order in.</h2>
        <p className="lede mx-auto mt-4 max-w-lg text-cream/70">
          Reference <strong className="text-amber">{state.orderRef}</strong>.
          The arms have your list, the kitchen has the pot. Ready in about{" "}
          {prepMinutes} minutes at {location?.name ?? "our counter"}.
        </p>

        <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-3xl ring-1 ring-cream/12">
          <BrandImage
            src={BRAND_IMAGES.takeaway}
            alt="RoPot Hotpot takeaway boxes ready for collection"
            className="aspect-[4/3] w-full"
            fallbackLabel="Your hotpot. Ready to roll."
            fallbackTone="red"
          />
        </div>

        <p className="mt-8 font-display text-2xl font-semibold uppercase">
          Your hotpot. Ready to roll.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="cream" size="lg">
            Back to home
          </ButtonLink>
          <Button variant="outline" size="lg" className="text-cream" onClick={reset}>
            Start another bowl
          </Button>
        </div>

        <p className="mt-8 text-[0.8rem] text-cream/40">
          This is a demonstration checkout — no payment has been taken and no
          order has been sent to a kitchen.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="max-w-2xl">
        <h2 className="display-lg uppercase">Takeaway details</h2>
        <p className="lede mt-3 text-cream/70">
          Tell us where and when. We start the pot when you arrive so nothing
          sits around going soft.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form
          className="space-y-7"
          onSubmit={(event) => {
            event.preventDefault();
            setTouched(true);
            if (valid) placeOrder();
          }}
        >
          <fieldset>
            <legend className="eyebrow text-cream/55">Pick up from</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {LOCATIONS.map((item) => {
                const selected = state.details.locationId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDetails({ locationId: item.id })}
                    aria-pressed={selected}
                    className={`press rounded-2xl p-5 text-left ring-1 transition-colors ${
                      selected
                        ? "bg-cream text-red-brand ring-2 ring-amber"
                        : "bg-cream/6 text-cream ring-cream/12 hover:bg-cream/12"
                    }`}
                  >
                    <span className="block font-display text-xl font-semibold">
                      {item.name.replace("RoPot ", "")}
                    </span>
                    <span
                      className={`mt-1 block text-[0.84rem] ${
                        selected ? "text-red-brand/70" : "text-cream/60"
                      }`}
                    >
                      {item.address}, {item.suburb}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow text-cream/55">Pick up when</legend>
            <div className="no-scrollbar mt-3 flex flex-wrap gap-2">
              {PICKUP_SLOTS.map((slot) => {
                const selected = state.details.time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setDetails({ time: slot })}
                    aria-pressed={selected}
                    className={`press rounded-full px-4 py-2.5 text-[0.78rem] font-bold transition-colors ${
                      selected
                        ? "bg-amber text-ink"
                        : "bg-cream/8 text-cream/75 hover:bg-cream/16"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow text-cream/55">Name</span>
              <input
                className={`${FIELD} mt-2.5`}
                value={state.details.name}
                onChange={(event) => setDetails({ name: event.target.value })}
                placeholder="Who's picking it up?"
                autoComplete="name"
                required
              />
              {touched && !nameOk ? (
                <span className="mt-1.5 block text-[0.78rem] text-amber-soft">
                  We need a name for the counter.
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="eyebrow text-cream/55">Mobile</span>
              <input
                className={`${FIELD} mt-2.5`}
                value={state.details.mobile}
                onChange={(event) => setDetails({ mobile: event.target.value })}
                placeholder="04XX XXX XXX"
                inputMode="tel"
                autoComplete="tel"
                required
              />
              {touched && !mobileOk ? (
                <span className="mt-1.5 block text-[0.78rem] text-amber-soft">
                  We text you when the bowl is boxed.
                </span>
              ) : null}
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-cream"
              onClick={onBack}
            >
              Back to the bowl
            </Button>
            <Button type="submit" size="lg" variant="cream" disabled={itemCount === 0}>
              Place order · {money(subtotal)}
            </Button>
          </div>

          <p className="text-[0.78rem] text-cream/40">
            Demonstration checkout. No card details are collected and no payment
            is processed.
          </p>
        </form>

        <aside>
          <div className="overflow-hidden rounded-3xl ring-1 ring-cream/12">
            <BrandImage
              src={BRAND_IMAGES.takeaway}
              alt="RoPot Hotpot takeaway packaging"
              className="aspect-[4/3] w-full"
              fallbackLabel="Built your way. Boxed for home."
              fallbackTone="red"
            />
          </div>

          <div className="mt-5 rounded-3xl bg-cream/6 p-6 ring-1 ring-cream/10">
            <div className="flex items-center gap-3">
              <RobotMark className="h-8 w-8 text-amber" withChopsticks={false} />
              <h3 className="font-display text-xl font-semibold uppercase">
                Built your way. Boxed for home.
              </h3>
            </div>
            <ul className="mt-4 space-y-2 text-[0.88rem] text-cream/65">
              <li>
                <strong className="text-cream">{broth?.name ?? "Broth"}</strong>
                {spice ? ` · ${spice.name} spice` : ""}
              </li>
              <li>
                {itemCount} {itemCount === 1 ? "portion" : "portions"} picked by
                the arms
              </li>
              <li>Ready about {prepMinutes} minutes after ordering</li>
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t border-cream/15 pt-4">
              <span className="eyebrow text-cream/55">Total</span>
              <span className="font-display text-3xl font-semibold tabular-nums">
                {money(subtotal)}
              </span>
            </div>
            <p className="mt-4 text-[0.78rem] text-cream/45">
              Questions about the bowl?{" "}
              <Link href="/locations" className="text-amber underline underline-offset-2">
                Call the shop
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
