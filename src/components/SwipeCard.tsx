import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { useRef } from "react";

interface SwipeCardProps {
  imageUrl: string;
  onSwipeComplete: (direction: "left" | "right") => void;
  isTop: boolean;
  index: number;
}

const SwipeCard = ({ imageUrl, onSwipeComplete, isTop, index }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
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
      onComplete: () => {
        onSwipeComplete(direction);
      },
    });
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (isAnimating.current) return;
    const threshold = 80;
    const velocity = Math.abs(info.velocity.x);

    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      const dir = info.offset.x > 0 ? "right" : "left";
      flyOut(dir);
    } else {
      // Snap back
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  // Expose flyOut via ref-like pattern through the component
  // We attach it to the DOM node as a custom property for the parent to call
  const cardRef = useRef<HTMLDivElement>(null);
  if (cardRef.current) {
    (cardRef.current as any).__flyOut = flyOut;
  }

  if (!isTop) {
    return (
      <motion.div
        className="absolute w-[300px] h-[400px] sm:w-[340px] sm:h-[440px] rounded-2xl overflow-hidden shadow-lg bg-card"
        animate={{
          scale: 1 - index * 0.05,
          y: index * 10,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ zIndex: 10 - index }}
      >
        <img src={imageUrl} alt="Cat" className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute w-[300px] h-[400px] sm:w-[340px] sm:h-[440px] rounded-2xl overflow-hidden shadow-xl bg-card cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate, zIndex: 20 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <img src={imageUrl} alt="Cat" className="w-full h-full object-cover pointer-events-none select-none" />
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

// Helper to trigger fly-out from parent via ref
SwipeCard.flyOut = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
  if (ref.current && (ref.current as any).__flyOut) {
    (ref.current as any).__flyOut(direction);
  }
};

export default SwipeCard;
