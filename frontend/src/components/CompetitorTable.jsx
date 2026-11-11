import { motion } from "framer-motion";

export default function CompetitorTable({ competitors }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-5">
      <div className="mb-4">
        <span className="pill">Competitor Insights</span>
        <h3 className="mt-2 font-display text-2xl text-ink">Landscape scan</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/30 dark:text-white/25">
              <th className="px-3 py-1">Competitor</th>
              <th className="px-3 py-1">Summary</th>
              <th className="px-3 py-1">Strength</th>
              <th className="px-3 py-1">Weakness</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <motion.tr key={c.name} className="rounded-xl bg-white/50 dark:bg-white/3 text-sm text-ink/60 dark:text-white/50"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.06 }}>
                <td className="rounded-l-xl px-3 py-3 font-semibold text-ink">{c.name}</td>
                <td className="px-3 py-3">{c.summary}</td>
                <td className="px-3 py-3">{c.strength}</td>
                <td className="rounded-r-xl px-3 py-3">{c.weakness}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
