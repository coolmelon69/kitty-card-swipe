import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import SwipeCard, { type SwipeCardHandle } from "@/components/SwipeCard";
import SummaryScreen from "@/components/SummaryScreen";

interface CatData {
  _id: string;
}

type AppView = "loading" | "swiping" | "summary";

const Index = () => {
  const [cats, setCats] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const [view, setView] = useState<AppView>("loading");
  const [busy, setBusy] = useState(false);
  const topCardRef = useRef<SwipeCardHandle>(null);

  const fetchCats = useCallback(async () => {
    setView("loading");
    setCats([]);
    setCurrentIndex(0);
    setLikedCats([]);
    setBusy(false);
    try {
      const res = await fetch("https://cataas.com/api/cats?limit=15");
      const data: CatData[] = await res.json();
      const urls = data.map((cat) => `https://cataas.com/cat/${cat._id}`);
      setCats(urls);
      setView("swiping");
    } catch {
      setTimeout(fetchCats, 2000);
    }
  }, []);

  useEffect(() => { fetchCats(); }, [fetchCats]);

  useEffect(() => {
    document.body.style.overflow = view === "swiping" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [view]);

  const advanceCard = useCallback(
    (direction: "left" | "right") => {
      if (direction === "right") {
        setLikedCats((prev) => [...prev, cats[currentIndex]]);
      }
      const next = currentIndex + 1;
      if (next >= cats.length) {
        setTimeout(() => setView("summary"), 100);
      } else {
        setCurrentIndex(next);
      }
      setBusy(false);
    },
    [cats, currentIndex]
  );

  const triggerSwipe = (dir: "left" | "right") => {
    if (view !== "swiping" || busy) return;
    setBusy(true);
    topCardRef.current?.flyOut(dir);
  };

  const remaining = cats.length - currentIndex;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <AnimatePresence mode="wait">
        {view === "loading" && <LoadingScreen key="loading" />}

        {view === "swiping" && (
          <motion.div
            key="swiping"
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">🐾 Paws & Preferences</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {remaining} {remaining === 1 ? "cat" : "cats"} remaining
              </p>
            </div>

            <div className="relative w-[300px] h-[400px] sm:w-[340px] sm:h-[440px]">
              {cats
                .slice(currentIndex, currentIndex + 3)
                .map((url, i) => (
                  <SwipeCard
                    key={url}
                    ref={i === 0 ? topCardRef : undefined}
                    imageUrl={url}
                    isTop={i === 0 && !busy}
                    index={i}
                    onSwipeComplete={advanceCard}
                  />
                ))}
            </div>

            <div className="flex gap-6">
              <button
                onClick={() => triggerSwipe("left")}
                disabled={busy}
                className="w-16 h-16 rounded-full bg-card border-2 border-destructive flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
                aria-label="Dislike"
              >
                <X className="w-8 h-8 text-destructive" />
              </button>
              <button
                onClick={() => triggerSwipe("right")}
                disabled={busy}
                className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
                aria-label="Like"
              >
                <Heart className="w-8 h-8 text-primary" fill="hsl(var(--primary))" />
              </button>
            </div>
          </motion.div>
        )}

        {view === "summary" && (
          <SummaryScreen key="summary" likedCats={likedCats} onPlayAgain={fetchCats} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
