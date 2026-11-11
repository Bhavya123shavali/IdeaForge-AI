import { motion } from "framer-motion";

export default function LoadingOverlay({ message = "Analyzing your idea..." }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center loading-overlay bg-cream/85 dark:bg-night/85"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-5 text-center px-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative w-20 h-20">
          <motion.div className="absolute inset-0 rounded-full border-2 border-terracotta/20 dark:border-aurora-purple/20"
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div className="absolute inset-2 rounded-full border-2 border-terracotta/30 dark:border-aurora-blue/30"
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <motion.circle cx="50" cy="50" r="36" fill="none" stroke="url(#lGrad)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="170" strokeDashoffset="110"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
            <defs>
              <linearGradient id="lGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c4796b" />
                <stop offset="100%" stopColor="#6b8f71" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <motion.p className="font-display text-xl text-ink dark:text-white" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
            {message}
          </motion.p>
          <p className="mt-1.5 text-sm text-ink/35 dark:text-white/25">Running AI-powered validation</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-aurora-purple"
              animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
