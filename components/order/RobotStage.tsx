"use client";

import { useEffect, useRef } from "react";
import { FoodPortion } from "@/components/food/FoodPortion";
import { ARMS, STAGE, slotPosition, cosr, sinr, hypotr } from "@/lib/geometry";
import { INGREDIENTS } from "@/data/ingredients";
import type { Ingredient, OrderLine } from "@/types/order";
import type { ArmFrame, FallingPortion, Ripple } from "@/hooks/useRobotQueue";
import { HotpotBowl, BowlSteam } from "./HotpotBowl";
import { IngredientWheel } from "./IngredientWheel";
import { RobotArm } from "./RobotArm";
import { StationDefs } from "./StationDefs";
import { PassersBy } from "./PassersBy";
import { asset } from "@/lib/asset";

/**
 * The bird's-eye preparation station: bowl in the middle, two arms mounted
 * above and below it, and the ingredient ring around the outside.
 */
export function RobotStage({
  lines,
  brothId,
  spiceLevel,
  items = INGREDIENTS,
  quantityOf,
  hovered,
  inFlight,
  falling,
  ripples,
  framesRef,
  subscribe,
  onHover,
  onSelect,
  reducedMotion,
  compact = false,
}: {
  lines: OrderLine[];
  brothId: string | null;
  spiceLevel: number;
  items?: Ingredient[];
  quantityOf: (id: string) => number;
  hovered: string | null;
  inFlight: string[];
  falling: FallingPortion[];
  ripples: Ripple[];
  framesRef: React.RefObject<ArmFrame[]>;
  subscribe: (fn: () => void) => () => void;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
  compact?: boolean;
}) {
  const hoveredItem = items.find((item) => item.id === hovered) ?? null;
  const hoverPoint = hoveredItem
    ? slotPosition(hoveredItem.robotPosition.slot)
    : null;
  const cameraRef = useCameraDrift(subscribe, reducedMotion);

  return (
    <svg
      viewBox={`0 0 ${STAGE.size} ${STAGE.size}`}
      className="block h-full w-full max-w-full select-none"
      role="group"
      aria-label="Bird's-eye view of the RoPot ingredient station"
    >
      <StationDefs />

      {/* Everything inside this group sits "in front of the lens". */}
      <g ref={cameraRef}>
      {/* The restaurant floor the bench stands on. It has to overhang the
          stage, because the camera sits back far enough to see past it. */}
      <image
        href={asset("/images/room/floor.jpg")}
        x={-BLEED}
        y={-BLEED}
        width={STAGE.size + BLEED * 2}
        height={STAGE.size + BLEED * 2}
        preserveAspectRatio="xMidYMid slice"
        style={{ filter: "brightness(0.62) saturate(0.85)" }}
      />
      <rect
        x={-BLEED}
        y={-BLEED}
        width={STAGE.size + BLEED * 2}
        height={STAGE.size + BLEED * 2}
        fill="url(#station-floor)"
      />
      <rect
        x={-BLEED}
        y={-BLEED}
        width={STAGE.size + BLEED * 2}
        height={STAGE.size + BLEED * 2}
        fill="url(#station-spot)"
      />

      {/* People crossing the floor. Drawn before the bench, so the bench
          hides them as they pass behind it. */}
      <PassersBy enabled={!reducedMotion} />

      {/* Brushed steel bench under the ingredient ring, opaque so it occludes
          anyone walking behind it. */}
      <circle
        cx={STAGE.centre.x}
        cy={STAGE.centre.y}
        r={STAGE.ringRadius + STAGE.trayRadius * 1.75}
        fill="#241C1A"
      />
      <circle
        cx={STAGE.centre.x}
        cy={STAGE.centre.y}
        r={STAGE.ringRadius + STAGE.trayRadius * 1.75}
        fill="none"
        stroke="rgba(255,241,222,0.14)"
        strokeWidth="2"
      />

      <IngredientWheel
        items={items}
        quantityOf={quantityOf}
        hovered={hovered}
        inFlight={inFlight}
        onHover={onHover}
        onSelect={onSelect}
      />

      {/* Central preparation station the arms are bolted to. */}
      <g style={{ pointerEvents: "none" }}>
        <rect
          x={STAGE.centre.x - 82}
          y={STAGE.centre.y - 244}
          width={164}
          height={488}
          rx={82}
          fill="#0C0908"
          opacity="0.55"
          style={{ filter: "blur(18px)" }}
        />
        <rect
          x={STAGE.centre.x - 74}
          y={STAGE.centre.y - 236}
          width={148}
          height={472}
          rx={74}
          fill="url(#plinth)"
        />
        <rect
          x={STAGE.centre.x - 74}
          y={STAGE.centre.y - 236}
          width={148}
          height={472}
          rx={74}
          fill="none"
          stroke="rgba(255,241,222,0.22)"
          strokeWidth="1.6"
        />
        <rect
          x={STAGE.centre.x - 62}
          y={STAGE.centre.y - 224}
          width={124}
          height={448}
          rx={62}
          fill="none"
          stroke="rgba(255,241,222,0.09)"
          strokeWidth="1.2"
        />
        {/* Amber under-light strip, like the one on the service robots. */}
        <rect
          x={STAGE.centre.x - 66}
          y={STAGE.centre.y - 3}
          width={132}
          height={6}
          rx={3}
          fill="#FF9A3D"
          opacity="0.2"
          filter="url(#bloom)"
        />
        {/* Mounting plates. */}
        {ARMS.map((arm) => (
          <g key={arm.id}>
            <circle
              cx={arm.base.x}
              cy={arm.base.y}
              r={64}
              fill="#191413"
              stroke="rgba(255,241,222,0.14)"
              strokeWidth="1.4"
            />
            {[45, 135, 225, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <circle
                  key={angle}
                  cx={arm.base.x + cosr(rad) * 56}
                  cy={arm.base.y + sinr(rad) * 56}
                  r={3.4}
                  fill="#6A605A"
                />
              );
            })}
          </g>
        ))}
      </g>

      <HotpotBowl
        lines={lines}
        brothId={brothId}
        spiceLevel={spiceLevel}
        animate={!reducedMotion}
      />

      {/* Portions in mid-air between the jaws and the broth. */}
      {falling.map((portion) => (
        <g
          key={portion.key}
          transform={`translate(${portion.x} ${portion.y})`}
          style={{ pointerEvents: "none" }}
        >
          <g
            style={{
              animation: "portion-fall 240ms cubic-bezier(0.4,0,1,1) forwards",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            <FoodPortion
              ingredientId={portion.ingredientId}
              size={46}
              seed={5}
              instance={`fall-${portion.key}`}
            />
          </g>
        </g>
      ))}

      {/* Where a portion broke the surface. */}
      {ripples.map((ripple) => (
        <g key={ripple.key} style={{ pointerEvents: "none" }}>
          <circle
            cx={ripple.x}
            cy={ripple.y}
            r="8"
            fill="none"
            stroke="#FFE7C4"
            strokeWidth="3"
            style={{ animation: "broth-ripple 620ms ease-out forwards" }}
          />
          <circle
            cx={ripple.x}
            cy={ripple.y}
            r="8"
            fill="none"
            stroke="#FFF6E6"
            strokeWidth="1.6"
            style={{ animation: "broth-ripple 620ms 90ms ease-out forwards" }}
          />
          <circle
            cx={ripple.x}
            cy={ripple.y}
            r="16"
            fill="#FFD9A0"
            style={{ animation: "broth-splash 380ms ease-out forwards" }}
          />
        </g>
      ))}

      {ARMS.map((arm, index) => (
        <RobotArm
          key={arm.id}
          config={arm}
          index={index}
          framesRef={framesRef}
          subscribe={subscribe}
          showEnvelope={!compact}
        />
      ))}

      {!reducedMotion ? <BowlSteam /> : null}
      </g>

      {/* Hover read-out: name and price, pinned beside the tray. */}
      {hoveredItem && hoverPoint ? (
        <TrayLabel ingredient={hoveredItem} x={hoverPoint.x} y={hoverPoint.y} />
      ) : null}
    </svg>
  );
}

/**
 * Where the camera sits. Pulled back so the bench doesn't fill the frame —
 * you need to see floor around it for the shot to read as a room — and nudged
 * off centre, because nobody mounts a camera perfectly over anything.
 */
const CAMERA = { zoom: 0.82, offsetX: 26, offsetY: -16 } as const;

/** How far the room extends past the stage, so the wider view stays covered. */
const BLEED = 220;

/**
 * A slow handheld drift, so the scene reads as something a camera is looking
 * at rather than a diagram. Layered sine waves, no randomness — it has to stay
 * identical between the server render and hydration.
 */
function useCameraDrift(
  subscribe: (fn: () => void) => () => void,
  reducedMotion: boolean,
) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      ref.current?.setAttribute("transform", "");
      return;
    }
    const paint = () => {
      const node = ref.current;
      if (!node) return;
      const t = performance.now() / 1000;

      // Two slow swells plus a faster tremor: the shape of a hand holding a
      // camera steady but not perfectly still.
      const x = Math.sin(t * 0.19) * 7 + Math.sin(t * 0.53 + 1.1) * 2.6 + Math.sin(t * 2.7) * 0.7;
      const y = Math.cos(t * 0.23 + 0.6) * 6 + Math.cos(t * 0.61) * 2.2 + Math.cos(t * 3.1) * 0.6;
      const rotation = Math.sin(t * 0.14 + 2.2) * 0.24 + Math.sin(t * 1.9) * 0.05;
      const zoom = CAMERA.zoom + Math.sin(t * 0.11) * 0.012;

      node.setAttribute(
        "transform",
        `translate(${(500 + CAMERA.offsetX + x).toFixed(3)} ${(
          500 +
          CAMERA.offsetY +
          y
        ).toFixed(3)}) rotate(${rotation.toFixed(4)}) scale(${zoom.toFixed(
          4,
        )}) translate(-500 -500)`,
      );
    };
    paint();
    return subscribe(paint);
  }, [reducedMotion, subscribe]);

  return ref;
}

function TrayLabel({
  ingredient,
  x,
  y,
}: {
  ingredient: Ingredient;
  x: number;
  y: number;
}) {
  // Push the label toward the outside of the ring so it never covers a tray.
  const dx = x - STAGE.centre.x;
  const dy = y - STAGE.centre.y;
  const length = hypotr(dx, dy) || 1;
  const offset = STAGE.trayRadius + 46;
  const lx = x + (dx / length) * offset;
  const ly = y + (dy / length) * offset;

  const width = Math.max(150, ingredient.name.length * 10 + 74);
  const anchorX = Math.min(STAGE.size - width / 2 - 8, Math.max(width / 2 + 8, lx));
  const anchorY = Math.min(STAGE.size - 34, Math.max(34, ly));

  return (
    <g
      transform={`translate(${anchorX} ${anchorY})`}
      style={{ pointerEvents: "none", animation: "status-in 180ms ease-out both" }}
    >
      <rect
        x={-width / 2}
        y={-24}
        width={width}
        height={48}
        rx={24}
        fill="#171313"
        opacity="0.93"
      />
      <rect
        x={-width / 2}
        y={-24}
        width={width}
        height={48}
        rx={24}
        fill="none"
        stroke="rgba(255,154,61,0.5)"
        strokeWidth="1.5"
      />
      <text
        x={-width / 2 + 20}
        y={-2}
        fill="#FFF1DE"
        fontSize="17"
        fontWeight="700"
        fontFamily="var(--font-sans)"
      >
        {ingredient.name}
      </text>
      <text
        x={-width / 2 + 20}
        y={15}
        fill="#FF9A3D"
        fontSize="14"
        fontWeight="700"
        fontFamily="var(--font-sans)"
      >
        +${ingredient.price.toFixed(2)}
      </text>
    </g>
  );
}
