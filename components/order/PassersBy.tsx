"use client";

import { asset } from "@/lib/asset";
import { useEffect, useRef, useState } from "react";
import { seededRandom } from "@/lib/geometry";

/**
 * People crossing the floor around the bench, every so often.
 *
 * They are photographed from directly overhead like everything else, and they
 * walk on the floor rather than on the station — so the bench, which is drawn
 * after this layer, occludes them as they pass behind it. They sit below the
 * bench's focal plane, so they are rendered soft.
 */
const PEOPLE = [asset("/images/room/person-a.png"), asset("/images/room/person-b.png")];

/** Set to false to clear the floor of people entirely. */
export const PASSERS_BY_ENABLED = true;

/** Routes that hug the edges of frame, where the floor is actually visible. */
const ROUTES = [
  { from: { x: -160, y: 130 }, to: { x: 1160, y: 250 } },
  { from: { x: 130, y: -160 }, to: { x: 250, y: 1160 } },
  { from: { x: 1160, y: 880 }, to: { x: -160, y: 760 } },
  { from: { x: 880, y: 1160 }, to: { x: 760, y: -160 } },
  { from: { x: -160, y: 820 }, to: { x: 1160, y: 640 } },
  { from: { x: 820, y: -160 }, to: { x: 640, y: 1160 } },
];

interface Walker {
  key: number;
  href: string;
  path: string;
  duration: number;
  height: number;
  width: number;
}

export function PassersBy({ enabled = true }: { enabled?: boolean }) {
  const on = enabled && PASSERS_BY_ENABLED;
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const nextKey = useRef(0);

  useEffect(() => {
    if (!on) {
      setWalkers([]);
      return;
    }

    let timer = 0;
    const spawn = () => {
      const key = (nextKey.current += 1);
      // Seeded from the key so a walker's look is stable for its whole trip.
      const rand = seededRandom(key * 7919 + 13);
      const route = ROUTES[Math.floor(rand() * ROUTES.length)];
      const href = PEOPLE[Math.floor(rand() * PEOPLE.length)];
      const height = 210 + rand() * 70;
      const duration = 8000 + rand() * 5000;

      setWalkers((prev) => [
        ...prev,
        {
          key,
          href,
          duration,
          height,
          width: height * 0.72,
          path: `M ${route.from.x} ${route.from.y} L ${route.to.x} ${route.to.y}`,
        },
      ]);
      window.setTimeout(
        () => setWalkers((prev) => prev.filter((w) => w.key !== key)),
        duration + 400,
      );

      // Somewhere between a quarter and half a minute until the next one.
      timer = window.setTimeout(spawn, 15000 + Math.random() * 14000);
    };

    timer = window.setTimeout(spawn, 5000);
    return () => window.clearTimeout(timer);
  }, [on]);

  if (!on) return null;

  return (
    <g style={{ pointerEvents: "none" }} filter="url(#dof-floor)" opacity="0.92">
      {walkers.map((walker) => (
        <g key={walker.key}>
          {/* SMIL runs on the document timeline, so an element added a minute
              in would otherwise start a minute along its path — or already be
              finished. Start it explicitly when it mounts instead. */}
          <animateMotion
            ref={(node: SVGAnimateMotionElement | null) => {
              node?.beginElement();
            }}
            path={walker.path}
            dur={`${walker.duration}ms`}
            rotate="auto"
            fill="freeze"
            begin="indefinite"
            repeatCount="1"
          />
          {/* The source photographs walk down the frame; rotating by a quarter
              turn puts that direction along +x, which is the axis animateMotion
              aligns to the path. */}
          <g transform="rotate(-90)">
            <ellipse
              cx={0}
              cy={walker.height * 0.06}
              rx={walker.width * 0.42}
              ry={walker.height * 0.36}
              fill="#000"
              opacity="0.3"
              style={{ filter: "blur(9px)" }}
            />
            <image
              href={walker.href}
              x={-walker.width / 2}
              y={-walker.height / 2}
              width={walker.width}
              height={walker.height}
              preserveAspectRatio="xMidYMid meet"
              style={{ filter: "brightness(0.88) saturate(0.95)" }}
            />
          </g>
        </g>
      ))}
    </g>
  );
}
