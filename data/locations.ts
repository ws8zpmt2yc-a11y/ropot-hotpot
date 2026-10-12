export interface Location {
  id: string;
  name: string;
  address: string;
  suburb: string;
  phone: string;
  hours: { days: string; time: string }[];
  note: string;
  mapsQuery: string;
}

export const LOCATIONS: Location[] = [
  {
    id: "adelaide-cbd",
    name: "RoPot Adelaide CBD",
    address: "142 Gouger Street",
    suburb: "Adelaide SA 5000",
    phone: "(08) 8231 0142",
    hours: [
      { days: "Mon – Thu", time: "11:30am – 10:00pm" },
      { days: "Fri – Sat", time: "11:30am – 12:00am" },
      { days: "Sunday", time: "12:00pm – 9:30pm" },
    ],
    note: "Both picking arms live here. Takeaway counter is to the left as you walk in.",
    mapsQuery: "142 Gouger Street Adelaide",
  },
  {
    id: "norwood",
    name: "RoPot Norwood",
    address: "88 The Parade",
    suburb: "Norwood SA 5067",
    phone: "(08) 8331 0088",
    hours: [
      { days: "Tue – Thu", time: "5:00pm – 10:00pm" },
      { days: "Fri – Sat", time: "12:00pm – 11:00pm" },
      { days: "Sunday", time: "12:00pm – 9:00pm" },
    ],
    note: "Dine-in and takeaway. Street parking behind the building after 6pm.",
    mapsQuery: "88 The Parade Norwood SA",
  },
];

export const PICKUP_SLOTS = [
  "As soon as it's ready",
  "In 20 minutes",
  "In 30 minutes",
  "In 45 minutes",
  "In 1 hour",
  "In 1 hour 30",
];
