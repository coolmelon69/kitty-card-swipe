import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { CatCard, Rarity } from "@/lib/cardTypes";

interface CollectionCardProps {
  card: CatCard;
  delay?: number;
  isNew?: boolean;
}

const RARITY_CONFIG: Record<
  Rarity,
  { border: string; glow: string; label: string; labelBg: string; foilColors: string }
> = {
  Common: {
    border: "border-gray-400",
    glow: "",
    label: "text-gray-500",
    labelBg: "bg-gray-100 dark:bg-gray-800",
    foilColors: "",
  },
  Uncommon: {
    border: "border-green-500",
    glow: "shadow-green-300/40 dark:shadow-green-700/40",
    label: "text-green-600",
    labelBg: "bg-green-50 dark:bg-green-950",
    foilColors: "rgba(74,222,128,0.25), rgba(255,255,255,0.08)",
  },
  Rare: {
    border: "border-blue-500",
    glow: "shadow-blue-300/50 dark:shadow-blue-700/50",
    label: "text-blue-600",
    labelBg: "bg-blue-50 dark:bg-blue-950",
    foilColors: "rgba(96,165,250,0.35), rgba(255,255,255,0.12)",
  },
  Epic: {
    border: "border-purple-500",
    glow: "shadow-purple-300/50 dark:shadow-purple-700/50",
    label: "text-purple-600",
    labelBg: "bg-purple-50 dark:bg-purple-950",
    foilColors: "rgba(168,85,247,0.4), rgba(255,255,255,0.14)",
  },
  Legendary: {
    border: "border-yellow-400",
    glow: "shadow-yellow-300/60 dark:shadow-yellow-600/60",
    label: "text-yellow-500",
    labelBg: "bg-yellow-50 dark:bg-yellow-950",
    foilColors: "rgba(250,204,21,0.45), rgba(255,255,255,0.18)",
  },
};

const TYPE_EMOJI: Record<string, string> = {
  Napper: "😴",
  Pouncer: "🐾",
  Fluffer: "☁️",
  Shadow: "🌑",
  Trickster: "😼",
  Wild: "🌿",
  Royal: "👑",
};

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-bold text-muted-foreground w-16 shrink-0 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[9px] font-bold text-foreground/70 w-5 text-right">{value}</span>
    </div>
  );
}

export default function CollectionCard({ card, delay = 0, isNew = false }: CollectionCardProps) {
  const [flipped, setFlipped] = useState(!isNew);

  useEffect(() => {
    if (!isNew) return;
    const timer = setTimeout(() => setFlipped(true), delay);
    return () => clearTimeout(timer);
  }, [isNew, delay]);

  const cfg = RARITY_CONFIG[card.rarity];
  const isHolo = ["Rare", "Epic", "Legendary"].includes(card.rarity);
  const typeEmoji = TYPE_EMOJI[card.type] ?? "🐱";

  return (
    <div style={{ perspective: "1000px" }} className="relative w-full aspect-[2.5/3.5]">
      {/* Card front */}
      <motion.div
        className={`absolute inset-0 rounded-2xl border-2 ${cfg.border} bg-white dark:bg-zinc-900 overflow-hidden shadow-lg ${cfg.glow ? `shadow-lg ${cfg.glow}` : ""}`}
        style={{ backfaceVisibility: "hidden", rotateY: flipped ? 0 : 180 }}
        animate={{ rotateY: flipped ? 0 : 180 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Holographic shimmer overlay */}
        {isHolo && (
          <motion.div
            className="holo-shimmer absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              background: `linear-gradient(105deg, transparent 20%, ${cfg.foilColors} 50%, transparent 80%)`,
            }}
            whileHover={{
              backgroundPosition: "100% 100%",
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
          />
        )}

        {/* Top bar */}
        <div className="flex items-center justify-between px-2.5 pt-2 pb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${cfg.label} ${cfg.labelBg}`}>
            {typeEmoji} {card.type}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.label}`}>
            {card.rarity}
          </span>
        </div>

        {/* Cat photo */}
        <div className="mx-2 rounded-xl overflow-hidden" style={{ height: "52%" }}>
          <img
            src={card.url}
            alt="cat"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Special move */}
        <div className="px-2.5 pt-1.5 pb-1">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Special Move</p>
          <p className="text-[11px] font-black text-foreground truncate">{card.specialMove}</p>
        </div>

        {/* Divider */}
        <div className="mx-2.5 h-px bg-border" />

        {/* Stats */}
        <div className="px-2.5 pt-1.5 pb-2 flex flex-col gap-1">
          <StatBar label="Purr Power" value={card.purrPower} />
          <StatBar label="Zoomies" value={card.zoomies} />
          <StatBar label="Fluffiness" value={card.fluffiness} />
          <StatBar label="Sneakiness" value={card.sneakiness} />
          <StatBar label="Cuddles" value={card.cuddleFactor} />
        </div>
      </motion.div>

      {/* Card back */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center shadow-lg"
        style={{ backfaceVisibility: "hidden", rotateY: flipped ? -180 : 0 }}
        animate={{ rotateY: flipped ? -180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="text-center select-none">
          <div className="text-4xl mb-1">🐾</div>
          <div className="text-xs font-black text-white/60 tracking-widest uppercase">Kitty Cards</div>
        </div>
      </motion.div>
    </div>
  );
}
