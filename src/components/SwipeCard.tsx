import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useState } from "react";

interface SwipeCardProps {
  imageUrl: string;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  index: number;
}

const SwipeCard = ({ imageUrl, onSwipe, isTop, index }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const [exitX, setExitX] = useState(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 300 : -300);
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  if (!isTop) {
    return (
      <motion.div
        className="absolute w-[300px] h-[400px] sm:w-[340px] sm:h-[440px] rounded-2xl overflow-hidden shadow-lg bg-card"
        style={{
          scale: 1 - index * 0.05,
          y: index * 10,
          zIndex: 10 - index,
        }}
        initial={false}
      >
        <img
          src={imageUrl}
          alt="Cat"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute w-[300px] h-[400px] sm:w-[340px] sm:h-[440px] rounded-2xl overflow-hidden shadow-xl bg-card cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 20 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
      whileTap={{ scale: 1.02 }}
    >
      <img
        src={imageUrl}
        alt="Cat"
        className="w-full h-full object-cover pointer-events-none"
      />
      {/* Like overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-primary/20"
        style={{ opacity: likeOpacity }}
      >
        <div className="border-4 border-primary rounded-xl px-6 py-2 rotate-[-20deg]">
          <span className="text-primary text-4xl font-black">LIKE</span>
        </div>
      </motion.div>
      {/* Nope overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-destructive/20"
        style={{ opacity: nopeOpacity }}
      >
        <div className="border-4 border-destructive rounded-xl px-6 py-2 rotate-[20deg]">
          <span className="text-destructive text-4xl font-black">NOPE</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwipeCard;
