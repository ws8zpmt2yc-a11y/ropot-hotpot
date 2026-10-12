"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ARMS,
  canReach,
  distance,
  easeInOutCubic,
  easeOutCubic,
  polarLerp,
  slotPosition,
  STAGE,
  type ArmConfig,
  type Point,
} from "@/lib/geometry";
import { getIngredient } from "@/data/ingredients";
import type { RobotPhase } from "@/types/order";

/* ------------------------------------------------------------------ *
 * The pick timeline. Roughly 1.85s from "reach" to "home again".
 * `hover` is height off the station: 1 = travelling high, 0 = down on
 * the tray. From directly overhead that reads through the drop shadow
 * and a small scale change, which is what sells the third dimension.
 * ------------------------------------------------------------------ */
interface TimelineStep {
  phase: RobotPhase;
  duration: number;
  hover: number;
  /** 1 = jaws open, 0 = jaws closed. */
  grip: number;
  /** Which waypoint the end effector travels to. */
  goto: "tray" | "hold" | "bowl" | "home";
}

const TIMELINE: TimelineStep[] = [
  { phase: "movingToIngredient", duration: 400, hover: 1, grip: 1, goto: "tray" },
  { phase: "descending", duration: 140, hover: 0, grip: 1, goto: "hold" },
  { phase: "picking", duration: 130, hover: 0, grip: 0, goto: "hold" },
  { phase: "lifting", duration: 150, hover: 1, grip: 0, goto: "hold" },
  { phase: "movingToBowl", duration: 400, hover: 1, grip: 0, goto: "bowl" },
  { phase: "dropping", duration: 120, hover: 0.4, grip: 0, goto: "hold" },
  { phase: "dropping", duration: 130, hover: 0.4, grip: 1, goto: "hold" },
  { phase: "returning", duration: 380, hover: 1, grip: 1, goto: "home" },
];

/** Index of the step where the jaws open and the portion falls. */
const RELEASE_STEP = 6;
/** How long the portion takes to fall into the broth. */
const FALL_MS = 240;

export interface ArmStatus {
  id: string;
  label: string;
  phase: RobotPhase;
  /** Friendly line shown under the picker heading. */
  message: string;
  ingredientId: string | null;
  busy: boolean;
}

export interface FallingPortion {
  key: number;
  ingredientId: string;
  x: number;
  y: number;
}

/** Where a portion just broke the surface of the broth. */
export interface Ripple {
  key: number;
  x: number;
  y: number;
}

export interface ArmFrame {
  shoulder: number;
  elbow: number;
  wristAngle: number;
  gripper: number;
  hover: number;
  position: Point;
  carrying: string | null;
  /** Ramps 0 -> 1 as the portion is gripped, for the pinch squash. */
  hold: number;
}

interface ArmRuntime {
  config: ArmConfig;
  position: Point;
  from: Point;
  to: Point;
  gripper: number;
  hover: number;
  hold: number;
  carrying: string | null;
  ingredientId: string | null;
  stepIndex: number;
  elapsed: number;
  active: boolean;
  /** Ring slot this arm has claimed, so the other arm keeps away. */
  claimedSlot: number | null;
  idlePhase: number;
}

export interface RobotQueueOptions {
  onDeliver: (ingredientId: string) => void;
  onSound?: (
    event: "servo" | "grip" | "release" | "drop",
    armIndex: number,
  ) => void;
  reducedMotion: boolean;
  /** Scales every duration. 1 = normal. */
  speed?: number;
  /**
   * How many times a second the scene is repainted. The simulation always
   * runs at the display refresh rate so the timing stays exact; this only
   * decides how often the result is written to the DOM. Lower it to buy
   * headroom for expensive per-frame work such as the arm lighting.
   */
  frameRate?: number;
}

export interface RobotQueueApi {
  /** Ask the robots to fetch a portion. Returns false if it can't be reached. */
  request: (ingredientId: string) => boolean;
  statuses: ArmStatus[];
  queueLength: number;
  falling: FallingPortion[];
  /** Impact rings on the broth, cleared once they have played out. */
  ripples: Ripple[];
  /** Ingredient ids currently being fetched, for the tray "on its way" ring. */
  inFlight: string[];
  /** Live per-frame values, read by RobotArm inside its own rAF paint. */
  framesRef: React.RefObject<ArmFrame[]>;
  /** Bump this to force a repaint of anything that samples framesRef. */
  subscribe: (fn: () => void) => () => void;
}

const IDLE_MESSAGE = "Ready";

function makeRuntime(config: ArmConfig, index: number): ArmRuntime {
  return {
    config,
    position: { ...config.home },
    from: { ...config.home },
    to: { ...config.home },
    gripper: 1,
    hover: 1,
    hold: 0,
    carrying: null,
    ingredientId: null,
    stepIndex: 0,
    elapsed: 0,
    active: false,
    claimedSlot: null,
    idlePhase: index * 2.1,
  };
}

export function useRobotQueue({
  onDeliver,
  onSound,
  reducedMotion,
  speed = 1,
  frameRate = 60,
}: RobotQueueOptions): RobotQueueApi {
  const runtimeRef = useRef<ArmRuntime[]>(ARMS.map(makeRuntime));
  const framesRef = useRef<ArmFrame[]>(
    ARMS.map((config) => ({
      shoulder: 0,
      elbow: 0,
      wristAngle: 0,
      gripper: 1,
      hover: 1,
      hold: 0,
      position: { ...config.home },
      carrying: null,
    })),
  );
  const queueRef = useRef<string[]>([]);
  const lastArmRef = useRef<number>(-1);
  const listenersRef = useRef(new Set<() => void>());
  const dropKeyRef = useRef(0);

  const [statuses, setStatuses] = useState<ArmStatus[]>(
    ARMS.map((config) => ({
      id: config.id,
      label: config.label,
      phase: "idle" as RobotPhase,
      message: IDLE_MESSAGE,
      ingredientId: null,
      busy: false,
    })),
  );
  const [queueLength, setQueueLength] = useState(0);
  const [falling, setFalling] = useState<FallingPortion[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Keep the latest callbacks without restarting the animation loop.
  const deliverRef = useRef(onDeliver);
  const soundRef = useRef(onSound);
  const reducedRef = useRef(reducedMotion);
  const speedRef = useRef(speed);
  const frameRateRef = useRef(frameRate);
  useEffect(() => {
    deliverRef.current = onDeliver;
    soundRef.current = onSound;
    reducedRef.current = reducedMotion;
    speedRef.current = speed;
    frameRateRef.current = frameRate;
  }, [onDeliver, onSound, reducedMotion, speed, frameRate]);

  const subscribe = useCallback((fn: () => void) => {
    listenersRef.current.add(fn);
    return () => {
      listenersRef.current.delete(fn);
    };
  }, []);

  const setArmStatus = useCallback(
    (index: number, next: Partial<ArmStatus>) => {
      setStatuses((prev) => {
        const current = prev[index];
        const merged = { ...current, ...next };
        if (
          current.phase === merged.phase &&
          current.message === merged.message &&
          current.ingredientId === merged.ingredientId &&
          current.busy === merged.busy
        ) {
          return prev;
        }
        const copy = [...prev];
        copy[index] = merged;
        return copy;
      });
    },
    [],
  );

  /* ----- Which arm should take this tray? ----- */
  const pickArm = useCallback((target: Point, slot: number): number => {
    const runtimes = runtimeRef.current;
    const candidates: number[] = [];
    runtimes.forEach((runtime, index) => {
      if (runtime.active) return;
      if (!canReach(runtime.config, target)) return;
      // Don't send both arms to the same tray.
      const otherClaim = runtimes.some(
        (other, i) => i !== index && other.claimedSlot === slot,
      );
      if (otherClaim) return;
      candidates.push(index);
    });
    if (candidates.length === 0) return -1;
    if (candidates.length === 1) return candidates[0];

    // Both free: alternate so the pair looks like a working crew, unless one
    // is clearly closer.
    const [a, b] = candidates;
    const da = distance(runtimes[a].config.base, target);
    const db = distance(runtimes[b].config.base, target);
    if (Math.abs(da - db) > 90) return da < db ? a : b;
    const preferred = lastArmRef.current === a ? b : a;
    return preferred;
  }, []);

  const startJob = useCallback(
    (index: number, ingredientId: string) => {
      const ingredient = getIngredient(ingredientId);
      if (!ingredient) return;
      const runtime = runtimeRef.current[index];
      runtime.active = true;
      runtime.ingredientId = ingredientId;
      runtime.stepIndex = 0;
      runtime.elapsed = 0;
      runtime.from = { ...runtime.position };
      runtime.to = slotPosition(ingredient.robotPosition.slot);
      runtime.claimedSlot = ingredient.robotPosition.slot;
      runtime.carrying = null;
      runtime.hold = 0;
      lastArmRef.current = index;
      soundRef.current?.("servo", index);
      setArmStatus(index, {
        phase: "movingToIngredient",
        message: `Picking ${ingredient.name}`,
        ingredientId,
        busy: true,
      });
    },
    [setArmStatus],
  );

  /* ----- Reduced motion: no arm travel, just a quick transfer ----- */
  const runReduced = useCallback(
    (ingredientId: string) => {
      const ingredient = getIngredient(ingredientId);
      if (!ingredient) return;
      const key = (dropKeyRef.current += 1);
      const tray = slotPosition(ingredient.robotPosition.slot);
      setFalling((prev) => [
        ...prev,
        { key, ingredientId, x: tray.x, y: tray.y },
      ]);
      setArmStatus(0, {
        phase: "dropping",
        message: `Adding ${ingredient.name}`,
        ingredientId,
        busy: true,
      });
      window.setTimeout(() => {
        deliverRef.current(ingredientId);
        soundRef.current?.("drop", 0);
        splash(STAGE.centre.x, STAGE.centre.y);
        setFalling((prev) => prev.filter((item) => item.key !== key));
        setArmStatus(0, {
          phase: "idle",
          message: `${ingredient.name} added`,
          ingredientId: null,
          busy: false,
        });
        window.setTimeout(
          () =>
            setArmStatus(0, {
              phase: "idle",
              message: IDLE_MESSAGE,
              ingredientId: null,
              busy: false,
            }),
          1400,
        );
      }, 420);
    },
    [setArmStatus],
  );

  /** Ring out from where the portion hit the broth, then tidy up after it. */
  const splash = useCallback((x: number, y: number) => {
    const key = (dropKeyRef.current += 1);
    setRipples((prev) => [...prev, { key, x, y }]);
    window.setTimeout(
      () => setRipples((prev) => prev.filter((item) => item.key !== key)),
      700,
    );
  }, []);

  const request = useCallback(
    (ingredientId: string): boolean => {
      const ingredient = getIngredient(ingredientId);
      if (!ingredient) return false;

      if (reducedRef.current) {
        runReduced(ingredientId);
        return true;
      }

      const target = slotPosition(ingredient.robotPosition.slot);
      const armIndex = pickArm(target, ingredient.robotPosition.slot);
      if (armIndex === -1) {
        queueRef.current = [...queueRef.current, ingredientId];
        setQueueLength(queueRef.current.length);
        return true;
      }
      startJob(armIndex, ingredientId);
      return true;
    },
    [pickArm, runReduced, startJob],
  );

  /* ----- The animation loop ----- */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastPaint = 0;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const seconds = now / 1000;
      const runtimes = runtimeRef.current;

      runtimes.forEach((runtime, index) => {
        if (runtime.active) {
          const step = TIMELINE[runtime.stepIndex];
          runtime.elapsed += dt * speedRef.current;
          const t = Math.min(1, runtime.elapsed / step.duration);

          // End-effector travel.
          if (step.goto === "hold") {
            runtime.position = { ...runtime.to };
          } else {
            const eased =
              step.goto === "home" ? easeOutCubic(t) : easeInOutCubic(t);
            runtime.position = polarLerp(
              runtime.config.base,
              runtime.from,
              runtime.to,
              eased,
            );
          }

          // Height, jaws and pinch ease toward the step's targets.
          const k = 1 - Math.pow(0.001, dt / 1000);
          runtime.hover += (step.hover - runtime.hover) * Math.min(1, k * 3.2);
          runtime.gripper +=
            (step.grip - runtime.gripper) * Math.min(1, k * 4.4);
          const holdTarget = runtime.carrying ? 1 : 0;
          runtime.hold += (holdTarget - runtime.hold) * Math.min(1, k * 4);

          if (t >= 1) {
            const nextIndex = runtime.stepIndex + 1;

            if (runtime.stepIndex === 2 && runtime.ingredientId) {
              // Jaws have closed on the tray: the portion is now held.
              runtime.carrying = runtime.ingredientId;
              soundRef.current?.("grip", index);
            }

            if (nextIndex === RELEASE_STEP && runtime.ingredientId) {
              // Jaws open over the bowl.
              const ingredientId = runtime.ingredientId;
              const ingredient = getIngredient(ingredientId);
              runtime.carrying = null;
              soundRef.current?.("release", index);
              const key = (dropKeyRef.current += 1);
              const at = runtime.config.release;
              setFalling((prev) => [
                ...prev,
                { key, ingredientId, x: at.x, y: at.y },
              ]);
              setArmStatus(index, {
                phase: "dropping",
                message: `Adding ${ingredient?.name ?? "portion"}`,
                ingredientId,
                busy: true,
              });
              window.setTimeout(() => {
                deliverRef.current(ingredientId);
                soundRef.current?.("drop", index);
                splash(at.x, at.y);
                setFalling((prev) => prev.filter((item) => item.key !== key));
              }, FALL_MS);
            }

            if (nextIndex >= TIMELINE.length) {
              // Job complete.
              const finished = runtime.ingredientId;
              const name = finished ? getIngredient(finished)?.name : null;
              runtime.active = false;
              runtime.ingredientId = null;
              runtime.claimedSlot = null;
              runtime.stepIndex = 0;
              runtime.elapsed = 0;
              runtime.from = { ...runtime.position };
              runtime.to = { ...runtime.config.home };
              setArmStatus(index, {
                phase: "idle",
                message: name ? `${name} added` : IDLE_MESSAGE,
                ingredientId: null,
                busy: false,
              });
              if (name) {
                window.setTimeout(() => {
                  setArmStatus(index, {
                    phase: "idle",
                    message: IDLE_MESSAGE,
                    ingredientId: null,
                    busy: false,
                  });
                }, 1500);
              }
            } else {
              const nextStep = TIMELINE[nextIndex];
              runtime.stepIndex = nextIndex;
              runtime.elapsed = 0;
              runtime.from = { ...runtime.position };
              if (nextStep.goto === "bowl") {
                runtime.to = { ...runtime.config.release };
                soundRef.current?.("servo", index);
                setArmStatus(index, {
                  phase: "movingToBowl",
                  message: `Carrying ${
                    getIngredient(runtime.ingredientId ?? "")?.name ?? ""
                  }`.trim(),
                  ingredientId: runtime.ingredientId,
                  busy: true,
                });
              } else if (nextStep.goto === "home") {
                runtime.to = { ...runtime.config.home };
              } else if (nextStep.goto === "tray") {
                // already set
              } else {
                runtime.to = { ...runtime.position };
              }
            }
          }
        } else {
          // Idle: small servo drift so the pair always looks powered up.
          const home = runtime.config.home;
          const wobbleX = Math.sin(seconds * 0.62 + runtime.idlePhase) * 7;
          const wobbleY = Math.cos(seconds * 0.47 + runtime.idlePhase * 1.7) * 5.5;
          const micro = Math.sin(seconds * 2.3 + runtime.idlePhase * 3) * 1.2;
          const target = {
            x: home.x + wobbleX + micro,
            y: home.y + wobbleY,
          };
          const k = 1 - Math.pow(0.02, dt / 1000);
          runtime.position = {
            x: runtime.position.x + (target.x - runtime.position.x) * k,
            y: runtime.position.y + (target.y - runtime.position.y) * k,
          };
          runtime.hover += (1 - runtime.hover) * Math.min(1, k * 2);
          runtime.gripper += (1 - runtime.gripper) * Math.min(1, k * 2);
          runtime.hold += (0 - runtime.hold) * Math.min(1, k * 2);
        }

        framesRef.current[index] = {
          shoulder: 0,
          elbow: 0,
          wristAngle: 0,
          gripper: runtime.gripper,
          hover: runtime.hover,
          hold: runtime.hold,
          position: runtime.position,
          carrying: runtime.carrying,
        };
      });

      // Dispatch anything waiting.
      if (queueRef.current.length > 0) {
        const nextId = queueRef.current[0];
        const ingredient = getIngredient(nextId);
        if (ingredient) {
          const target = slotPosition(ingredient.robotPosition.slot);
          const armIndex = pickArm(target, ingredient.robotPosition.slot);
          if (armIndex !== -1) {
            queueRef.current = queueRef.current.slice(1);
            setQueueLength(queueRef.current.length);
            startJob(armIndex, nextId);
          }
        } else {
          queueRef.current = queueRef.current.slice(1);
          setQueueLength(queueRef.current.length);
        }
      }

      // Simulate every frame, but only repaint on the camera's cadence.
      const interval = 1000 / Math.max(1, frameRateRef.current);
      if (now - lastPaint >= interval) {
        // Snap to the cadence instead of drifting, so the stepping stays even.
        lastPaint = now - ((now - lastPaint) % interval);
        listenersRef.current.forEach((fn) => fn());
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pickArm, setArmStatus, splash, startJob]);

  const inFlight = statuses
    .map((status) => status.ingredientId)
    .filter((id): id is string => Boolean(id));

  return {
    request,
    statuses,
    queueLength,
    falling,
    ripples,
    inFlight,
    framesRef,
    subscribe,
  };
}

export const STATION = STAGE;
export type { ArmConfig };
