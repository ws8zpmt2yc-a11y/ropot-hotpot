/**
 * Photographed arm segments, composited onto the kinematics the picker
 * already solves. Because the camera looks straight down, rotating a
 * top-down segment about its joint is geometrically correct — so the arms
 * keep moving exactly as they did, but out of photographs.
 *
 * Each sprite is placed in its joint's local frame, where the joint sits at
 * (0, 0) and the segment runs along +x. `x`/`y` are the top-left corner of
 * the drawn image; `w`/`h` its drawn size in stage units. Nudge these if the
 * sprites are ever re-shot.
 */
import { asset } from "@/lib/asset";

export interface ArmSprite {
  href: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ARM_SPRITES: {
  upper: ArmSprite;
  fore: ArmSprite;
  gripperOpen: ArmSprite;
  gripperClosed: ArmSprite;
  available: boolean;
} = {
  // Placements derived from where the dark joint housings actually sit in
  // each photograph, so the sprite's joints land on the solver's joints.
  upper: { href: asset("/images/arm/upper.png"), x: -18.5, y: -43.2, w: 250, h: 87 },
  fore: { href: asset("/images/arm/fore.png"), x: -16.5, y: -21, w: 221, h: 42 },
  gripperOpen: {
    href: asset("/images/arm/gripper-open.png"),
    x: -22.2,
    y: -28,
    w: 135,
    h: 56,
  },
  gripperClosed: {
    href: asset("/images/arm/gripper-closed.png"),
    x: -22.1,
    y: -23,
    w: 135,
    h: 46,
  },
  /** Flip to false to fall back to the drawn arm. */
  available: true,
};
