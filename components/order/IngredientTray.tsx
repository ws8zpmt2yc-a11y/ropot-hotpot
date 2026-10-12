"use client";

import { FoodArt } from "@/components/food/FoodArt";
import { FoodImage, hasPhoto } from "@/components/food/FoodImage";
import { CATEGORY_COLORS } from "@/data/ingredients";
import { STAGE, LIGHT, hashString, hypotr, seededRandom } from "@/lib/geometry";
import type { Ingredient } from "@/types/order";

export interface IngredientTrayProps {
  ingredient: Ingredient;
  x: number;
  y: number;
  radius?: number;
  quantity: number;
  hovered: boolean;
  inFlight: boolean;
  disabled?: boolean;
  /** A sharp copy drawn over the defocused ring: no input, no a11y presence. */
  decorative?: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/**
 * One dish on the ingredient ring, drawn as a real bowl of food seen from
 * above rather than an icon in a card.
 */
export function IngredientTray({
  ingredient,
  x,
  y,
  radius = STAGE.trayRadius,
  quantity,
  hovered,
  inFlight,
  disabled = false,
  decorative = false,
  onHover,
  onSelect,
}: IngredientTrayProps) {
  const accent = CATEGORY_COLORS[ingredient.category];
  const lift = hovered ? 1 : 0;
  const scale = 1 + lift * 0.11;

  // Nobody lays a bench out to the millimetre. A seeded nudge per dish keeps
  // the ring from reading as something a computer drew, and stays identical
  // between the server render and hydration.
  const rand = seededRandom(hashString(ingredient.id) + 404);
  const tilt = (rand() - 0.5) * 13;
  const nudgeX = (rand() - 0.5) * 7;
  const nudgeY = (rand() - 0.5) * 7;

  // Dishes further from the downlight sit deeper in shadow.
  const throwDistance = hypotr(x - LIGHT.x, y - LIGHT.y);
  const falloff = Math.min(1, Math.max(0, (throwDistance - 280) / 560));

  return (
    <g
      className={decorative ? undefined : "tray-hit"}
      role={decorative ? undefined : "button"}
      tabIndex={decorative || disabled ? undefined : 0}
      aria-hidden={decorative ? true : undefined}
      aria-label={
        decorative
          ? undefined
          : `${ingredient.name}, $${ingredient.price.toFixed(2)}${
              quantity > 0 ? `, ${quantity} in your bowl` : ""
            }. Press to have a robot add one.`
      }
      aria-disabled={decorative ? undefined : disabled}
      onMouseEnter={decorative ? undefined : () => onHover(ingredient.id)}
      onMouseLeave={decorative ? undefined : () => onHover(null)}
      onFocus={decorative ? undefined : () => onHover(ingredient.id)}
      onBlur={decorative ? undefined : () => onHover(null)}
      onClick={decorative ? undefined : () => !disabled && onSelect(ingredient.id)}
      onKeyDown={
        decorative
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!disabled) onSelect(ingredient.id);
              }
            }
      }
      style={{ pointerEvents: decorative || disabled ? "none" : "auto" }}
    >
      <g
        transform={`translate(${x} ${y})`}
        style={{
          transition: "transform 260ms cubic-bezier(0.16,1,0.3,1)",
          transform: `translate(${x + nudgeX}px, ${y + nudgeY - lift * 5}px)`,
        }}
      >
        {/* Focus ring for keyboard users. */}
        <circle
          className="tray-focus"
          r={radius + 13}
          fill="none"
          stroke="#FF9A3D"
          strokeWidth="3.5"
          opacity="0"
          style={{ transition: "opacity 160ms ease" }}
        />

        {/* Tray shadow. */}
        <ellipse
          cx={((x - LIGHT.x) / (throwDistance || 1)) * (4 + lift * 6)}
          cy={((y - LIGHT.y) / (throwDistance || 1)) * (4 + lift * 6) + 4}
          rx={radius * (1.02 + lift * 0.08)}
          ry={radius * (0.96 + lift * 0.06)}
          fill="rgba(0,0,0,0.55)"
          style={{ filter: `blur(${6 + lift * 5}px)`, transition: "all 260ms ease" }}
        />

        {/* Dish. */}
        <g
          style={{
            transition: "transform 260ms cubic-bezier(0.16,1,0.3,1)",
            transform: `scale(${scale}) rotate(${tilt}deg)`,
          }}
        >
          <circle r={radius} fill="#1A1513" />
          <circle r={radius} fill="none" stroke="rgba(255,241,222,0.14)" strokeWidth="1.2" />
          <circle r={radius * 0.87} fill="#241D1A" />
          <circle
            r={radius * 0.87}
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth={radius * 0.08}
          />
          {hasPhoto(ingredient) ? (
            <FoodImage
              ingredient={ingredient}
              size={radius * 1.9}
              clipId={`tray-photo-${ingredient.id}${decorative ? "-focus" : ""}`}
            />
          ) : (
            <g clipPath={`url(#tray-clip-${ingredient.id}${decorative ? "-focus" : ""})`}>
              <defs>
                <clipPath id={`tray-clip-${ingredient.id}${decorative ? "-focus" : ""}`}>
                  <circle r={radius * 0.87} />
                </clipPath>
              </defs>
              <FoodArt id={ingredient.id} size={radius * 1.85} density={1} />
            </g>
          )}
          {/* Warm restaurant light falling across the dish, and the shadow
              it sits in once it is a long way from the lamp. */}
          <circle r={radius} fill="url(#tray-light)" style={{ pointerEvents: "none" }} />
          <circle
            r={radius}
            fill="#0B0405"
            opacity={falloff * 0.24 * (1 - lift * 0.75)}
            style={{ pointerEvents: "none", transition: "opacity 260ms ease" }}
          />

          {/* Category collar. */}
          <circle
            r={radius + 5.5}
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            opacity={hovered ? 0.95 : 0.34}
            style={{ transition: "opacity 220ms ease" }}
          />
        </g>

        {/* Hover glow ring. */}
        <circle
          r={radius + 12}
          fill="none"
          stroke="#FF9A3D"
          strokeWidth="2.5"
          opacity={hovered && !inFlight ? 0.85 : 0}
          style={{ transition: "opacity 220ms ease" }}
        />

        {/* A robot is on its way to this tray. */}
        {inFlight ? (
          <>
            <circle
              r={radius + 12}
              fill="none"
              stroke="#FF9A3D"
              strokeWidth="3"
              strokeDasharray="10 12"
              opacity="0.9"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              r={radius + 12}
              fill="none"
              stroke="#FF9A3D"
              strokeWidth="2"
              style={{ animation: "tray-ripple 1.3s ease-out infinite" }}
            />
          </>
        ) : null}

        {/* ADD affordance on hover. */}
        <g
          opacity={hovered && !inFlight ? 1 : 0}
          style={{ transition: "opacity 200ms ease", pointerEvents: "none" }}
          transform={`translate(0 ${-radius - 20})`}
        >
          <rect x="-25" y="-13" width="50" height="26" rx="13" fill="#FF9A3D" />
          <text
            textAnchor="middle"
            y="5"
            fontSize="12.5"
            fontWeight="800"
            fill="#171313"
            letterSpacing="1.2"
            fontFamily="var(--font-sans)"
          >
            ADD
          </text>
        </g>

        {/* Quantity badge with a tick, once it's in the bowl. */}
        {quantity > 0 ? (
          <g transform={`translate(${radius * 0.74} ${-radius * 0.74})`}>
            <circle r="12.5" fill="#6FA83C" stroke="#FFF1DE" strokeWidth="2.2" />
            {quantity === 1 ? (
              <path
                d="M-5 0 L -1.6 3.6 L 5.4 -3.6"
                fill="none"
                stroke="#FFF9F2"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <text
                textAnchor="middle"
                y="4.8"
                fontSize="13"
                fontWeight="800"
                fill="#FFF9F2"
                fontFamily="var(--font-sans)"
              >
                {quantity}
              </text>
            )}
          </g>
        ) : null}
      </g>
    </g>
  );
}
