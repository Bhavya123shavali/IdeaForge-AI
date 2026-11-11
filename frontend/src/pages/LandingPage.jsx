import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, BarChart3, Shield, Brain, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pt-16 pb-8 md:px-8 lg:pt-24 lg:pb-14">
        <div className="flex flex-col items-center text-center">
          <motion.span
            className="pill mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            AI-Powered Startup Validation
          </motion.span>

          <motion.h1
            className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] max-w-4xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              background: "linear-gradient(140deg, #2d3436 0%, #c4796b 55%, #6b8f71 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Validate before you build.
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-base leading-7 text-ink/50 dark:text-white/45"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Transform your raw startup instinct into an investable validation
            report — with competitor scanning, SWOT breakdowns, and memory-aware insights.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-8 flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/validate"
                className="inline-flex items-center gap-2 rounded-xl bg-ink dark:bg-aurora-purple/90 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-cream dark:text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Analysis
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/history"
                className="inline-flex items-center gap-2 rounded-xl border border-ink/8 dark:border-white/8 bg-white/40 dark:bg-white/5 backdrop-blur-md px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-ink shadow-sm hover:shadow-md transition-all duration-300"
              >
                View Past Reports
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 py-14 md:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="pill">What You Get</span>
          <h2 className="mt-3 font-display text-3xl text-ink">
            Everything a founder needs
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, title: "Instant Analysis", desc: "Full validation report in seconds with AI and market data", color: "text-terracotta dark:text-aurora-pink" },
            { icon: BarChart3, title: "Competitor Scan", desc: "Market mapping with live data or synthetic demo mode", color: "text-moss dark:text-aurora-green" },
            { icon: Shield, title: "SWOT Breakdown", desc: "Strengths, weaknesses, opportunities, and threats in one view", color: "text-dusty-blue dark:text-aurora-blue" },
            { icon: Brain, title: "Memory Engine", desc: "Detects patterns and warns against prior weak positioning", color: "text-dusty-mauve dark:text-aurora-purple" }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="glass-panel rounded-2xl p-5 card-hover"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-10 h-10 rounded-lg bg-ink/5 dark:bg-white/5 flex items-center justify-center mb-3">
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-display text-lg text-ink">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink/45 dark:text-white/40">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 py-14 md:px-8">
        <motion.div
          className="rounded-2xl border border-ink/5 dark:border-white/5 bg-ink/90 dark:bg-night-card/90 backdrop-blur-xl p-8 md:p-10 text-cream shadow-panel-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-terracotta dark:text-aurora-purple" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/45">
              How it works
            </span>
          </div>
          <h2
            className="font-display text-3xl md:text-4xl"
            style={{
              background: "linear-gradient(135deg, #faf8f5 0%, #c4796b 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Three steps to validation clarity
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { step: "01", title: "Describe your idea", desc: "Enter startup name, problem, audience, and revenue model" },
              { step: "02", title: "AI analyzes it", desc: "Competitor scan, SWOT analysis, gap detection, and scoring" },
              { step: "03", title: "Get your report", desc: "Step-by-step validation report with actionable insights" }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="rounded-xl border border-white/5 bg-white/5 p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <span className="font-display text-2xl text-terracotta dark:text-aurora-purple">{item.step}</span>
                <h3 className="mt-1.5 font-display text-lg text-cream">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-cream/40">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/validate"
                className="inline-flex items-center gap-2 rounded-xl bg-terracotta dark:bg-aurora-purple px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-lg hover:shadow-xl transition-all"
              >
                Try it now
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
