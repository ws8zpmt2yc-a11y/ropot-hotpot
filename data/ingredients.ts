import { asset } from "@/lib/asset";
import type { Category, Ingredient } from "@/types/order";
import { slotAngle, STAGE } from "@/lib/geometry";

/**
 * The 24 ingredient trays that sit around the bird's-eye station.
 * `slot` is the tray's position on the ring, 0 = 12 o'clock, clockwise.
 * Categories are kept contiguous so the ring reads like the real
 * ingredient line: meat, seafood, veg, mushrooms, noodles, everything else.
 *
 * `image` is optional. Drop a square photo at that path and the tray, the
 * gripper and the bowl all switch from the built-in art to the photograph.
 */
interface IngredientSeed {
  id: string;
  /** Photograph of the dish, top-down. Falls back to the drawn art when absent. */
  image?: string;
  name: string;
  shortName: string;
  category: Category;
  price: number;
  slot: number;
  blurb: string;
  bowl: { x: number; y: number; layer: number };
  aliases: string[];
}

const SEEDS: IngredientSeed[] = [
  // ---- Meat: slots 0-4 (top, running clockwise) ----
  {
    id: "wagyu-beef",
    name: "Wagyu Beef",
    shortName: "Wagyu",
    category: "Meat",
    price: 12.5,
    slot: 0,
    blurb: "Marble score 7+, sliced to 1.2mm. Nine seconds in the pot.",
    image: asset("/images/ingredients/wagyu-beef.jpg"),
    bowl: { x: 0.02, y: -0.3, layer: 8 },
    aliases: ["wagyu", "wagyu beef", "beef wagyu", "marbled beef"],
  },
  {
    id: "sliced-beef",
    name: "Sliced Beef",
    shortName: "Beef",
    category: "Meat",
    price: 7.5,
    slot: 1,
    blurb: "Chuck roll rolled thin. The everyday hotpot workhorse.",
    image: asset("/images/ingredients/sliced-beef.jpg"),
    bowl: { x: 0.34, y: -0.2, layer: 7 },
    aliases: ["beef", "sliced beef", "steak"],
  },
  {
    id: "lamb",
    image: asset("/images/ingredients/lamb.jpg"),
    name: "Lamb Shoulder",
    shortName: "Lamb",
    category: "Meat",
    price: 8.5,
    slot: 2,
    blurb: "South Australian lamb, shaved and fanned. Sweet with chilli.",
    bowl: { x: 0.5, y: 0.04, layer: 6 },
    aliases: ["lamb", "lamb shoulder", "sheep"],
  },
  {
    id: "pork-belly",
    image: asset("/images/ingredients/pork-belly.jpg"),
    name: "Pork Belly",
    shortName: "Pork",
    category: "Meat",
    price: 7,
    slot: 3,
    blurb: "Layered belly that goes silky the moment it hits the broth.",
    bowl: { x: 0.42, y: 0.3, layer: 6 },
    aliases: ["pork", "pork belly", "belly"],
  },
  {
    id: "chicken",
    image: asset("/images/ingredients/chicken.jpg"),
    name: "Chicken Thigh",
    shortName: "Chicken",
    category: "Meat",
    price: 6.5,
    slot: 4,
    blurb: "Free range thigh, boned and sliced. Stays juicy, never chalky.",
    bowl: { x: 0.2, y: 0.44, layer: 5 },
    aliases: ["chicken", "chicken thigh", "thigh"],
  },

  // ---- Seafood: slots 5-8 ----
  {
    id: "prawns",
    image: asset("/images/ingredients/prawns.jpg"),
    name: "Tiger Prawns",
    shortName: "Prawns",
    category: "Seafood",
    price: 9.5,
    slot: 5,
    blurb: "Head-on tigers, deveined. They curl up tight and go sweet.",
    bowl: { x: -0.08, y: 0.5, layer: 7 },
    aliases: ["prawn", "prawns", "shrimp", "tiger prawns"],
  },
  {
    id: "fish",
    image: asset("/images/ingredients/fish.jpg"),
    name: "Barramundi",
    shortName: "Fish",
    category: "Seafood",
    price: 8.5,
    slot: 6,
    blurb: "Thick fillet cut on the angle so it holds together in the pot.",
    bowl: { x: -0.36, y: 0.4, layer: 6 },
    aliases: ["fish", "barramundi", "barra", "fish fillet"],
  },
  {
    id: "squid",
    image: asset("/images/ingredients/squid.jpg"),
    name: "Squid",
    shortName: "Squid",
    category: "Seafood",
    price: 7.5,
    slot: 7,
    blurb: "Scored in a diamond so it flowers open. Thirty seconds, no more.",
    bowl: { x: -0.5, y: 0.16, layer: 5 },
    aliases: ["squid", "calamari"],
  },
  {
    id: "fish-balls",
    image: asset("/images/ingredients/fish-balls.jpg"),
    name: "Fish Balls",
    shortName: "Fish Balls",
    category: "Seafood",
    price: 5.5,
    slot: 8,
    blurb: "Bouncy, house-rolled, faintly sweet. Everyone steals these.",
    bowl: { x: -0.48, y: -0.12, layer: 4 },
    aliases: ["fish balls", "fishball", "fish ball"],
  },

  // ---- Vegetables: slots 9-13 ----
  {
    id: "bok-choy",
    image: asset("/images/ingredients/bok-choy.jpg"),
    name: "Bok Choy",
    shortName: "Bok Choy",
    category: "Vegetables",
    price: 4,
    slot: 9,
    blurb: "Baby bok choy split in half. Crisp stem, silky leaf.",
    bowl: { x: -0.3, y: -0.38, layer: 3 },
    aliases: ["bok choy", "pak choi", "bokchoy", "greens"],
  },
  {
    id: "chinese-cabbage",
    image: asset("/images/ingredients/chinese-cabbage.jpg"),
    name: "Chinese Cabbage",
    shortName: "Cabbage",
    category: "Vegetables",
    price: 3.5,
    slot: 10,
    blurb: "Wombok. Soaks the broth up like a sponge and sweetens it back.",
    bowl: { x: -0.04, y: -0.5, layer: 2 },
    aliases: ["cabbage", "chinese cabbage", "wombok", "napa"],
  },
  {
    id: "broccoli",
    image: asset("/images/ingredients/broccoli.jpg"),
    name: "Broccoli",
    shortName: "Broccoli",
    category: "Vegetables",
    price: 4,
    slot: 11,
    blurb: "Cut into florets that trap chilli oil in every crevice.",
    bowl: { x: 0.26, y: -0.46, layer: 4 },
    aliases: ["broccoli", "brocoli"],
  },
  {
    id: "corn",
    image: asset("/images/ingredients/corn.jpg"),
    name: "Sweet Corn",
    shortName: "Corn",
    category: "Vegetables",
    price: 3.5,
    slot: 12,
    blurb: "Cut rounds that quietly sweeten the whole pot as they cook.",
    bowl: { x: 0.5, y: -0.36, layer: 5 },
    aliases: ["corn", "sweet corn", "sweetcorn"],
  },
  {
    id: "spinach",
    image: asset("/images/ingredients/spinach.jpg"),
    name: "Spinach",
    shortName: "Spinach",
    category: "Vegetables",
    price: 3.5,
    slot: 13,
    blurb: "Whole leaf. Give it ten seconds and lift it straight out.",
    bowl: { x: 0.6, y: -0.06, layer: 3 },
    aliases: ["spinach", "leafy greens"],
  },

  // ---- Mushrooms: slots 14-16 ----
  {
    id: "enoki",
    image: asset("/images/ingredients/enoki.jpg"),
    name: "Enoki",
    shortName: "Enoki",
    category: "Mushrooms",
    price: 4.5,
    slot: 14,
    blurb: "Long pale bundles. They go slippery and hold onto the broth.",
    bowl: { x: 0.56, y: 0.22, layer: 6 },
    aliases: ["enoki", "enoki mushroom", "enoki mushrooms", "gold needle"],
  },
  {
    id: "shiitake",
    image: asset("/images/ingredients/shiitake.jpg"),
    name: "Shiitake",
    shortName: "Shiitake",
    category: "Mushrooms",
    price: 5,
    slot: 15,
    blurb: "Scored with a cross so they open like flowers. Deeply savoury.",
    bowl: { x: 0.32, y: 0.5, layer: 7 },
    aliases: ["shiitake", "shitake", "shiitake mushroom"],
  },
  {
    id: "oyster-mushroom",
    image: asset("/images/ingredients/oyster-mushroom.jpg"),
    name: "Oyster Mushrooms",
    shortName: "Oyster",
    category: "Mushrooms",
    price: 4.5,
    slot: 16,
    blurb: "Torn into ribbons. Meaty texture, gentle flavour.",
    bowl: { x: -0.02, y: 0.58, layer: 6 },
    aliases: ["oyster mushroom", "oyster mushrooms", "oyster"],
  },

  // ---- Noodles: slots 17-19 ----
  {
    id: "udon",
    image: asset("/images/ingredients/udon.jpg"),
    name: "Udon",
    shortName: "Udon",
    category: "Noodles",
    price: 4.5,
    slot: 17,
    blurb: "Fat, chewy, unapologetic. Go in last, come out first.",
    bowl: { x: -0.32, y: 0.52, layer: 9 },
    aliases: ["udon", "udon noodles", "thick noodles"],
  },
  {
    id: "ramen",
    image: asset("/images/ingredients/ramen.jpg"),
    name: "Ramen Noodles",
    shortName: "Ramen",
    category: "Noodles",
    price: 4,
    slot: 18,
    blurb: "Springy alkaline noodles that drink up whatever broth you chose.",
    bowl: { x: -0.56, y: 0.28, layer: 9 },
    aliases: ["ramen", "ramen noodles", "noodles"],
  },
  {
    id: "glass-noodles",
    image: asset("/images/ingredients/glass-noodles.jpg"),
    name: "Glass Noodles",
    shortName: "Glass Noodles",
    category: "Noodles",
    price: 4,
    slot: 19,
    blurb: "Sweet potato starch. Turns translucent and slurps beautifully.",
    bowl: { x: -0.62, y: -0.02, layer: 8 },
    aliases: ["glass noodles", "vermicelli", "sweet potato noodles"],
  },

  // ---- Other: slots 20-23 ----
  {
    id: "tofu",
    image: asset("/images/ingredients/tofu.jpg"),
    name: "Silken Tofu",
    shortName: "Tofu",
    category: "Other",
    price: 4,
    slot: 20,
    blurb: "Cut into blocks in front of you. Handle it gently, it's worth it.",
    bowl: { x: -0.44, y: -0.34, layer: 4 },
    aliases: ["tofu", "silken tofu", "bean curd"],
  },
  {
    id: "dumplings",
    image: asset("/images/ingredients/dumplings.jpg"),
    name: "Prawn Dumplings",
    shortName: "Dumplings",
    category: "Other",
    price: 7,
    slot: 21,
    blurb: "Hand-pleated in the kitchen every morning. Six to a portion.",
    bowl: { x: -0.16, y: -0.56, layer: 8 },
    aliases: ["dumpling", "dumplings", "prawn dumplings", "wonton"],
  },
  {
    id: "tofu-puffs",
    image: asset("/images/ingredients/tofu-puffs.jpg"),
    name: "Tofu Puffs",
    shortName: "Tofu Puffs",
    category: "Other",
    price: 4,
    slot: 22,
    blurb: "Little golden sponges. They ambush you with hot broth. Careful.",
    bowl: { x: 0.14, y: -0.58, layer: 7 },
    aliases: ["tofu puff", "tofu puffs", "puffs"],
  },
  {
    id: "meatballs",
    image: asset("/images/ingredients/meatballs.jpg"),
    name: "Beef Meatballs",
    shortName: "Meatballs",
    category: "Other",
    price: 6,
    slot: 23,
    blurb: "Hand-beaten until they bounce. Cook them right through.",
    bowl: { x: 0.44, y: -0.5, layer: 6 },
    aliases: ["meatball", "meatballs", "beef balls", "beef meatballs"],
  },
];

export const INGREDIENTS: Ingredient[] = SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  shortName: seed.shortName,
  category: seed.category,
  price: seed.price,
  blurb: seed.blurb,
  image: seed.image,
  aliases: seed.aliases,
  robotPosition: {
    slot: seed.slot,
    angle: slotAngle(seed.slot),
    radius: STAGE.ringRadius,
  },
  bowlPosition: { x: seed.bowl.x, y: seed.bowl.y, layer: seed.bowl.layer },
}));

export const INGREDIENTS_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]),
);

export const CATEGORY_ORDER: Category[] = [
  "Meat",
  "Seafood",
  "Vegetables",
  "Mushrooms",
  "Noodles",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Meat: "#E0574B",
  Seafood: "#F08A5D",
  Vegetables: "#7FB03F",
  Mushrooms: "#C49A5E",
  Noodles: "#EFC15E",
  Other: "#E8B4A4",
};

export const INGREDIENTS_BY_CATEGORY = CATEGORY_ORDER.map((category) => ({
  category,
  items: INGREDIENTS.filter((ingredient) => ingredient.category === category),
}));

export const getIngredient = (id: string): Ingredient | undefined =>
  INGREDIENTS_BY_ID[id];

/** Match a spoken phrase to an ingredient. Longest alias wins. */
export function matchIngredientPhrase(phrase: string): Ingredient | undefined {
  const text = phrase.toLowerCase().replace(/[^a-z\s]/g, " ");
  let best: { ingredient: Ingredient; length: number } | undefined;
  for (const ingredient of INGREDIENTS) {
    for (const alias of ingredient.aliases) {
      if (text.includes(alias) && (!best || alias.length > best.length)) {
        best = { ingredient, length: alias.length };
      }
    }
  }
  return best?.ingredient;
}
