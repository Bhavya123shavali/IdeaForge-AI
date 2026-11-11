import { motion } from "framer-motion";

export default function ComparisonDrawer({ data }) {
  if (!data) {
    return (
      <div className="glass-panel rounded-2xl p-5">
        <span className="pill">Comparison</span>
        <h3 className="mt-2 font-display text-2xl text-ink">Select 2–4 ideas to compare</h3>
        <p className="mt-3 text-sm leading-6 text-ink/45 dark:text-white/40">
          Highlights the strongest score, most urgent gap, and clearest next move.
        </p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-2xl p-5">
      <span className="pill">Comparison</span>
      <h3 className="mt-2 font-display text-2xl text-ink">Multi-idea benchmark</h3>
      <p className="mt-2 rounded-lg bg-white/50 dark:bg-white/3 px-3 py-2.5 text-sm text-ink/55 dark:text-white/45">
        Best: <strong className="text-ink">{data.leader.idea_name}</strong> — score {data.leader.score}
      </p>
      <div className="mt-4 grid gap-2">
        {data.comparison.map((item, i) => (
          <motion.div key={item.id} className="rounded-lg bg-white/50 dark:bg-white/3 px-3 py-3 text-sm text-ink/55 dark:text-white/45"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-ink">{item.idea_name}</h4>
              <span className="rounded-full bg-ink dark:bg-aurora-purple px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream dark:text-white">{item.score}/10</span>
            </div>
            <p className="mt-1">Competition: {item.competition}</p>
            <p className="mt-0.5">Top gap: {item.top_gap}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
