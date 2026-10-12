"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SoundEvent = "servo" | "grip" | "release" | "drop" | "ui";

/**
 * Tiny synthesised sound kit for the picker — no audio files to load.
 * Muted by default, because browsers block autoplay and because nobody
 * asked for noise.
 */
export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      contextRef.current?.close().catch(() => undefined);
      contextRef.current = null;
    };
  }, []);

  const ensureContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!contextRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      const context = new Ctor();
      const master = context.createGain();
      master.gain.value = 0.16;
      master.connect(context.destination);
      contextRef.current = context;
      masterRef.current = master;
    }
    if (contextRef.current.state === "suspended") {
      void contextRef.current.resume();
    }
    return contextRef.current;
  }, []);

  const toggle = useCallback(() => {
    setEnabled((previous) => {
      const next = !previous;
      if (next) ensureContext();
      return next;
    });
  }, [ensureContext]);

  const play = useCallback(
    (event: SoundEvent) => {
      if (!enabled) return;
      const context = ensureContext();
      const master = masterRef.current;
      if (!context || !master) return;
      const now = context.currentTime;

      if (event === "servo") {
        // Soft motor whir.
        const osc = context.createOscillator();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 620;
        filter.Q.value = 6;
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(228, now + 0.34);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        osc.connect(filter).connect(gain).connect(master);
        osc.start(now);
        osc.stop(now + 0.45);
        return;
      }

      if (event === "grip" || event === "ui") {
        // Short mechanical click.
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(event === "grip" ? 940 : 1180, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.07, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain).connect(master);
        osc.start(now);
        osc.stop(now + 0.1);
        return;
      }

      if (event === "release") {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.09);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain).connect(master);
        osc.start(now);
        osc.stop(now + 0.14);
        return;
      }

      // "drop": a small wet plop into the broth.
      const buffer = context.createBuffer(
        1,
        Math.floor(context.sampleRate * 0.22),
        context.sampleRate,
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        const decay = Math.pow(1 - i / data.length, 3);
        data[i] = (Math.random() * 2 - 1) * decay * 0.5;
      }
      const source = context.createBufferSource();
      source.buffer = buffer;
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(260, now + 0.2);
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      source.connect(filter).connect(gain).connect(master);
      source.start(now);
    },
    [enabled, ensureContext],
  );

  return { enabled, toggle, play };
}
