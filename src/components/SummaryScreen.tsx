import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface SummaryScreenProps {
  likedCats: string[];
  onPlayAgain: () => void;
}

const SummaryScreen = ({ likedCats, onPlayAgain }: SummaryScreenProps) => {
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

      <Button
        onClick={onPlayAgain}
        size="lg"
        className="mt-4 rounded-full text-lg font-bold gap-2 px-8"
      >
        <RotateCcw className="w-5 h-5" />
        Play Again
      </Button>
    </motion.div>
  );
};

export default SummaryScreen;
