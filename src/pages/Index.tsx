import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import SwipeCard from "@/components/SwipeCard";
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
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  const fetchCats = useCallback(async () => {
    setView("loading");
    setCats([]);
    setCurrentIndex(0);
    setLikedCats([]);
    try {
      const res = await fetch("https://cataas.com/api/cats?limit=15");
      const data: CatData[] = await res.json();
      const urls = data.map((cat) => `https://cataas.com/cat/${cat._id}`);
      setCats(urls);
      setView("swiping");
    } catch {
      // Retry once after 2s
      setTimeout(fetchCats, 2000);
    }
  }, []);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = view === "swiping" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [view]);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "right") {
        setLikedCats((prev) => [...prev, cats[currentIndex]]);
      }
      setSwipeDir(direction);
      setTimeout(() => {
        setSwipeDir(null);
        const next = currentIndex + 1;
        if (next >= cats.length) {
          setView("summary");
        } else {
          setCurrentIndex(next);
        }
      }, 300);
    },
    [cats, currentIndex]
  );

  const triggerSwipe = (dir: "left" | "right") => {
    if (view !== "swiping" || swipeDir) return;
    handleSwipe(dir);
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
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                🐾 Paws & Preferences
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {remaining} {remaining === 1 ? "cat" : "cats"} remaining
              </p>
            </div>

            {/* Card Stack */}
            <div className="relative w-[300px] h-[400px] sm:w-[340px] sm:h-[440px]">
              <AnimatePresence>
                {cats
                  .slice(currentIndex, currentIndex + 3)
                  .reverse()
                  .map((url, reverseIdx) => {
                    const stackIndex = Math.min(2, cats.length - currentIndex - 1) - reverseIdx;
                    return (
                      <SwipeCard
                        key={url}
                        imageUrl={url}
                        isTop={stackIndex === 0 && !swipeDir}
                        index={stackIndex}
                        onSwipe={handleSwipe}
                      />
                    );
                  })}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6">
              <button
                onClick={() => triggerSwipe("left")}
                className="w-16 h-16 rounded-full bg-card border-2 border-destructive flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                aria-label="Dislike"
              >
                <X className="w-8 h-8 text-destructive" />
              </button>
              <button
                onClick={() => triggerSwipe("right")}
                className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                aria-label="Like"
              >
                <Heart className="w-8 h-8 text-primary" fill="hsl(var(--primary))" />
              </button>
            </div>
          </motion.div>
        )}

        {view === "summary" && (
          <SummaryScreen
            key="summary"
            likedCats={likedCats}
            onPlayAgain={fetchCats}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
