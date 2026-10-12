"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { matchIngredientPhrase } from "@/data/ingredients";

/** Minimal shape of the Web Speech API we actually use. */
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const NUMBER_WORDS: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  double: 2,
  triple: 3,
};

/** "add two portions of enoki" -> { ingredientId: "enoki", quantity: 2 } */
export function parseVoiceCommand(
  transcript: string,
): { ingredientId: string; quantity: number; name: string } | null {
  const ingredient = matchIngredientPhrase(transcript);
  if (!ingredient) return null;

  const words = transcript.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  let quantity = 1;
  for (const word of words) {
    if (/^\d+$/.test(word)) {
      quantity = Math.min(5, Math.max(1, Number(word)));
      break;
    }
    if (word in NUMBER_WORDS) {
      quantity = NUMBER_WORDS[word];
      break;
    }
  }

  return { ingredientId: ingredient.id, quantity, name: ingredient.name };
}

export interface VoiceApi {
  supported: boolean;
  listening: boolean;
  transcript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
}

export function useVoice(
  onCommand: (ingredientId: string, quantity: number, name: string) => void,
): VoiceApi {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const commandRef = useRef(onCommand);

  useEffect(() => {
    commandRef.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    const globalWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor =
      globalWindow.SpeechRecognition ?? globalWindow.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new Ctor();
    recognition.lang = "en-AU";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
      const parsed = parseVoiceCommand(text);
      if (parsed) {
        commandRef.current(parsed.ingredientId, parsed.quantity, parsed.name);
        setError(null);
        recognition.stop();
      }
    };

    recognition.onerror = (event) => {
      setError(
        event.error === "not-allowed"
          ? "Microphone access was blocked. You can still tap any tray."
          : "Didn't catch that. Try \"add two portions of enoki\".",
      );
      setListening(false);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
    };
  }, []);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setTranscript("");
    setError(null);
    try {
      recognition.start();
      setListening(true);
    } catch {
      // Chrome throws if start() is called while already running.
      setListening(true);
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, transcript, error, start, stop };
}
