import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, Sun, Moon, Star } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import SwipeCard, { type SwipeCardHandle } from "@/components/SwipeCard";
import SummaryScreen from "@/components/SummaryScreen";
import { playSwipeRight, playSwipeLeft, playSuperLike } from "@/lib/sounds";

interface CatData {
  id: string;
  tags: string[];
}

interface Cat {
  url: string;
  tags: string[];
}

type AppView = "loading" | "swiping" | "summary";

const Index = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const [view, setView] = useState<AppView>("loading");
  const [busy, setBusy] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const topCardRef = useRef<SwipeCardHandle>(null);

  const [skipOffset, setSkipOffset] = useState(20);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [superLikedCats, setSuperLikedCats] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalSwiped, setTotalSwiped] = useState(0);
  const fetchedIds = useRef<Set<string>>(new Set());
  const sessionStart = useRef<number>(Date.now());
  const isFetchingMoreRef = useRef(false);
  const skipOffsetRef = useRef(20);

  useEffect(() => { skipOffsetRef.current = skipOffset; }, [skipOffset]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const fetchCats = useCallback(async () => {
    setView("loading");
    setCats([]);
    setCurrentIndex(0);
    setLikedCats([]);
    setSuperLikedCats([]);
    setStreak(0);
    setTotalSwiped(0);
    setSkipOffset(20);
    fetchedIds.current = new Set();
    sessionStart.current = Date.now();
    setBusy(false);
    try {
      const res = await fetch("https://cataas.com/api/cats?limit=20");
      const data: CatData[] = await res.json();
      data.forEach(cat => fetchedIds.current.add(cat.id));
      const catList = data.map((cat) => ({
        url: `https://cataas.com/cat/${cat.id}`,
        tags: cat.tags ?? [],
      }));
      for (let i = catList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [catList[i], catList[j]] = [catList[j], catList[i]];
      }
      setCats(catList);
      setView("swiping");
    } catch {
      setTimeout(fetchCats, 2000);
    }
  }, []);

  const fetchMoreCats = useCallback(async (currentSkip: number) => {
    if (isFetchingMoreRef.current) return;
    isFetchingMoreRef.current = true;
    setIsFetchingMore(true);
    try {
      const res = await fetch(`https://cataas.com/api/cats?limit=20&skip=${currentSkip}`);
      const data: CatData[] = await res.json();
      const newCats = data
        .filter(cat => !fetchedIds.current.has(cat.id))
        .map(cat => {
          fetchedIds.current.add(cat.id);
          return { url: `https://cataas.com/cat/${cat.id}`, tags: cat.tags ?? [] };
        });
      if (newCats.length > 0) {
        setCats(prev => [...prev, ...newCats]);
      }
      setSkipOffset(currentSkip + 20);
    } catch {}
    isFetchingMoreRef.current = false;
    setIsFetchingMore(false);
  }, []);

  useEffect(() => { fetchCats(); }, [fetchCats]);

  useEffect(() => {
    document.body.style.overflow = view === "swiping" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [view]);

  const advanceCard = useCallback(
    (direction: "left" | "right" | "up") => {
      if (direction === "right") {
        setLikedCats((prev) => [...prev, cats[currentIndex].url]);
        setStreak((s) => s + 1);
        playSwipeRight();
      } else if (direction === "up") {
        setSuperLikedCats((prev) => [...prev, cats[currentIndex].url]);
        setStreak(0);
        playSuperLike();
      } else {
        setStreak(0);
        playSwipeLeft();
      }
      setTotalSwiped((n) => n + 1);
      const next = currentIndex + 1;
      setCurrentIndex(next);
      if (cats.length - next <= 5) {
        fetchMoreCats(skipOffsetRef.current);
      }
      setBusy(false);
    },
    [cats, currentIndex, fetchMoreCats]
  );

  const triggerSwipe = (dir: "left" | "right") => {
    if (view !== "swiping" || busy) return;
    setBusy(true);
    topCardRef.current?.flyOut(dir);
  };

  const remaining = cats.length - currentIndex;

  return (
    <div className="animated-bg min-h-screen flex flex-col items-center justify-center relative transition-colors duration-500">
      {/* Top bar */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button
          onClick={() => setView("summary")}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          See Results
        </button>
        <button
          onClick={() => setIsDark((d) => !d)}
          className="w-10 h-10 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
          aria-label="Toggle dark mode"
        >
          {isDark
            ? <Sun className="w-5 h-5 text-yellow-300" />
            : <Moon className="w-5 h-5 text-purple-600" />}
        </button>
      </div>

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
              <h1 className="text-2xl sm:text-3xl font-black drop-shadow-sm"
                style={{ background: "linear-gradient(90deg, #f43f5e, #f97316, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                🐾 Paws &amp; Preferences
              </h1>
              <p className="text-sm font-semibold text-foreground/60 mt-1">
                {remaining} {remaining === 1 ? "kitty" : "kitties"} left to judge
              </p>
            </div>

            <AnimatePresence>
              {streak >= 2 && (
                <motion.div
                  key={streak}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-lg font-bold text-orange-500"
                >
                  🔥 {streak} in a row!
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative w-[300px] h-[400px] sm:w-[340px] sm:h-[440px]">
              {cats
                .slice(currentIndex, currentIndex + 3)
                .map((cat, i) => (
                  <SwipeCard
                    key={cat.url}
                    ref={i === 0 ? topCardRef : undefined}
                    imageUrl={cat.url}
                    tags={cat.tags}
                    isTop={i === 0 && !busy}
                    index={i}
                    onSwipeComplete={advanceCard}
                  />
                ))}
            </div>

            {isFetchingMore && (
              <div className="text-xs text-muted-foreground animate-pulse">Loading more cats...</div>
            )}

            <div className="flex gap-8 items-end">
              {/* Nope button */}
              <button
                onClick={() => triggerSwipe("left")}
                disabled={busy}
                aria-label="Dislike"
                className="group flex flex-col items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-red-600 shadow-lg shadow-rose-300/50 dark:shadow-rose-900/50 flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform">
                  <X className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <span className="text-xs font-black text-rose-500 dark:text-rose-400 tracking-wide uppercase">Nope</span>
              </button>

              {/* Super Like button */}
              <button
                onClick={() => { setBusy(true); topCardRef.current?.flyOut("up"); }}
                disabled={busy}
                aria-label="Super Like"
                className="group flex flex-col items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-300/50 dark:shadow-yellow-900/50 flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform">
                  <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                </div>
                <span className="text-xs font-black text-yellow-500 dark:text-yellow-400 tracking-wide uppercase">Super</span>
              </button>

              {/* Like button */}
              <button
                onClick={() => triggerSwipe("right")}
                disabled={busy}
                aria-label="Like"
                className="group flex flex-col items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 shadow-lg shadow-pink-300/50 dark:shadow-pink-900/50 flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform">
                  <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
                <span className="text-xs font-black text-pink-500 dark:text-pink-400 tracking-wide uppercase">Like</span>
              </button>
            </div>
          </motion.div>
        )}

        {view === "summary" && (
          <SummaryScreen
            key="summary"
            likedCats={likedCats}
            superLikedCats={superLikedCats}
            totalSwiped={totalSwiped}
            sessionDuration={Math.floor((Date.now() - sessionStart.current) / 1000)}
            onPlayAgain={fetchCats}
            onKeepSwiping={() => setView("swiping")}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
