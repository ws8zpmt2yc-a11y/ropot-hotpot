import type { SpiceLevel } from "@/types/order";

export const SPICE_LEVELS: SpiceLevel[] = [
  {
    id: "mild",
    name: "Mild",
    scoville: "No heat",
    description: "All of the aroma, none of the burn. Chilli served on the side.",
    chillies: 0,
  },
  {
    id: "medium",
    name: "Medium",
    scoville: "A warm hum",
    description: "The house default. Warmth that builds slowly and then behaves.",
    chillies: 1,
  },
  {
    id: "hot",
    name: "Hot",
    scoville: "Properly spicy",
    description: "Double chilli oil and a heavier hand with the peppercorn.",
    chillies: 2,
  },
  {
    id: "extra-hot",
    name: "Extra Hot",
    scoville: "Bring milk",
    description: "Our kitchen's full send. You will feel this one tomorrow.",
    chillies: 3,
  },
];

export const getSpice = (id: string | null): SpiceLevel | undefined =>
  SPICE_LEVELS.find((level) => level.id === id);
