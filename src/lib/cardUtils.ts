import type { CatCard, CatType, Rarity, SwipeType } from "./cardTypes";

// --- Seeded PRNG ---

// xmur3: hash an arbitrary string to a uint32 seed
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

// mulberry32: fast, good-quality PRNG → [0, 1)
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(catId: string): () => number {
  const seed = xmur3(catId)();
  return mulberry32(seed);
}

function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

// --- Rarity Roll (uses Math.random — luck of the moment) ---

export function rollRarity(swipeType: SwipeType, streak: number): Rarity {
  const r = Math.random();
  if (swipeType === "superlike") {
    if (r < 0.40) return "Rare";
    if (r < 0.75) return "Epic";
    return "Legendary";
  }
  if (streak >= 3) {
    if (r < 0.40) return "Uncommon";
    if (r < 0.80) return "Rare";
    return "Epic";
  }
  if (r < 0.70) return "Common";
  if (r < 0.95) return "Uncommon";
  return "Rare";
}

// --- CatType derivation (seeded) ---

const TYPE_FROM_TAG: Array<[string, CatType]> = [
  ["sleep", "Napper"], ["nap", "Napper"],
  ["jump", "Pouncer"], ["hunt", "Pouncer"],
  ["fluffy", "Fluffer"], ["fluff", "Fluffer"],
  ["black", "Shadow"], ["dark", "Shadow"],
  ["funny", "Trickster"], ["silly", "Trickster"],
  ["wild", "Wild"], ["outdoor", "Wild"],
  ["kitten", "Royal"], ["cute", "Royal"],
];
const ALL_TYPES: CatType[] = [
  "Napper", "Pouncer", "Fluffer", "Shadow", "Trickster", "Wild", "Royal",
];

function deriveCatType(tags: string[], rand: () => number): CatType {
  const lower = tags.map((t) => t.toLowerCase());
  for (const [keyword, type] of TYPE_FROM_TAG) {
    if (lower.some((t) => t.includes(keyword))) return type;
  }
  return ALL_TYPES[Math.floor(rand() * ALL_TYPES.length)];
}

// --- Special Move generation (seeded) ---

const MOVE_ADJECTIVES = [
  "Midnight", "Shadow", "Fluffy", "Cosmic", "Electric",
  "Thunder", "Velvet", "Golden", "Phantom", "Solar",
];
const MOVE_NOUNS = [
  "Pounce", "Zoomies", "Headbutt", "Nuzzle", "Strike",
  "Dash", "Swipe", "Glare", "Purr", "Ambush",
];

function generateSpecialMove(rand: () => number): string {
  const adj = MOVE_ADJECTIVES[Math.floor(rand() * MOVE_ADJECTIVES.length)];
  const noun = MOVE_NOUNS[Math.floor(rand() * MOVE_NOUNS.length)];
  return `${adj} ${noun}`;
}

// --- Main builder ---

export function buildCatCard(
  cat: { url: string; tags: string[] },
  rarity: Rarity,
  swipeType: SwipeType
): CatCard {
  const id = cat.url.split("/").pop() ?? cat.url;
  const rand = makeRng(id);

  // Fixed call order — changing this order changes all stats
  const purrPower = randInt(rand, 1, 100);
  const zoomies = randInt(rand, 1, 100);
  const fluffiness = randInt(rand, 1, 100);
  const sneakiness = randInt(rand, 1, 100);
  const cuddleFactor = randInt(rand, 1, 100);
  const type = deriveCatType(cat.tags, rand);
  const specialMove = generateSpecialMove(rand);

  return {
    id,
    url: cat.url,
    tags: cat.tags,
    rarity,
    swipeType,
    collectedAt: Date.now(),
    purrPower,
    zoomies,
    fluffiness,
    sneakiness,
    cuddleFactor,
    type,
    specialMove,
  };
}
