export type Category =
  | "Meat"
  | "Seafood"
  | "Vegetables"
  | "Mushrooms"
  | "Noodles"
  | "Other";

/** Polar slot on the bird's-eye ingredient ring. */
export interface RobotPosition {
  /** Index of the tray slot around the ring (0 = 12 o'clock, clockwise). */
  slot: number;
  /** Angle in degrees, 0 = 12 o'clock, clockwise. */
  angle: number;
  /** Distance from the centre of the station, in stage units. */
  radius: number;
}

/** Where a portion tends to settle inside the bowl. */
export interface BowlPosition {
  /** -1..1 across the bowl. */
  x: number;
  /** -1..1 down the bowl. */
  y: number;
  /** Draw order: higher sits on top of the pile. */
  layer: number;
}

export interface Ingredient {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  price: number;
  /** One-line appetite copy shown on hover. */
  blurb: string;
  robotPosition: RobotPosition;
  bowlPosition: BowlPosition;
  /** Optional photograph. Falls back to the built-in food art when absent. */
  image?: string;
  /** Spoken aliases for voice ordering. */
  aliases: string[];
}

export interface Broth {
  id: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  /** Broth surface colours used by the bowl renderer. */
  colors: { base: string; deep: string; sheen: string };
  heat: 0 | 1 | 2 | 3;
  image?: string;
}

export interface SpiceLevel {
  id: string;
  name: string;
  scoville: string;
  description: string;
  chillies: number;
}

export interface OrderLine {
  ingredientId: string;
  quantity: number;
}

export type OrderStep = "broth" | "spice" | "pick" | "review" | "details";

export interface PickupDetails {
  name: string;
  mobile: string;
  locationId: string;
  time: string;
}

export interface OrderState {
  brothId: string | null;
  spiceId: string | null;
  lines: OrderLine[];
  step: OrderStep;
  details: PickupDetails;
  placed: boolean;
  orderRef: string | null;
}

export type RobotPhase =
  | "idle"
  | "movingToIngredient"
  | "descending"
  | "picking"
  | "lifting"
  | "movingToBowl"
  | "dropping"
  | "returning";
