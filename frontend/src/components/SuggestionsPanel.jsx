import { ArrowUpRight, History } from "lucide-react";
import { motion } from "framer-motion";

export default function SuggestionsPanel({ suggestions, memoryInsights }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-[1.25fr_0.9fr]">
      <div className="glass-panel rounded-2xl p-5">
        <span className="pill">Strategic Suggestions</span>
        <div className="mt-4 grid gap-2">
          {suggestions.map((s, i) => (
            <motion.div key={s} className="flex items-start gap-2.5 rounded-lg bg-white/50 dark:bg-white/3 px-3 py-3 text-sm text-ink/60 dark:text-white/50"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-moss dark:text-aurora-green" />
              <span><strong className="mr-1.5 text-ink">0{i + 1}</strong>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-terracotta dark:text-aurora-purple" />
          <span className="pill">Memento Memory</span>
        </div>
        <h3 className="mt-2 font-display text-2xl text-ink">Historical learning</h3>
        <div className="mt-4 space-y-3 text-sm leading-6 text-ink/50 dark:text-white/40">
          <p>Past entries: {memoryInsights.entry_count}</p>
          <p>Similar: {memoryInsights.similar_entries.length ? memoryInsights.similar_entries.map(e => `${e.idea_name} (${Math.round(e.similarity * 100)}%)`).join(", ") : "No close matches."}</p>
          <p>Patterns: {memoryInsights.repeated_patterns.length ? memoryInsights.repeated_patterns.join(" | ") : "No recurring patterns."}</p>
          <p>Warning: {memoryInsights.historical_warnings[0] || "Nothing severe from history."}</p>
        </div>
      </div>
    </motion.section>
  );
}
