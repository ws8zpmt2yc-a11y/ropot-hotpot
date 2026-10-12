import { asset } from "@/lib/asset";
import type { Broth } from "@/types/order";

/**
 * Broth base prices include the pot, dipping sauce and rice.
 * `colors` drive the live bowl renderer in the robot picker.
 */
export const BROTHS: Broth[] = [
  {
    id: "classic-beef",
    name: "Classic Beef",
    price: 14,
    tagline: "Twelve hours on the bone",
    description:
      "Beef bones, ginger and spring onion simmered overnight until the stock turns glossy and clear. The one our regulars order.",
    colors: { base: "#C58B3C", deep: "#8E5A1E", sheen: "#F0C077" },
    heat: 0,
  },
  {
    id: "spicy-sichuan",
    name: "Spicy Sichuan",
    price: 16,
    tagline: "Chilli oil, whole spice, real numb",
    description:
      "Erjingtiao chilli, Sichuan peppercorn and fermented bean paste bloomed in beef tallow. Fragrant first, fiery second.",
    colors: { base: "#C6321A", deep: "#8A1D0C", sheen: "#FF6A32" },
    heat: 3,
    image: asset("/images/ropot/hotpot-food.jpg"),
  },
  {
    id: "tomato",
    name: "Tomato",
    price: 15,
    tagline: "Sweet, tangy, everybody's friend",
    description:
      "Vine tomatoes cooked down with rock sugar and a little chicken stock. Bright, gentle and the table favourite with kids.",
    colors: { base: "#D2492A", deep: "#96280F", sheen: "#FF8A5B" },
    heat: 1,
  },
  {
    id: "mushroom",
    name: "Wild Mushroom",
    price: 15,
    tagline: "Deep, earthy, meat-free",
    description:
      "Shiitake, porcini and king oyster steeped with kombu. Fully vegan and somehow still the richest pot on the menu.",
    colors: { base: "#9A7A4E", deep: "#5E482A", sheen: "#C9A874" },
    heat: 0,
  },
  {
    id: "tom-yum",
    name: "Tom Yum",
    price: 16,
    tagline: "Lemongrass, lime, a proper kick",
    description:
      "Galangal, kaffir lime and lemongrass with chilli jam and a squeeze of lime at the pass. Sharp and hot at once.",
    colors: { base: "#D06A24", deep: "#93400F", sheen: "#FFA24E" },
    heat: 2,
  },
];

export const getBroth = (id: string | null): Broth | undefined =>
  BROTHS.find((broth) => broth.id === id);

export const DEFAULT_BROTH_COLORS = {
  base: "#B4762F",
  deep: "#7A4C18",
  sheen: "#E0AE68",
};
