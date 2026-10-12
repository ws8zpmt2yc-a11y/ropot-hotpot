"use client";

import { useMemo } from "react";
import { FoodPortion } from "@/components/food/FoodPortion";
import { getIngredient } from "@/data/ingredients";
import { DEFAULT_BROTH_COLORS, getBroth } from "@/data/broths";
import { seededRandom, hashString, cosr, sinr, STAGE } from "@/lib/geometry";
import type { OrderLine } from "@/types/order";

const MAX_VISIBLE = 24;
/** How far portions spread from the bowl centre, and how big they draw. */
const SPREAD = 0.66;
const PORTION_SIZE = 0.56;

interface Portion {
  key: string;
  ingredientId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  layer: number;
  seed: number;
}

/**
 * The takeaway bowl, seen from directly above. Broth colour comes from the
 * chosen base; every portion the arms drop in is laid out deterministically
 * so the pile stays put between renders and only new arrivals animate.
 */
export function HotpotBowl({
  lines,
  brothId,
  spiceLevel = 1,
  radius = STAGE.bowlRadius,
  cx = STAGE.centre.x,
  cy = STAGE.centre.y,
  animate = true,
  idPrefix = "",
}: {
  lines: OrderLine[];
  brothId: string | null;
  spiceLevel?: number;
  radius?: number;
  cx?: number;
  cy?: number;
  animate?: boolean;
  /** Keeps gradient and clip ids unique when a page shows several bowls. */
  idPrefix?: string;
}) {
  const broth = getBroth(brothId);
  const colors = broth?.colors ?? DEFAULT_BROTH_COLORS;
  const gradientId = `broth-${idPrefix}${broth?.id ?? "empty"}`;

  const portions = useMemo<Portion[]>(() => {
    const result: Portion[] = [];
    for (const line of lines) {
      const ingredient = getIngredient(line.ingredientId);
      if (!ingredient) continue;
      const rand = seededRandom(hashString(ingredient.id) + 17);
      for (let unit = 0; unit < line.quantity; unit += 1) {
        // Each extra portion drifts a little further from the anchor so a
        // stack of five wagyu still reads as five separate portions.
        const spread = 0.16 + unit * 0.1;
        const angle = rand() * Math.PI * 2;
        result.push({
          key: `${ingredient.id}-${unit}`,
          ingredientId: ingredient.id,
          x: ingredient.bowlPosition.x + cosr(angle) * spread,
          y: ingredient.bowlPosition.y + sinr(angle) * spread,
          rotation: rand() * 360,
          scale: 0.88 + rand() * 0.24,
          layer: ingredient.bowlPosition.layer + unit,
          seed: unit + 1,
        });
      }
    }
    result.sort((a, b) => a.layer - b.layer);
    return result;
  }, [lines]);

  const visible = portions.slice(0, MAX_VISIBLE);
  const overflow = portions.length - visible.length;
  const clipId = `bowl-clip-${idPrefix}${Math.round(cx)}-${Math.round(cy)}`;

  return (
    <g style={{ pointerEvents: "none" }}>
      <defs>
        {/* Broth read from directly above: an almost flat liquid surface
            that only darkens where it meets the wall of the bowl. */}
        <radialGradient id={gradientId} cx="50%" cy="50%" r="52%">
          <stop offset="0%" stopColor={colors.base} />
          <stop offset="62%" stopColor={colors.base} />
          <stop offset="88%" stopColor={colors.deep} />
          <stop offset="100%" stopColor={colors.deep} stopOpacity="0.92" />
        </radialGradient>
        <radialGradient id={`${gradientId}-rim`} cx="34%" cy="24%" r="82%">
          <stop offset="0%" stopColor="#8B8078" />
          <stop offset="42%" stopColor="#4A423C" />
          <stop offset="100%" stopColor="#1A1513" />
        </radialGradient>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={radius * 0.84} />
        </clipPath>
      </defs>

      {/* Bowl shadow on the station surface. */}
      <ellipse
        cx={cx + radius * 0.06}
        cy={cy + radius * 0.14}
        rx={radius * 1.16}
        ry={radius * 1.1}
        fill="rgba(0,0,0,0.55)"
        style={{ filter: "blur(16px)" }}
      />

      {/* Steel outer rim of the takeaway bowl. */}
      <circle cx={cx} cy={cy} r={radius} fill={`url(#${gradientId}-rim)`} />
      <circle
        cx={cx}
        cy={cy}
        r={radius - 1}
        fill="none"
        stroke="#8E837A"
        strokeWidth="3"
        opacity="0.85"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius - 7}
        fill="none"
        stroke="rgba(255,241,222,0.35)"
        strokeWidth="2"
      />
      {/* Inner lip, catching the warm light from above. */}
      <circle
        cx={cx}
        cy={cy}
        r={radius * 0.9}
        fill="none"
        stroke="rgba(0,0,0,0.6)"
        strokeWidth={radius * 0.1}
      />
      <path
        d={`M ${cx - radius * 0.72} ${cy - radius * 0.5} A ${radius * 0.9} ${
          radius * 0.9
        } 0 0 1 ${cx + radius * 0.36} ${cy - radius * 0.83}`}
        fill="none"
        stroke="#FFE6C2"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Broth. */}
      <circle cx={cx} cy={cy} r={radius * 0.84} fill={`url(#${gradientId})`} />
      {!broth ? (
        <circle
          cx={cx}
          cy={cy}
          r={radius * 0.84}
          fill="#2C2420"
          opacity="0.86"
        />
      ) : null}

      <g clipPath={`url(#${clipId})`}>
        {/* Chilli, peppercorn and oil floating on the surface. */}
        {broth ? (
          <>
            <ellipse
              cx={cx - radius * 0.22}
              cy={cy - radius * 0.24}
              rx={radius * 0.46}
              ry={radius * 0.3}
              fill={colors.sheen}
              opacity="0.3"
              style={{ filter: "blur(12px)" }}
            />
            {Array.from({ length: 16 }).map((_, index) => {
              const rand = seededRandom(2200 + index * 53);
              const angle = rand() * Math.PI * 2;
              const dist = Math.round(Math.sqrt(rand()) * 1e6) / 1e6 * radius * 0.76;
              const px = cx + cosr(angle) * dist;
              const py = cy + sinr(angle) * dist;
              const isChilli = spiceLevel > 0 && index % 3 !== 2;
              return isChilli ? (
                <path
                  key={index}
                  d={`M${-radius * 0.09} 0 C ${-radius * 0.04} ${-radius * 0.035}, ${
                    radius * 0.05
                  } ${-radius * 0.035}, ${radius * 0.09} 0 C ${radius * 0.05} ${
                    radius * 0.035
                  }, ${-radius * 0.04} ${radius * 0.035}, ${-radius * 0.09} 0 Z`}
                  transform={`translate(${px} ${py}) rotate(${rand() * 360})`}
                  fill="#8E1408"
                  opacity="0.72"
                />
              ) : (
                <circle
                  key={index}
                  cx={px}
                  cy={py}
                  r={radius * 0.022}
                  fill="#4A2A15"
                  opacity="0.6"
                />
              );
            })}
            {/* Slow-turning oil slick. */}
            <ellipse
              cx={cx - radius * 0.3}
              cy={cy - radius * 0.12}
              rx={radius * 0.38}
              ry={radius * 0.24}
              fill="#FFD9A0"
              opacity="0.16"
              style={{ filter: "blur(9px)" }}
            >
              {animate ? (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${cx} ${cy}`}
                  to={`360 ${cx} ${cy}`}
                  dur="30s"
                  repeatCount="indefinite"
                />
              ) : null}
            </ellipse>
            {animate && spiceLevel > 0
              ? Array.from({ length: 8 }).map((_, index) => {
                  const rand = seededRandom(9001 + index * 31);
                  const bx = cx + (rand() - 0.5) * radius * 1.3;
                  const by = cy + (rand() - 0.5) * radius * 1.3;
                  const r = radius * (0.022 + rand() * 0.03);
                  return (
                    <circle key={index} cx={bx} cy={by} r={r} fill="#FFE7C4" opacity="0.35">
                      <animate
                        attributeName="opacity"
                        values="0;0.55;0"
                        dur={`${2.4 + rand() * 2}s`}
                        begin={`${rand() * 2}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="r"
                        values={`${r * 0.3};${r};${r * 0.5}`}
                        dur={`${2.4 + rand() * 2}s`}
                        begin={`${rand() * 2}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })
              : null}
          </>
        ) : null}

        {/* Everything the arms have dropped in. */}
        {visible.map((portion) => (
          <g
            key={portion.key}
            transform={`translate(${cx + portion.x * radius * SPREAD} ${
              cy + portion.y * radius * SPREAD
            }) rotate(${portion.rotation})`}
          >
            {/* The drop animation lives on an inner group: animating transform
                here would overwrite the positioning transform above. */}
            <g
              style={
                animate
                  ? {
                      animation:
                        "bowl-drop 460ms cubic-bezier(0.16,1,0.3,1) both",
                      transformBox: "fill-box",
                      transformOrigin: "center",
                    }
                  : undefined
              }
            >
              <FoodPortion
                ingredientId={portion.ingredientId}
                size={radius * PORTION_SIZE * portion.scale}
                seed={portion.seed}
                instance={`${idPrefix}${portion.key}`}
              />
            </g>
          </g>
        ))}

        {/* Wall shadow falling onto the broth. */}
        <circle
          cx={cx}
          cy={cy}
          r={radius * 0.84}
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth={radius * 0.13}
        />
      </g>

      {overflow > 0 ? (
        <g transform={`translate(${cx} ${cy + radius * 0.6})`}>
          <rect
            x="-26"
            y="-11"
            width="52"
            height="22"
            rx="11"
            fill="#171313"
            opacity="0.82"
          />
          <text
            textAnchor="middle"
            y="5"
            fill="#FFF1DE"
            fontSize="13"
            fontWeight="700"
            fontFamily="var(--font-sans)"
          >
            +{overflow}
          </text>
        </g>
      ) : null}

    </g>
  );
}

/** Soft haze drifting over the bowl. Sits above the bowl in the stage. */
export function BowlSteam({
  cx = STAGE.centre.x,
  cy = STAGE.centre.y,
  radius = STAGE.bowlRadius,
}: {
  cx?: number;
  cy?: number;
  radius?: number;
}) {
  return (
    <g className="pointer-events-none" opacity="0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const rand = seededRandom(4400 + index * 97);
        const ox = (rand() - 0.5) * radius * 1.1;
        const oy = (rand() - 0.5) * radius * 0.7;
        const size = radius * (0.42 + rand() * 0.34);
        return (
          <ellipse
            key={index}
            cx={cx + ox}
            cy={cy + oy}
            rx={size}
            ry={size * 0.62}
            fill="#FFF6EA"
            opacity="0"
            style={{ filter: "blur(13px)" }}
          >
            <animate
              attributeName="opacity"
              values="0;0.34;0"
              dur={`${5 + rand() * 3}s`}
              begin={`${index * 1.1}s`}
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0 12; ${(rand() - 0.5) * 26} -34; ${(rand() - 0.5) * 40} -66`}
              dur={`${5 + rand() * 3}s`}
              begin={`${index * 1.1}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        );
      })}
    </g>
  );
}
