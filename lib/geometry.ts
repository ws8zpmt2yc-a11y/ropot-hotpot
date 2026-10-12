/**
 * Bird's-eye stage geometry + 2-link inverse kinematics for the robot arms.
 *
 * The stage is a 1000 x 1000 SVG viewBox. The centre of the preparation
 * station (and the bowl) is at STAGE.centre. Ingredient trays sit on a ring
 * around it; the two arms are mounted on the station above and below the bowl.
 */

export const STAGE = {
  size: 1000,
  centre: { x: 500, y: 500 },
  bowlRadius: 118,
  ringRadius: 355,
  trayRadius: 44,
  slots: 24,
} as const;

export const ARM = {
  /** Upper arm length (shoulder -> elbow). */
  upper: 210,
  /** Forearm length (elbow -> wrist). */
  fore: 190,
  /** Wrist plate -> centre of the gripper jaws. */
  wrist: 34,
  baseRadius: 48,
  maxReach: 392,
  minReach: 46,
} as const;

export interface ArmConfig {
  id: "01" | "02";
  label: string;
  base: { x: number; y: number };
  /** +1 or -1: which way the elbow bends, so the two arms bend apart. */
  elbowSign: 1 | -1;
  /** Resting end-effector target. */
  home: { x: number; y: number };
  /** Where this arm hovers when releasing into the bowl. */
  release: { x: number; y: number };
}

export const ARMS: ArmConfig[] = [
  {
    id: "01",
    label: "Robot 01",
    base: { x: 500, y: 330 },
    elbowSign: 1,
    home: { x: 364, y: 267 },
    release: { x: 578, y: 548 },
  },
  {
    id: "02",
    label: "Robot 02",
    base: { x: 500, y: 670 },
    elbowSign: -1,
    home: { x: 636, y: 733 },
    release: { x: 578, y: 452 },
  },
];

export interface Point {
  x: number;
  y: number;
}

/**
 * The warm downlight above the bench, in stage coordinates. Everything that
 * needs to look physically lit — cast shadows, the highlight travelling along
 * an arm, how dark a dish sits — derives from this one position, which is why
 * the scene holds together instead of looking like separately shaded parts.
 */
export const LIGHT = { x: 322, y: 246 } as const;

/** Direction from the light to a point, and how far away it is. */
export function lightVector(point: Point): {
  ux: number;
  uy: number;
  distance: number;
} {
  const dx = point.x - LIGHT.x;
  const dy = point.y - LIGHT.y;
  const distance = hypotr(dx, dy) || 1;
  return { ux: dx / distance, uy: dy / distance, distance };
}

/**
 * Math.cos / Math.sin are allowed to differ by a single ulp between the Node
 * runtime that renders the HTML and the browser that hydrates it, which React
 * reports as a hydration mismatch. Rounding makes both sides agree.
 */
export const cosr = (radians: number): number =>
  Math.round(Math.cos(radians) * 1e6) / 1e6;

export const sinr = (radians: number): number =>
  Math.round(Math.sin(radians) * 1e6) / 1e6;

export const hypotr = (dx: number, dy: number): number =>
  Math.round(Math.hypot(dx, dy) * 1e6) / 1e6;

/** Convert a ring slot to stage coordinates. 0 deg = 12 o'clock, clockwise. */
export function polarToStage(angleDeg: number, radius: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: STAGE.centre.x + radius * sinr(rad),
    y: STAGE.centre.y - radius * cosr(rad),
  };
}

export function slotAngle(slot: number): number {
  return (slot * 360) / STAGE.slots;
}

export function slotPosition(slot: number, radius = STAGE.ringRadius): Point {
  return polarToStage(slotAngle(slot), radius);
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Can this arm physically reach that point? */
export function canReach(arm: ArmConfig, target: Point): boolean {
  const d = distance(arm.base, target);
  return d <= ARM.maxReach && d >= ARM.minReach;
}

export interface JointAngles {
  /** Shoulder rotation, degrees, 0 = pointing along +x. */
  shoulder: number;
  /** Elbow rotation relative to the upper arm, degrees. */
  elbow: number;
  /** Wrist rotation relative to the forearm, degrees. */
  wristAngle: number;
}

/**
 * Two-link IK with a short wrist link on the end.
 * Returns joint angles in degrees that place the gripper centre at `target`.
 */
export function solveArm(arm: ArmConfig, target: Point): JointAngles {
  const { upper: l1, fore: l2, wrist: l3 } = ARM;

  // Approach the target radially outward from the base, so the gripper always
  // points away from the robot the way a real arm presents its tool.
  const dxT = target.x - arm.base.x;
  const dyT = target.y - arm.base.y;
  const approach = Math.atan2(dyT, dxT);

  // Pull the wrist point back along the approach direction.
  const wx = target.x - Math.cos(approach) * l3;
  const wy = target.y - Math.sin(approach) * l3;

  const dx = wx - arm.base.x;
  const dy = wy - arm.base.y;
  const reachMax = l1 + l2 - 0.5;
  const reachMin = Math.abs(l1 - l2) + 0.5;
  const d = Math.min(reachMax, Math.max(reachMin, Math.hypot(dx, dy)));

  const phi = Math.atan2(dy, dx);
  const cosElbow = (d * d - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  const elbow = Math.acos(Math.min(1, Math.max(-1, cosElbow))) * arm.elbowSign;
  const shoulder =
    phi - Math.atan2(l2 * Math.sin(elbow), l1 + l2 * Math.cos(elbow));

  const wristAngle = approach - (shoulder + elbow);

  return {
    shoulder: toDeg(shoulder),
    elbow: toDeg(elbow),
    wristAngle: toDeg(normaliseAngle(wristAngle)),
  };
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function normaliseAngle(rad: number): number {
  let a = rad;
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

/**
 * Interpolate the end-effector between two points in polar space around the
 * arm base. Straight-line interpolation reads as a gantry; sweeping the angle
 * and the radius separately reads as a rotating industrial arm.
 */
export function polarLerp(
  base: Point,
  from: Point,
  to: Point,
  t: number,
): Point {
  const a0 = Math.atan2(from.y - base.y, from.x - base.x);
  let a1 = Math.atan2(to.y - base.y, to.x - base.x);
  // Always take the short way round.
  while (a1 - a0 > Math.PI) a1 -= Math.PI * 2;
  while (a1 - a0 < -Math.PI) a1 += Math.PI * 2;

  const r0 = Math.hypot(from.x - base.x, from.y - base.y);
  const r1 = Math.hypot(to.x - base.x, to.y - base.y);

  const a = a0 + (a1 - a0) * t;
  const r = r0 + (r1 - r0) * t;

  return { x: base.x + Math.cos(a) * r, y: base.y + Math.sin(a) * r };
}

/* ---------------- Easing ---------------- */

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const easeInCubic = (t: number): number => t * t * t;

export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Small deterministic PRNG so food art is stable between renders. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
