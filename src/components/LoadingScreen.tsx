import { motion } from "framer-motion";
import { Cat } from "lucide-react";

const LoadingScreen = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cat className="w-20 h-20 text-primary" strokeWidth={1.5} />
      </motion.div>
      <motion.p
        className="text-xl font-bold text-muted-foreground"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Herding cats...
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;
