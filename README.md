# RoPot Hotpot

A takeaway hotpot site whose centrepiece is a bird's-eye ingredient station:
click a dish, one of two robotic arms turns, reaches, grips a portion, carries
it to the bowl and drops it in. The bowl fills, the price counts up.

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3210.

## The five brand images

Save them into `public/images/ropot/` — see the README in that folder for the
exact filenames. Until they're there, every image slot renders an on-brand red
panel with the RoPot mark, so nothing looks broken.

## How the robot picker works

| Piece | File |
| --- | --- |
| Stage geometry + inverse kinematics | `lib/geometry.ts` |
| Motion state machine, queue, arm assignment | `hooks/useRobotQueue.ts` |
| The bird's-eye scene | `components/order/RobotStage.tsx` |
| One arm (writes joint transforms directly to the DOM) | `components/order/RobotArm.tsx` |
| The ring of dishes | `components/order/IngredientWheel.tsx`, `IngredientTray.tsx` |
| The bowl, broth and pile | `components/order/HotpotBowl.tsx` |
| 24 hand-drawn ingredient renderers | `components/food/FoodArt.tsx` |

The stage is a 1000×1000 SVG. The bowl sits at the centre, the two arms are
mounted above and below it, and 24 dishes sit on a ring at radius 355.

A pick runs through eight timed steps (`TIMELINE` in `useRobotQueue.ts`), about
1.85 seconds end to end:

```
movingToIngredient → descending → picking → lifting
→ movingToBowl → dropping (lower) → dropping (open) → returning
```

Each frame the engine eases the end-effector along a polar path around the arm
base, then solves two-link IK for the shoulder, elbow and wrist. React never
re-renders during a pick — `RobotArm` writes `transform` attributes straight to
the DOM from a `requestAnimationFrame` loop, and only the status line and the
order state go through React.

If both arms are busy, jobs queue and a chip shows the depth. Arms alternate
where both can reach a tray, and never target the same tray at once.

With `prefers-reduced-motion`, the arms stay parked and the portion transfers
with a short fade instead.

## Making the station read as footage

The picker is a simulation of the real bench, dressed to look like something a
camera is pointed at. Two pieces do that work.

`StationViewport` is everything between the viewer and the scene: film grain
that crawls, warm haze drifting through, a lens vignette, auto-exposure
breathing, a defocused plate of the real room behind the bench, and the corner
tally. The tally deliberately reads **"Live preview"**, not "Live" — nobody
should think they are watching a camera in the shop.

Inside the SVG, everything physical derives from one constant: `LIGHT` in
`lib/geometry.ts`, the downlight above the bench.

- Arms and dishes cast shadows *away from* that point, stretching as they lift.
- A highlight slides across each arm segment as its angle to the lamp changes.
- Dishes further from the lamp sit deeper in shadow.
- The gripper picks up a warm kick when it passes over the broth.

Add to that: a handheld camera drift (`useCameraDrift` in `RobotStage`),
depth of field with a focus pull onto whatever you point at, two motion-blur
ghosts trailing each arm scaled by how fast it is moving, a seeded nudge and
tilt on every dish so the ring is not machine-perfect, and a ripple where a
portion breaks the surface of the broth.

### The arms are photographs

`data/arm-sprites.ts` places four keyed photographs — upper arm, forearm and
the gripper open and closed — onto the joints the solver produces. Because the
camera looks straight down, rotating a top-down segment about its joint is
geometrically correct, so the arms move exactly as they did but out of
photographs. The gripper is a crossfade between its open and closed frames.

The placements are derived from where the dark joint housings actually sit in
each image. If the segments are ever re-shot, nudge those numbers; set
`available: false` and it falls straight back to the drawn arm.

### The camera

`CAMERA` in `RobotStage.tsx` sets where it sits: pulled back to 0.82 so the
bench does not fill the frame, and nudged off centre, because nobody mounts a
camera perfectly over anything. Both matter more than they sound — a subject
that fills the viewport edge to edge reads as a diagram, and one that is
perfectly centred reads as a drawing.

The room bleeds `BLEED` units past the stage so the wider view stays covered.

### The room

The bench stands on a photographed floor (`public/images/room/floor.jpg`), and
`PassersBy` sends someone across it every twenty seconds or so. They are shot
from overhead like everything else, rendered soft because they sit below the
bench's focal plane, and drawn *before* the bench so it occludes them as they
pass behind it.

Their motion uses SMIL `animateMotion`, which runs on the document timeline —
so each one is started explicitly with `beginElement()` on mount, or a walker
added a minute in would start a minute along its path.

They need to be legible: blurred as hard as the bench and darkened, they read
as a smudge in the corner rather than as a person. Set `PASSERS_BY_ENABLED`
to `false` in `PassersBy.tsx` to clear the floor entirely.

### The food

All twenty-four ingredients are photographs, in `public/images/ingredients/`
named by ingredient id. Most were generated six at a time as grid sheets and
cut up with `scripts/slice-sheet.py`, then reduced to just the food with
`scripts/crop-to-food.py` — the station draws its own dish under every tray,
so a photo that still had its own rim in it came out as a dish inside a dish
with the food shrunk into the middle.

`FoodThumb` and `FoodPortion` pick the photograph when one exists and fall
back to the drawn art otherwise, so a partly-shot set still looks deliberate.
Portions in the bowl use a soft-edged mask: a hard circular crop reads as a
coin floating on the broth.

## Order state

`hooks/useOrder.tsx` — a reducer in context, persisted to `localStorage` under
`ropot.order.v1`. Persistence is deliberately gated behind hydration so the
first render can't overwrite a saved draft with an empty one.

## Adding an ingredient

Add an entry to `SEEDS` in `data/ingredients.ts` with a free ring `slot`
(0–23, 0 is 12 o'clock, clockwise), then add a renderer with the same `id` to
`renderers` in `components/food/FoodArt.tsx`. Everything else — the ring, the
menu page, the bowl, voice matching — picks it up automatically.

To use a photograph instead of the drawn art, drop a square image in
`public/images/ingredients/` and set `image` on the ingredient.

## Development scripts

These need the dev server running.

```bash
node scripts/shot.mjs /order shot.png 1440 900   # screenshot any page
node scripts/pick-test.mjs /tmp                  # capture a full pick cycle
node scripts/behaviour-test.mjs /tmp             # queueing, keyboard, reduced motion, checkout
```

## Notes

- Checkout is simulated. No payment is processed and no order is sent anywhere.
- The site claims robots select and portion ingredients and run the floor.
  It does not claim they cook — that copy is deliberate, keep it that way.
