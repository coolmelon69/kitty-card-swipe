import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface SummaryScreenProps {
  likedCats: string[];
  superLikedCats: string[];
  totalSwiped: number;
  sessionDuration: number;
  onPlayAgain: () => void;
  onKeepSwiping: () => void;
}

const SummaryScreen = ({ likedCats, superLikedCats, totalSwiped, sessionDuration, onPlayAgain, onKeepSwiping }: SummaryScreenProps) => {
  return (
    <motion.div
      className="flex flex-col items-center min-h-screen px-4 py-10 gap-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1
        className="text-3xl sm:text-4xl font-black text-foreground text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        You liked {likedCats.length} {likedCats.length === 1 ? "kitty" : "kitties"}! 😻
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
        <span>Swiped <strong className="text-foreground">{totalSwiped}</strong></span>
        <span>•</span>
        <span>Liked <strong className="text-foreground">{likedCats.length}</strong> ({totalSwiped > 0 ? Math.round((likedCats.length / totalSwiped) * 100) : 0}%)</span>
        <span>•</span>
        <span>⭐ Super <strong className="text-foreground">{superLikedCats.length}</strong></span>
        <span>•</span>
        <span>⏱ {Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s</span>
      </div>

      {superLikedCats.length > 0 && (
        <div className="w-full max-w-md">
          <h2 className="text-lg font-bold text-yellow-500 mb-2">⭐ Super Liked</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {superLikedCats.map((url, i) => (
              <motion.div
                key={url}
                className="aspect-square rounded-xl overflow-hidden shadow-md bg-card ring-2 ring-yellow-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <img src={url} alt="Super liked cat" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {likedCats.length === 0 ? (
        <p className="text-muted-foreground text-lg">No cats liked? Cold-hearted! 🥶</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md">
          {likedCats.map((url, i) => (
            <motion.div
              key={url}
              className="aspect-square rounded-xl overflow-hidden shadow-md bg-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <img src={url} alt="Liked cat" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        <Button onClick={onKeepSwiping} size="lg" variant="outline" className="rounded-full text-lg font-bold gap-2 px-8">
          Keep Swiping 🐱
        </Button>
        <Button onClick={onPlayAgain} size="lg" className="rounded-full text-lg font-bold gap-2 px-8">
          <RotateCcw className="w-5 h-5" />
          Play Again
        </Button>
      </div>
    </motion.div>
  );
};

export default SummaryScreen;
