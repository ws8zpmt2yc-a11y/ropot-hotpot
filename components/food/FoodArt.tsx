import { seededRandom, hashString, cosr, sinr } from "@/lib/geometry";

/**
 * Ingredient art. Every renderer draws inside a 100x100 box centred on (0,0),
 * so the same drawing works as a tray of food, the portion in the gripper and
 * the pile in the bowl — only the scale changes.
 *
 * If an ingredient has a real photograph, `FoodArt` is bypassed by the caller.
 */

type Renderer = (rand: () => number, density: number) => React.ReactNode;

const rot = (index: number, count: number, spread = 360) =>
  (index * spread) / count;

/* ---------------- Meat ---------------- */

function beefRolls(
  rand: () => number,
  density: number,
  fill: string,
  marbleOpacity: number,
) {
  const count = Math.max(3, Math.round(5 * density));
  return Array.from({ length: count }).map((_, i) => {
    const a = rot(i, count, 300) + rand() * 16 - 8;
    const r = 16 + rand() * 12;
    const x = cosr((a * Math.PI) / 180) * r;
    const y = sinr((a * Math.PI) / 180) * r * 0.72;
    const scale = 0.86 + rand() * 0.3;
    return (
      <g key={i} transform={`translate(${x} ${y}) rotate(${a * 0.5}) scale(${scale})`}>
        <ellipse rx="19" ry="12" fill="rgba(0,0,0,0.22)" transform="translate(1 2.5)" />
        <ellipse rx="19" ry="12" fill={fill} />
        <path
          d="M-13 -4 C -6 -8, 6 -8, 13 -3"
          fill="none"
          stroke="#FFF4EE"
          strokeOpacity={marbleOpacity}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M-12 2 C -5 -1, 5 -1, 12 4"
          fill="none"
          stroke="#FFF4EE"
          strokeOpacity={marbleOpacity * 0.8}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M-8 7 C -3 5, 4 5, 9 8"
          fill="none"
          stroke="#FFF4EE"
          strokeOpacity={marbleOpacity * 0.55}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <ellipse rx="19" ry="12" fill="url(#fa-gloss)" />
      </g>
    );
  });
}

const renderers: Record<string, Renderer> = {
  "wagyu-beef": (rand, d) => <>{beefRolls(rand, d, "url(#fa-wagyu)", 0.85)}</>,

  "sliced-beef": (rand, d) => <>{beefRolls(rand, d, "url(#fa-beef)", 0.55)}</>,

  lamb: (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = -50 + rot(i, count, 100);
          return (
            <g key={i} transform={`rotate(${a}) translate(0 -20)`}>
              <path
                d="M-15 -12 C -8 -20, 8 -20, 15 -12 L 13 14 C 6 20, -6 20, -13 14 Z"
                fill="url(#fa-lamb)"
                stroke="#A9414D"
                strokeWidth="0.8"
              />
              <path
                d="M-9 -8 C -3 -12, 4 -11, 9 -6"
                fill="none"
                stroke="#FFF2F0"
                strokeOpacity="0.65"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M-8 3 C -2 0, 4 1, 9 6"
                fill="none"
                stroke="#FFF2F0"
                strokeOpacity="0.45"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </>
    );
  },

  "pork-belly": (rand, d) => {
    const count = Math.max(3, Math.round(4 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const y = -22 + i * (44 / Math.max(1, count - 1));
          const w = 34 - Math.abs(y) * 0.24;
          return (
            <g key={i} transform={`translate(0 ${y}) rotate(${rand() * 8 - 4})`}>
              <rect x={-w} y={-8} width={w * 2} height={16} rx={8} fill="url(#fa-pork)" />
              <rect x={-w + 3} y={-4.5} width={w * 2 - 6} height={3} rx={1.5} fill="#FFF6F1" opacity="0.85" />
              <rect x={-w + 3} y={1} width={w * 2 - 6} height={2.6} rx={1.3} fill="#D9736F" opacity="0.6" />
              <rect x={-w} y={-8} width={w * 2} height={16} rx={8} fill="url(#fa-gloss)" />
            </g>
          );
        })}
      </>
    );
  },

  chicken: (rand, d) => {
    const count = Math.max(4, Math.round(7 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count) + rand() * 20;
          const r = 8 + rand() * 22;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${rand() * 90})`}
            >
              <path
                d="M-13 -7 C -6 -13, 9 -12, 13 -4 C 16 4, 6 12, -3 11 C -12 10, -17 1, -13 -7 Z"
                fill="url(#fa-chicken)"
                stroke="#CBA372"
                strokeWidth="0.7"
              />
              <path
                d="M-7 -2 C -2 -5, 4 -4, 7 0"
                fill="none"
                stroke="#FFFBF2"
                strokeWidth="1.6"
                strokeOpacity="0.8"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </>
    );
  },

  /* ---------------- Seafood ---------------- */

  prawns: (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 340) + rand() * 12;
          const r = 13 + rand() * 12;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.75
              }) rotate(${a}) scale(0.98)`}
            >
              {/* Curled body, thick at the head and tapering to the tail. */}
              <path
                d="M-13 3 C -17 -8, -7 -17, 4 -15 C 14 -13, 19 -3, 15 6 C 12 13, 3 16, -2 12 C -6 9, -6 4, -3 2"
                fill="none"
                stroke="url(#fa-prawn)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <path
                d="M-13 3 C -17 -8, -7 -17, 4 -15 C 14 -13, 19 -3, 15 6"
                fill="none"
                stroke="#FFC7A6"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.55"
              />
              {/* Shell segments. */}
              {[0, 1, 2, 3].map((k) => {
                const t = 0.18 + k * 0.2;
                const ang = -110 + t * 220;
                const rad = (ang * Math.PI) / 180;
                return (
                  <path
                    key={k}
                    d={`M${cosr(rad) * 10} ${sinr(rad) * 10 - 2} L ${
                      cosr(rad) * 17
                    } ${sinr(rad) * 17 - 2}`}
                    stroke="#C9482A"
                    strokeOpacity="0.5"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Tail fan. */}
              <path
                d="M-14 4 l -7 -6 l 2 6 l -6 4 l 9 1 Z"
                fill="#E2603C"
                stroke="#B93E22"
                strokeWidth="0.7"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </>
    );
  },

  fish: (rand, d) => {
    const count = Math.max(3, Math.round(4 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = -40 + rot(i, count, 80);
          return (
            <g key={i} transform={`rotate(${a}) translate(0 -16) rotate(${rand() * 10 - 5})`}>
              <path
                d="M-20 -10 L 18 -13 C 23 -8, 23 8, 18 12 L -20 9 C -24 4, -24 -5, -20 -10 Z"
                fill="url(#fa-fish)"
                stroke="#D89C89"
                strokeWidth="0.8"
              />
              {[-5, 0, 5].map((yy) => (
                <path
                  key={yy}
                  d={`M-16 ${yy} C -5 ${yy - 2.5}, 6 ${yy + 2}, 16 ${yy}`}
                  fill="none"
                  stroke="#E8A692"
                  strokeOpacity="0.7"
                  strokeWidth="1.3"
                />
              ))}
            </g>
          );
        })}
      </>
    );
  },

  squid: (rand, d) => {
    const rings = Math.max(3, Math.round(4 * d));
    const slabs = Math.max(1, Math.round(2 * d));
    return (
      <>
        {/* Diamond-scored pieces, so squid never reads as another white ball. */}
        {Array.from({ length: slabs }).map((_, i) => {
          const a = 20 + rot(i, Math.max(1, slabs), 200) + rand() * 20;
          const r = 14 + rand() * 10;
          return (
            <g
              key={`slab-${i}`}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${a * 0.5})`}
            >
              <path
                d="M-16 -11 C -8 -15, 9 -15, 16 -10 C 19 -3, 18 5, 14 11 C 5 15, -7 15, -15 10 C -19 4, -19 -4, -16 -11 Z"
                fill="url(#fa-squid)"
                stroke="#C2B5A4"
                strokeWidth="0.9"
              />
              {[-1, 0, 1].map((k) => (
                <g key={k}>
                  <path
                    d={`M${-12 + k * 7} -9 L ${2 + k * 7} 9`}
                    stroke="#CBBFAF"
                    strokeWidth="1.1"
                    strokeOpacity="0.9"
                  />
                  <path
                    d={`M${2 + k * 7} -9 L ${-12 + k * 7} 9`}
                    stroke="#CBBFAF"
                    strokeWidth="1.1"
                    strokeOpacity="0.9"
                  />
                </g>
              ))}
            </g>
          );
        })}

        {/* Rings, with a genuine hole through the middle. */}
        {Array.from({ length: rings }).map((_, i) => {
          const a = 180 + rot(i, rings, 200) + rand() * 18;
          const r = 12 + rand() * 18;
          const rr = 8.5 + rand() * 3;
          return (
            <g
              key={`ring-${i}`}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              })`}
            >
              <circle r={rr} fill="rgba(0,0,0,0.24)" cy="2" />
              <path
                d={`M${-rr} 0 a ${rr} ${rr} 0 1 0 ${rr * 2} 0 a ${rr} ${rr} 0 1 0 ${
                  -rr * 2
                } 0 Z M${-rr * 0.44} 0 a ${rr * 0.44} ${rr * 0.44} 0 1 1 ${
                  rr * 0.88
                } 0 a ${rr * 0.44} ${rr * 0.44} 0 1 1 ${-rr * 0.88} 0 Z`}
                fillRule="evenodd"
                fill="url(#fa-squid)"
                stroke="#BFB2A1"
                strokeWidth="0.8"
              />
            </g>
          );
        })}
      </>
    );
  },

  "fish-balls": (rand, d) => {
    const count = Math.max(4, Math.round(7 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count) + rand() * 18;
          const r = i === 0 ? 0 : 12 + rand() * 18;
          const rr = 9 + rand() * 3;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              })`}
            >
              <circle r={rr} cy={2} fill="rgba(0,0,0,0.2)" />
              <circle r={rr} fill="url(#fa-white-ball)" />
              <circle r={rr} fill="url(#fa-gloss)" />
              <ellipse cx={-rr * 0.3} cy={-rr * 0.35} rx={rr * 0.3} ry={rr * 0.2} fill="#fff" opacity="0.7" />
            </g>
          );
        })}
      </>
    );
  },

  /* ---------------- Vegetables ---------------- */

  "bok-choy": (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 330) + rand() * 14;
          return (
            <g key={i} transform={`rotate(${a}) translate(0 -18)`}>
              <path
                d="M-9 16 C -11 4, -10 -6, 0 -8 C 10 -6, 11 4, 9 16 Z"
                fill="url(#fa-stem)"
                stroke="#C4D49A"
                strokeWidth="0.7"
              />
              <path
                d="M0 -6 C -14 -12, -19 -26, -10 -32 C -3 -36, 2 -30, 0 -22 C -2 -30, 3 -36, 10 -32 C 19 -26, 14 -12, 0 -6 Z"
                fill="url(#fa-leaf)"
              />
              <path
                d="M0 -8 L 0 -26"
                stroke="#DFF0C0"
                strokeOpacity="0.7"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </>
    );
  },

  "chinese-cabbage": (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 340) + rand() * 12;
          return (
            <g key={i} transform={`rotate(${a}) translate(0 -20) rotate(${rand() * 8})`}>
              <path
                d="M-14 18 C -18 2, -14 -14, 0 -18 C 14 -14, 18 2, 14 18 Z"
                fill="#F4F6DC"
                stroke="#D5DFA8"
                strokeWidth="0.8"
              />
              <path
                d="M-13 -2 C -17 -14, -8 -24, 0 -22 C 8 -24, 17 -14, 13 -2 Z"
                fill="#B7D172"
                opacity="0.95"
              />
              <path
                d="M-9 -8 C -12 -16, -5 -21, 0 -20 C 5 -21, 12 -16, 9 -8 Z"
                fill="#8FBB4C"
                opacity="0.9"
              />
              {[-6, 0, 6].map((xx) => (
                <path
                  key={xx}
                  d={`M${xx} 16 C ${xx * 1.1} 4, ${xx * 1.1} -8, ${xx * 0.6} -18`}
                  fill="none"
                  stroke="#E4EDC4"
                  strokeWidth="1.2"
                  strokeOpacity="0.8"
                />
              ))}
            </g>
          );
        })}
      </>
    );
  },

  broccoli: (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 330) + rand() * 14;
          const r = 12 + rand() * 14;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${a * 0.4})`}
            >
              <path d="M-4 4 L -3 16 L 3 16 L 4 4 Z" fill="#C6DA9A" stroke="#A6BE79" strokeWidth="0.7" />
              <circle r="14" cy="-3" fill="url(#fa-leaf-deep)" />
              {Array.from({ length: 9 }).map((__, k) => {
                const ang = (k / 9) * Math.PI * 2;
                return (
                  <circle
                    key={k}
                    cx={cosr(ang) * 8}
                    cy={-3 + sinr(ang) * 8}
                    r={4.4}
                    fill="#4F8C25"
                    opacity={0.9}
                  />
                );
              })}
              <circle cx="-4" cy="-8" r="3.4" fill="#7FB84A" opacity="0.85" />
            </g>
          );
        })}
      </>
    );
  },

  corn: (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 340) + rand() * 14;
          const r = i === 0 ? 0 : 15 + rand() * 14;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              })`}
            >
              <circle r="13" cy="2" fill="rgba(0,0,0,0.2)" />
              <circle r="13" fill="url(#fa-corn)" />
              <circle r="5" fill="#FFF3C8" opacity="0.9" />
              {Array.from({ length: 14 }).map((__, k) => {
                const ang = (k / 14) * Math.PI * 2;
                const rr = k % 2 === 0 ? 9 : 7;
                return (
                  <circle
                    key={k}
                    cx={cosr(ang) * rr}
                    cy={sinr(ang) * rr}
                    r="2.5"
                    fill="#FFF0AE"
                    opacity="0.95"
                  />
                );
              })}
              <circle r="13" fill="url(#fa-gloss)" />
            </g>
          );
        })}
      </>
    );
  },

  spinach: (rand, d) => {
    const count = Math.max(4, Math.round(7 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count) + rand() * 18;
          const r = 8 + rand() * 20;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${a})`}
            >
              <path
                d="M0 -16 C 12 -10, 14 6, 0 16 C -14 6, -12 -10, 0 -16 Z"
                fill="url(#fa-leaf-deep)"
              />
              <path d="M0 -14 L 0 14" stroke="#B8DC86" strokeWidth="1.2" strokeOpacity="0.7" />
              {[-8, -2, 4].map((yy) => (
                <g key={yy}>
                  <path d={`M0 ${yy} L 7 ${yy + 5}`} stroke="#9FCF6A" strokeWidth="0.9" strokeOpacity="0.6" />
                  <path d={`M0 ${yy} L -7 ${yy + 5}`} stroke="#9FCF6A" strokeWidth="0.9" strokeOpacity="0.6" />
                </g>
              ))}
            </g>
          );
        })}
      </>
    );
  },

  /* ---------------- Mushrooms ---------------- */

  enoki: (rand, d) => {
    const bundles = Math.max(2, Math.round(3 * d));
    return (
      <>
        {Array.from({ length: bundles }).map((_, b) => {
          const a = rot(b, bundles, 300) + rand() * 20 - 10;
          return (
            <g key={b} transform={`rotate(${a}) translate(0 -8)`}>
              {Array.from({ length: 9 }).map((__, k) => {
                const x = -14 + k * 3.5 + rand() * 1.2;
                const len = 24 + rand() * 8;
                return (
                  <g key={k}>
                    <path
                      d={`M${x} 22 C ${x + 1.5} 8, ${x - 1.5} ${22 - len + 6}, ${x} ${22 - len}`}
                      stroke="#FBF6E6"
                      strokeWidth="2.6"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M${x} 22 C ${x + 1.5} 8, ${x - 1.5} ${22 - len + 6}, ${x} ${22 - len}`}
                      stroke="#E4DAC2"
                      strokeWidth="0.9"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                    <ellipse cx={x} cy={22 - len} rx="3.1" ry="2.4" fill="#FFFDF6" stroke="#DCD1B8" strokeWidth="0.6" />
                  </g>
                );
              })}
            </g>
          );
        })}
      </>
    );
  },

  shiitake: (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 330) + rand() * 16;
          const r = i === 0 ? 0 : 16 + rand() * 12;
          const rr = 13 + rand() * 3;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${rand() * 90})`}
            >
              <circle r={rr} cy="2.5" fill="rgba(0,0,0,0.26)" />
              <circle r={rr} fill="url(#fa-shiitake)" />
              <path
                d={`M0 ${-rr * 0.62} L 0 ${rr * 0.62} M ${-rr * 0.62} 0 L ${rr * 0.62} 0`}
                stroke="#F3E3CA"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity="0.92"
              />
              <path
                d={`M${-rr * 0.4} ${-rr * 0.4} L ${rr * 0.4} ${rr * 0.4} M ${rr * 0.4} ${-rr * 0.4} L ${-rr * 0.4} ${rr * 0.4}`}
                stroke="#F3E3CA"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <circle r={rr} fill="url(#fa-gloss)" />
            </g>
          );
        })}
      </>
    );
  },

  "oyster-mushroom": (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 340) + rand() * 16;
          const r = 10 + rand() * 18;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${a * 0.5})`}
            >
              <path
                d="M0 12 C -16 12, -20 -2, -12 -10 C -5 -17, 8 -17, 14 -9 C 20 -1, 15 12, 0 12 Z"
                fill="url(#fa-oyster)"
                stroke="#9C866C"
                strokeWidth="0.7"
              />
              {[-8, -4, 0, 4, 8].map((xx) => (
                <path
                  key={xx}
                  d={`M${xx * 0.4} 11 C ${xx * 0.8} 2, ${xx} -4, ${xx * 1.25} -12`}
                  stroke="#8E7961"
                  strokeWidth="0.9"
                  strokeOpacity="0.55"
                  fill="none"
                />
              ))}
            </g>
          );
        })}
      </>
    );
  },

  /* ---------------- Noodles ---------------- */

  udon: (rand, d) => {
    const count = Math.max(5, Math.round(9 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const y = -22 + (i * 44) / Math.max(1, count - 1);
          const w = 30 - Math.abs(y) * 0.2;
          return (
            <path
              key={i}
              d={`M${-w} ${y} C ${-w / 2} ${y - 7 - rand() * 3}, ${w / 2} ${y + 7 + rand() * 3}, ${w} ${y}`}
              stroke="url(#fa-udon)"
              strokeWidth="7.5"
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
      </>
    );
  },

  ramen: (rand, d) => {
    const count = Math.max(7, Math.round(13 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const y = -24 + (i * 48) / Math.max(1, count - 1);
          const w = 31 - Math.abs(y) * 0.2;
          return (
            <path
              key={i}
              d={`M${-w} ${y} C ${-w / 2} ${y - 6 - rand() * 4}, ${w / 2} ${y + 6 + rand() * 4}, ${w} ${y}`}
              stroke="url(#fa-ramen)"
              strokeWidth="3.6"
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
      </>
    );
  },

  "glass-noodles": (rand, d) => {
    const count = Math.max(8, Math.round(15 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const y = -24 + (i * 48) / Math.max(1, count - 1);
          const w = 31 - Math.abs(y) * 0.2;
          return (
            <path
              key={i}
              d={`M${-w} ${y} C ${-w / 2} ${y - 8 - rand() * 4}, ${w / 2} ${y + 8 + rand() * 4}, ${w} ${y}`}
              stroke="#F2EFE4"
              strokeOpacity="0.82"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
      </>
    );
  },

  /* ---------------- Other ---------------- */

  tofu: (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 330) + rand() * 16;
          const r = i === 0 ? 0 : 16 + rand() * 12;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${rand() * 40 - 20})`}
            >
              <rect x="-13" y="-11" width="26" height="22" rx="3" fill="rgba(0,0,0,0.2)" transform="translate(1 2.5)" />
              <rect x="-13" y="-11" width="26" height="22" rx="3" fill="url(#fa-tofu)" stroke="#DCCFAE" strokeWidth="0.8" />
              <rect x="-13" y="-11" width="26" height="8" rx="3" fill="#FFFFFF" opacity="0.5" />
            </g>
          );
        })}
      </>
    );
  },

  dumplings: (rand, d) => {
    const count = Math.max(3, Math.round(5 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 330) + rand() * 14;
          const r = i === 0 ? 0 : 17 + rand() * 11;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${a * 0.4 + rand() * 20})`}
            >
              <path
                d="M-15 4 C -15 -10, 15 -10, 15 4 C 15 12, -15 12, -15 4 Z"
                fill="rgba(0,0,0,0.2)"
                transform="translate(1 2.5)"
              />
              <path
                d="M-15 4 C -15 -10, 15 -10, 15 4 C 15 12, -15 12, -15 4 Z"
                fill="url(#fa-dumpling)"
                stroke="#D3B784"
                strokeWidth="0.8"
              />
              {[-10, -5, 0, 5, 10].map((xx) => (
                <path
                  key={xx}
                  d={`M${xx} 8 C ${xx + 1} 1, ${xx - 1} -3, ${xx} -7`}
                  stroke="#CFB283"
                  strokeWidth="1.1"
                  strokeOpacity="0.75"
                  fill="none"
                />
              ))}
              <ellipse cx="-4" cy="-3" rx="6" ry="2.6" fill="#FFFDF4" opacity="0.6" />
            </g>
          );
        })}
      </>
    );
  },

  "tofu-puffs": (rand, d) => {
    const count = Math.max(3, Math.round(6 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 340) + rand() * 16;
          const r = i === 0 ? 0 : 15 + rand() * 13;
          const s = 0.85 + rand() * 0.3;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              }) rotate(${rand() * 50}) scale(${s})`}
            >
              <path
                d="M-12 -12 C -4 -15, 6 -15, 12 -11 C 15 -4, 15 5, 11 12 C 4 15, -5 15, -12 11 C -15 4, -15 -5, -12 -12 Z"
                fill="url(#fa-puff)"
                stroke="#A96C24"
                strokeWidth="0.8"
              />
              {[[-5, -4], [4, -6], [6, 3], [-4, 5], [0, 0]].map(([cx, cy], k) => (
                <circle key={k} cx={cx} cy={cy} r="2.2" fill="#B87A31" opacity="0.5" />
              ))}
              <path d="M-10 -8 C -4 -11, 3 -11, 8 -9" stroke="#FFE3B4" strokeWidth="2" strokeOpacity="0.6" fill="none" strokeLinecap="round" />
            </g>
          );
        })}
      </>
    );
  },

  meatballs: (rand, d) => {
    const count = Math.max(3, Math.round(6 * d));
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const a = rot(i, count, 340) + rand() * 16;
          const r = i === 0 ? 0 : 15 + rand() * 13;
          const rr = 11 + rand() * 3;
          return (
            <g
              key={i}
              transform={`translate(${cosr((a * Math.PI) / 180) * r} ${
                sinr((a * Math.PI) / 180) * r * 0.8
              })`}
            >
              <circle r={rr} cy="2.5" fill="rgba(0,0,0,0.24)" />
              <circle r={rr} fill="url(#fa-meatball)" />
              {Array.from({ length: 6 }).map((__, k) => {
                const ang = rand() * Math.PI * 2;
                const rad = rand() * rr * 0.6;
                return (
                  <circle
                    key={k}
                    cx={cosr(ang) * rad}
                    cy={sinr(ang) * rad}
                    r="1.6"
                    fill="#6E3A24"
                    opacity="0.45"
                  />
                );
              })}
              <circle r={rr} fill="url(#fa-gloss)" />
              <ellipse cx={-rr * 0.3} cy={-rr * 0.35} rx={rr * 0.28} ry={rr * 0.18} fill="#fff" opacity="0.55" />
            </g>
          );
        })}
      </>
    );
  },
};

export interface FoodArtProps {
  id: string;
  /** Width/height of the drawing in stage units. */
  size: number;
  /** How much food to draw. 1 = full tray, ~0.35 = a single portion. */
  density?: number;
  /** Extra entropy so two portions of the same thing don't look identical. */
  seed?: number;
  opacity?: number;
}

/** Draws an ingredient centred on (0,0) of the parent SVG group. */
export function FoodArt({
  id,
  size,
  density = 1,
  seed = 0,
  opacity = 1,
}: FoodArtProps) {
  const renderer = renderers[id];
  const scale = size / 100;
  const rand = seededRandom(hashString(id) + seed * 7919);

  if (!renderer) {
    return (
      <g transform={`scale(${scale})`} opacity={opacity}>
        <circle r="26" fill="#D9CBB4" />
      </g>
    );
  }

  return (
    <g transform={`scale(${scale})`} opacity={opacity}>
      {renderer(rand, density)}
    </g>
  );
}

export const hasFoodArt = (id: string): boolean => Boolean(renderers[id]);
