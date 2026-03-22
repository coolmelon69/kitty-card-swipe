export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export type CatType =
  | "Napper"
  | "Pouncer"
  | "Fluffer"
  | "Shadow"
  | "Trickster"
  | "Wild"
  | "Royal";

export type SwipeType = "like" | "superlike";

export interface CatCard {
  id: string;
  url: string;
  tags: string[];
  rarity: Rarity;
  swipeType: SwipeType;
  collectedAt: number;

  // Deterministic stats seeded from cat ID (1–100)
  purrPower: number;
  zoomies: number;
  fluffiness: number;
  sneakiness: number;
  cuddleFactor: number;

  type: CatType;
  specialMove: string;
}
