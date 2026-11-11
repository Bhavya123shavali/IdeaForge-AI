import { motion } from "framer-motion";

const config = {
  strengths: { bg: "bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-500/3 dark:to-transparent", border: "border-emerald-200/30 dark:border-emerald-500/6", icon: "💪" },
  weaknesses: { bg: "bg-gradient-to-br from-red-50/50 to-orange-50/30 dark:from-red-500/3 dark:to-transparent", border: "border-red-200/30 dark:border-red-500/6", icon: "⚠️" },
  opportunities: { bg: "bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-500/3 dark:to-transparent", border: "border-blue-200/30 dark:border-blue-500/6", icon: "🚀" },
  threats: { bg: "bg-gradient-to-br from-amber-50/50 to-yellow-50/30 dark:from-amber-500/3 dark:to-transparent", border: "border-amber-200/30 dark:border-amber-500/6", icon: "🛡️" }
};

export default function SwotGrid({ swot }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 lg:grid-cols-2">
      {Object.entries(swot).map(([key, items], si) => {
        const c = config[key] || config.strengths;
        return (
          <motion.div key={key} className={`rounded-xl border ${c.border} ${c.bg} p-5 card-hover`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}>
            <div className="flex items-center gap-2">
              <span className="text-base">{c.icon}</span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/35 dark:text-white/30">{key}</p>
            </div>
            <ul className="mt-3 space-y-2">
              {items.map((item, i) => (
                <motion.li key={item} className="rounded-lg bg-white/50 dark:bg-white/3 px-3 py-2.5 text-sm leading-6 text-ink/55 dark:text-white/45"
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.08 + i * 0.04 }}>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
