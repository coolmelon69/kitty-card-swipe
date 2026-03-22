import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CollectionCard from "@/components/CollectionCard";
import type { CatCard, Rarity } from "@/lib/cardTypes";

const STORAGE_KEY = "kitty-card-collection";
const SESSION_KEY = "collection-last-visit";

const RARITY_TABS: Array<Rarity | "All"> = [
  "All", "Common", "Uncommon", "Rare", "Epic", "Legendary",
];

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center py-20 gap-4 text-muted-foreground">
      <span className="text-6xl">🐾</span>
      <p className="text-lg font-semibold">No cards yet!</p>
      <p className="text-sm">Swipe right or super like cats to collect them.</p>
      <Button onClick={() => navigate("/")} variant="outline" className="mt-2">
        Start Swiping
      </Button>
    </div>
  );
}

export default function Collection() {
  const navigate = useNavigate();

  const [lastVisit] = useState<number>(() =>
    Number(sessionStorage.getItem(SESSION_KEY) ?? "0")
  );

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, String(Date.now()));
  }, []);

  const [cards] = useState<CatCard[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CatCard[]) : [];
    } catch {
      return [];
    }
  });

  const [activeFilter, setActiveFilter] = useState<Rarity | "All">("All");

  const rarityCounts = useMemo(() => {
    const counts: Record<Rarity | "All", number> = {
      All: cards.length,
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Epic: 0,
      Legendary: 0,
    };
    for (const card of cards) counts[card.rarity]++;
    return counts;
  }, [cards]);

  const filtered =
    activeFilter === "All" ? cards : cards.filter((c) => c.rarity === activeFilter);

  return (
    <div className="animated-bg min-h-screen transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Swiping
          </Button>
          <div className="text-center">
            <h1
              className="text-2xl font-black drop-shadow-sm"
              style={{
                background: "linear-gradient(90deg, #f43f5e, #f97316, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🐾 My Collection
            </h1>
            <p className="text-sm text-muted-foreground font-semibold">
              {cards.length} {cards.length === 1 ? "card" : "cards"} collected
            </p>
          </div>
          <div className="w-24" /> {/* spacer to balance header */}
        </div>

        {cards.length === 0 ? (
          <EmptyState />
        ) : (
          <Tabs
            value={activeFilter}
            onValueChange={(v) => setActiveFilter(v as Rarity | "All")}
          >
            <TabsList className="flex flex-wrap h-auto gap-1 mb-4 bg-white/40 dark:bg-black/20 backdrop-blur-sm">
              {RARITY_TABS.map((r) => (
                <TabsTrigger key={r} value={r} className="gap-1.5">
                  {r}
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
                    {rarityCounts[r]}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {RARITY_TABS.map((r) => (
              <TabsContent key={r} value={r}>
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-4xl mb-3">😿</p>
                    <p className="font-semibold">No {r} cards yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filtered.map((card, i) => (
                      <CollectionCard
                        key={card.id + card.collectedAt}
                        card={card}
                        delay={i * 80}
                        isNew={card.collectedAt > lastVisit}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
