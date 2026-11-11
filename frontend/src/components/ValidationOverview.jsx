import { motion } from "framer-motion";
import { Gauge, ShieldAlert, Sparkles, Swords } from "lucide-react";
import { useEffect, useState } from "react";

function ScoreRing({ score }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const targetPercent = Math.max(0, Math.min(100, score * 10));
  useEffect(() => {
    const t = setTimeout(() => setAnimatedPercent(targetPercent), 100);
    return () => clearTimeout(t);
  }, [targetPercent]);

  return (
    <div className="relative h-32 w-32 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="58" fill="none" strokeWidth="7" className="stroke-ink/5 dark:stroke-white/5" />
        <motion.circle cx="70" cy="70" r="58" fill="none" strokeWidth="7" strokeLinecap="round" stroke="url(#sGrad)"
          strokeDasharray={2 * Math.PI * 58}
          initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - animatedPercent / 100) }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c4796b" />
            <stop offset="100%" stopColor="#6b8f71" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/30 dark:text-white/25">Score</span>
        <motion.span className="font-display text-3xl text-ink" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
          {score}
        </motion.span>
        <span className="text-[10px] text-ink/30 dark:text-white/25">of 10</span>
      </div>
    </div>
  );
}

export default function ValidationOverview({ report }) {
  const cards = [
    { title: "Competition", value: report.competition, icon: Swords, color: "text-terracotta dark:text-aurora-pink" },
    { title: "Product Feasibility", value: report.feasibility.product, icon: Gauge, color: "text-moss dark:text-aurora-green" },
    { title: "Go-to-market", value: report.feasibility.go_to_market, icon: Sparkles, color: "text-dusty-blue dark:text-aurora-blue" },
    { title: "Confidence", value: report.market_pulse.confidence, icon: ShieldAlert, color: "text-dusty-mauve dark:text-aurora-purple" }
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-5">
        <span className="pill">Headline View</span>
        <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row lg:items-start">
          <ScoreRing score={report.score} />
          <div className="space-y-2">
            <h2 className="font-display text-2xl text-ink">Validation Snapshot</h2>
            <p className="text-sm leading-6 text-ink/50 dark:text-white/45">{report.feasibility.notes}</p>
            <div className="h-2 overflow-hidden rounded-full bg-ink/5 dark:bg-white/5">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-terracotta to-moss dark:from-aurora-purple dark:to-aurora-blue"
                initial={{ width: 0 }} animate={{ width: `${report.market_pulse.demand * 10}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-ink/40 dark:text-white/35">Demand: {report.market_pulse.demand}/10 · {report.market_pulse.timing} timing</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-3 sm:grid-cols-2">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} className="glass-panel rounded-xl p-4 card-hover" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/35 dark:text-white/30">{card.title}</span>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <p className="font-display text-2xl text-ink">{card.value}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
