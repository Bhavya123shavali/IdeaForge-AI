import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function GapList({ gaps }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-5">
      <span className="pill">Gap Detector</span>
      <h3 className="mt-2 font-display text-2xl text-ink">Weak points to fix</h3>
      <div className="mt-4 grid gap-2">
        {gaps.map((gap, i) => (
          <motion.div key={gap} className="flex items-start gap-2.5 rounded-lg bg-white/50 dark:bg-white/3 px-3 py-3 text-sm text-ink/55 dark:text-white/45 card-hover"
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-terracotta dark:text-aurora-pink" />
            <span>{gap}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
