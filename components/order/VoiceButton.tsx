"use client";

import { useVoice } from "@/hooks/useVoice";

/**
 * "Tell RoPot" — speak an ingredient and the arms fetch it. Falls back to a
 * plain message where the browser has no speech recognition, and never blocks
 * the tap-a-tray path.
 */
export function VoiceButton({
  onCommand,
}: {
  onCommand: (ingredientId: string, quantity: number, name: string) => void;
}) {
  const voice = useVoice(onCommand);

  if (!voice.supported) {
    return (
      <div className="flex items-center gap-2.5 rounded-full bg-cream/8 px-4 py-2.5 text-[0.76rem] text-cream/60">
        <MicIcon className="h-4 w-4 shrink-0 opacity-60" />
        <span>
          Voice ordering needs Chrome or Safari — tap any tray instead.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => (voice.listening ? voice.stop() : voice.start())}
        aria-pressed={voice.listening}
        className={`press inline-flex h-11 items-center gap-2.5 rounded-full px-5 text-[0.74rem] font-bold uppercase tracking-[0.13em] transition-colors ${
          voice.listening
            ? "bg-amber text-ink"
            : "bg-cream/12 text-cream hover:bg-cream/20"
        }`}
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          <MicIcon className="h-4 w-4" />
          {voice.listening ? (
            <span className="absolute inset-[-6px] rounded-full border-2 border-current opacity-60" style={{ animation: "tray-ripple 1.2s ease-out infinite" }} />
          ) : null}
        </span>
        {voice.listening ? "Listening…" : "Tell RoPot"}
      </button>

      {voice.listening && voice.transcript ? (
        <p className="max-w-xs text-[0.78rem] italic text-cream/70">
          “{voice.transcript}”
        </p>
      ) : null}
      {voice.error ? (
        <p className="max-w-xs text-[0.76rem] text-amber-soft">{voice.error}</p>
      ) : null}
      {!voice.listening && !voice.error ? (
        <p className="max-w-xs text-[0.74rem] text-cream/45">
          Try “add two portions of enoki”.
        </p>
      ) : null}
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect
        x="9"
        y="2.5"
        width="6"
        height="11"
        rx="3"
        fill="currentColor"
      />
      <path
        d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
