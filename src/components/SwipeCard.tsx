import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { forwardRef, useRef, useImperativeHandle } from "react";

interface SwipeCardProps {
  imageUrl: string;
  tags?: string[];
  onSwipeComplete: (direction: "left" | "right") => void;
  isTop: boolean;
  index: number;
}

export interface SwipeCardHandle {
  flyOut: (direction: "left" | "right") => void;
}

const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(
  ({ imageUrl, tags = [], onSwipeComplete, isTop, index }, ref) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-18, 18]);
    const cardOpacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [20, 120], [0, 1]);
    const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);
    const isAnimating = useRef(false);

    const flyOut = (direction: "left" | "right") => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      const target = direction === "right" ? 500 : -500;
      animate(x, target, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        velocity: direction === "right" ? 800 : -800,
        onComplete: () => onSwipeComplete(direction),
      });
    };

    useImperativeHandle(ref, () => ({ flyOut }));

    const handleDragEnd = (_: any, info: PanInfo) => {
      if (isAnimating.current) return;
      const threshold = 80;
      if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 500) {
        flyOut(info.offset.x > 0 ? "right" : "left");
      } else {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      }
    };

    const visibleTags = tags.slice(0, 3);

    if (!isTop) {
      return (
        <motion.div
          className="absolute w-[300px] h-[400px] sm:w-[340px] sm:h-[440px] rounded-3xl overflow-hidden shadow-xl bg-card"
          animate={{ scale: 1 - index * 0.05, y: index * 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ zIndex: 10 - index }}
        >
          <img src={imageUrl} alt="Cat" className="w-full h-full object-cover" loading="lazy" />
          {/* Bottom tag overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-12">
            <div className="flex flex-wrap gap-1.5">
              {visibleTags.map((tag) => (
                <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="absolute w-[300px] h-[400px] sm:w-[340px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl bg-card cursor-grab active:cursor-grabbing touch-none"
        style={{ x, rotate, opacity: cardOpacity, zIndex: 20 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <img src={imageUrl} alt="Cat" className="w-full h-full object-cover pointer-events-none select-none" />

        {/* Bottom gradient + tags */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-12 pointer-events-none select-none">
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleTags.map((tag) => (
                <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* LIKE stamp */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: likeOpacity }}
        >
          <div className="border-4 border-pink-400 rounded-2xl px-6 py-2 rotate-[-20deg] bg-pink-400/10 backdrop-blur-sm">
            <span className="text-pink-400 text-4xl font-black drop-shadow">LIKE 💖</span>
          </div>
        </motion.div>

        {/* NOPE stamp */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: nopeOpacity }}
        >
          <div className="border-4 border-rose-500 rounded-2xl px-6 py-2 rotate-[20deg] bg-rose-500/10 backdrop-blur-sm">
            <span className="text-rose-500 text-4xl font-black drop-shadow">NOPE 💔</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

SwipeCard.displayName = "SwipeCard";

export default SwipeCard;
