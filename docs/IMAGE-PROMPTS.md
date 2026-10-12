# ChatGPT image prompts for RoPot

Four jobs, in order of how much they improve the site.

## 0. The arm segments  <- the only way to make the robot itself photoreal

The arms move, so they cannot be a generated animation: image generation will
not keep an arm identical from pose to pose and the motion would jitter. What
does work is compositing **photoreal segments** onto the kinematics the site
already calculates. Because the camera looks straight down, rotating a
top-down segment in place is geometrically correct.

Four images, each on chroma green so the background can be keyed out cleanly
(a white arm on white or black cannot be separated):

**0a. Upper arm segment**

> Top-down product photograph, camera directly overhead at exactly 90 degrees,
> of a single straight segment of a white industrial collaborative robot arm,
> isolated on a pure chroma key green background (#00FF00). Matte white
> plastic shell with a subtle grey seam along its length, dark grey end
> joints, one small red accent ring. Horizontal, running left to right,
> filling the frame edge to edge. Soft neutral studio lighting from the upper
> left. No shadow falling on the green background. Photorealistic, sharp. No
> text, no logos, no background objects.

**0b. Forearm segment** — same wording, but *"a slightly shorter and thinner
straight segment"*.

**0c. Gripper, jaws open** — same wording, but *"a two-finger robotic gripper
with its jaws open, seen from directly above, mounted on a short wrist
plate"*.

**0d. Gripper, jaws closed** — same again, *"with its jaws closed together"*.

Save into `public/images/arm/` as `upper.png`, `fore.png`, `gripper-open.png`
and `gripper-closed.png`. I key out the green, slice them to the joint
positions, and swap them in behind the existing IK — the arms keep moving
exactly as they do now, but out of photographs.

**Before you start:** attach the five existing RoPot images to the ChatGPT chat
and say *"match the lighting and colour of these."* It keeps everything in one
world. Generate one image per message — don't ask for several at once.

---

## 1. The 24 ingredient dishes  ← biggest win

These replace the drawn food on the ring. They composite perfectly because
each one is a self-contained circle I drop straight onto the existing layout.

**The template.** Replace the bold part each time:

> Top-down photograph, camera directly overhead at exactly 90 degrees, of a
> single round matte-black ceramic restaurant dish holding a fresh portion of
> **thinly sliced marbled wagyu beef, rolled into neat rosettes**. The dish is
> perfectly centred and perfectly circular in frame, filling about 90% of the
> image width. Plain matte black background, no table, no props, no hands, no
> other dishes. Warm amber restaurant lighting from the upper left, soft
> shadow under the dish, glossy and fresh, premium hotpot restaurant
> photography. Square 1:1 crop. Sharp focus across the whole dish. No text, no
> logos, no watermarks.

**The 24 fill-ins:**

| # | Replace the bold part with |
|---|---|
| 1 | thinly sliced marbled wagyu beef, rolled into neat rosettes |
| 2 | thinly sliced beef, rolled into loose curls |
| 3 | shaved lamb shoulder, fanned in overlapping slices |
| 4 | sliced pork belly showing clear layers of meat and fat |
| 5 | sliced raw chicken thigh, pale and glossy |
| 6 | whole raw tiger prawns, curled, shells on |
| 7 | thick raw barramundi fillet slices cut on the angle |
| 8 | raw squid rings and diamond-scored squid pieces |
| 9 | white fish balls, smooth and glossy |
| 10 | halved baby bok choy, white stems and dark green leaves |
| 11 | chopped Chinese cabbage / wombok leaves |
| 12 | fresh broccoli florets |
| 13 | rounds of sweet corn on the cob |
| 14 | fresh whole-leaf spinach |
| 15 | a bundle of enoki mushrooms |
| 16 | shiitake mushrooms with a cross scored into each cap |
| 17 | torn oyster mushrooms |
| 18 | a nest of thick white udon noodles |
| 19 | a nest of yellow ramen noodles |
| 20 | a nest of translucent glass noodles |
| 21 | cubes of white silken tofu |
| 22 | pleated raw prawn dumplings |
| 23 | golden fried tofu puffs |
| 24 | beef meatballs |

**Do the first six first** (wagyu, enoki, bok choy, prawns, shiitake, udon) —
they're the ones people click most. Send them to me and I'll wire them in.

Save each as its ingredient id, into `public/images/ingredients/`:

```
wagyu-beef.jpg   sliced-beef.jpg   lamb.jpg        pork-belly.jpg
chicken.jpg      prawns.jpg        fish.jpg        squid.jpg
fish-balls.jpg   bok-choy.jpg      chinese-cabbage.jpg
broccoli.jpg     corn.jpg          spinach.jpg     enoki.jpg
shiitake.jpg     oyster-mushroom.jpg   udon.jpg    ramen.jpg
glass-noodles.jpg  tofu.jpg        dumplings.jpg
tofu-puffs.jpg   meatballs.jpg
```

---

## 2. The bench under the ring

One image. It sits behind the whole station as the surface everything rests
on, so it must be **empty** — no dishes, no arms, no bowl.

> Top-down photograph, camera directly overhead at exactly 90 degrees, of an
> empty circular brushed stainless steel preparation bench in a modern Chinese
> hotpot restaurant. The bench surface is clean and unoccupied. Deep red
> restaurant walls and warm amber pendant lighting visible around the edges,
> thrown out of focus. Warm downlight pooling in the centre of the bench,
> falling off to darkness at the corners. Rich reds, warm amber, black.
> Cinematic, shallow depth of field, premium restaurant photography. Square
> 1:1. No people, no robots, no food, no text, no logos.

Save as `public/images/ropot/station-bench.jpg`.

---

## 3. Marketing stills of the arms

These are **not** the interactive picker — they're photographs for the
homepage and How It Works sections. The arms in the picker stay vector,
because they have to move.

**3a. Hero: two arms over the pot, three-quarter view**

> Photorealistic advertising photograph inside a modern Chinese hotpot
> restaurant. Two white industrial collaborative robot arms — the smooth
> rounded kind used in food service, matte white with black joints and a small
> red accent ring — are mounted to a central stainless steel preparation
> station. One arm holds a portion of thinly sliced marbled beef in a clean
> two-finger gripper, positioned above a large black hotpot of bubbling red
> Sichuan broth. The other arm is reaching toward a ring of black dishes of
> fresh hotpot ingredients around the station. Deep red walls, warm amber
> lighting, steam rising. Shot at three-quarter angle, 50mm, shallow depth of
> field. Appetising, premium, warm — not sci-fi, not cold, not blue. No
> humanoid robots, no faces, no people, no text, no logos. 3:2 landscape.

**3b. Close-up: the gripper taking one portion**

> Extreme close-up photograph of a white industrial robot gripper, matte white
> with a red accent, delicately holding a single portion of thinly sliced
> marbled wagyu beef above a black dish. Warm amber restaurant light, deep red
> background thrown out of focus, gentle steam. Macro, 85mm, very shallow
> depth of field, food-first advertising photography. Not sci-fi. No text, no
> logos. 3:2 landscape.

**3c. Wide: the station in the room**

> Wide photograph of a modern Chinese hotpot restaurant's ingredient station.
> Two white collaborative robot arms work over a circular bench lined with
> black dishes of fresh meat, mushrooms and greens. Diners at red booths in
> the soft-focus background, warm amber pendant lights, deep red walls.
> Editorial restaurant photography, warm and busy and appetising. No humanoid
> robots, no text, no logos. 3:2 landscape.

Save these as `public/images/ropot/arms-hero.jpg`, `arms-gripper.jpg` and
`arms-wide.jpg`.

---

## If ChatGPT gives you something wrong

Common fixes, said back to it in plain words:

- Arms look like a humanoid → *"no humanoid robot, just the mechanical arm on
  a fixed base, like a factory arm"*
- Too blue / sci-fi → *"warmer, deep restaurant red and amber, no blue, no
  neon, no glowing lines"*
- Cartoon → *"photorealistic, real photograph, not an illustration"*
- Not actually top-down → *"camera directly above looking straight down, 90
  degree bird's eye, flat lay"*
- Food looks fake → *"real fresh raw ingredients, glossy, appetising food
  photography"*

---

## What to do with the files

Put them in the folders named above, then tell me — I'll wire them in. The
ingredient dishes need one line added per ingredient in `data/ingredients.ts`;
everything else is a filename swap.
