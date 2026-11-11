import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ValidationOverview from "../components/ValidationOverview";
import CompetitorTable from "../components/CompetitorTable";
import SwotGrid from "../components/SwotGrid";
import GapList from "../components/GapList";
import SuggestionsPanel from "../components/SuggestionsPanel";
import LikeButton from "../components/LikeButton";
import FilterDropdown from "../components/FilterDropdown";
import StepNavigation from "../components/StepNavigation";
import { api } from "../services/api";

export default function ResultsPage() {
  const { entryId } = useParams();
  const [currentStep, setCurrentStep] = useState("analysis");
  const [filter, setFilter] = useState("all");
  const [result, setResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(Boolean(entryId));

  useEffect(() => {
    let active = true;
    setCurrentStep("analysis");

    if (entryId) {
      setLoadingResult(true);
      api
        .getHistoryEntry(entryId)
        .then((entry) => {
          if (active) setResult(entry);
        })
        .catch(() => {
          if (active) setResult(null);
        })
        .finally(() => {
          if (active) setLoadingResult(false);
        });
      return () => {
        active = false;
      };
    }

    try {
      const raw = localStorage.getItem("startupscope_latest_result");
      setResult(raw ? JSON.parse(raw) : null);
    } catch {
      setResult(null);
    }
    setLoadingResult(false);

    return () => {
      active = false;
    };
  }, [entryId]);

  if (loadingResult) {
    return (
      <main className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 z-10">
        <div className="glass-panel rounded-2xl p-8 text-center">
          <h2 className="font-display text-3xl text-ink">Loading report...</h2>
          <p className="mt-3 text-sm leading-7 text-ink/45 dark:text-white/40">
            Pulling the saved validation details.
          </p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 z-10">
        <motion.div
          className="glass-panel rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl mb-3">🔬</div>
          <h2 className="font-display text-3xl text-ink">No report yet</h2>
          <p className="mt-3 text-sm leading-7 text-ink/45 dark:text-white/40">
            Validate an idea first to unlock the full dashboard.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-5">
            <Link
              to="/validate"
              className="inline-flex rounded-xl bg-ink dark:bg-aurora-purple px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-cream dark:text-white shadow-md hover:shadow-lg transition-all"
            >
              Create your first analysis
            </Link>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  const { idea, report } = result;

  const getFilteredScore = () => {
    const score = Number.parseFloat(report.score);
    if (Number.isNaN(score)) return false;
    switch (filter) {
      case "low": return score <= 5;
      case "medium": return score > 5 && score <= 7.5;
      case "high": return score > 7.5;
      default: return true;
    }
  };

  const matchesFilter = getFilteredScore();

  const stepVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "analysis":
        return (
          <motion.div key="analysis" className="space-y-5" {...stepVariants}>
            <motion.section
              className="rounded-2xl border border-ink/5 dark:border-white/5 bg-ink/90 dark:bg-night-card/90 backdrop-blur-xl p-6 text-cream shadow-panel-lg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/45">
                    Step 1 · Validation Report
                  </span>
                  <h2
                    className="mt-3 font-display text-3xl md:text-4xl"
                    style={{
                      background: "linear-gradient(135deg, #faf8f5 0%, #c4796b 80%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    {idea.idea_name}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-cream/45">
                    {idea.problem_statement}
                  </p>
                </div>
                <LikeButton ideaId={idea.idea_name} entry={result} />
              </div>
            </motion.section>
            <ValidationOverview report={report} />
          </motion.div>
        );

      case "ideas":
        return (
          <motion.div key="ideas" className="space-y-5" {...stepVariants}>
            <div className="flex items-center justify-between">
              <div>
                <span className="pill">Step 2</span>
                <h2 className="mt-2 font-display text-2xl text-ink">Competitor Landscape & Ideas</h2>
              </div>
              <LikeButton ideaId={idea.idea_name} entry={result} />
            </div>
            <CompetitorTable competitors={report.competitors} />
            <SuggestionsPanel suggestions={report.suggestions} memoryInsights={report.memory_insights} />
          </motion.div>
        );

      case "score":
        return (
          <motion.div key="score" className="space-y-5" {...stepVariants}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="pill">Step 3</span>
                <h2 className="mt-2 font-display text-2xl text-ink">Score & Metrics</h2>
              </div>
              <FilterDropdown onFilterChange={setFilter} currentFilter={filter} />
            </div>
            {matchesFilter ? (
              <>
                <motion.div className="glass-panel rounded-2xl p-7" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="flex flex-col md:flex-row items-center gap-7">
                    <div className="relative">
                      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="68" fill="none" strokeWidth="7" className="stroke-ink/5 dark:stroke-white/5" />
                        <motion.circle
                          cx="80" cy="80" r="68" fill="none" strokeWidth="7"
                          strokeLinecap="round" stroke="url(#scoreG)"
                          strokeDasharray={2 * Math.PI * 68}
                          initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - report.score / 10) }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        />
                        <defs>
                          <linearGradient id="scoreG" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#c4796b" />
                            <stop offset="100%" stopColor="#6b8f71" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span className="font-display text-4xl text-ink" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>
                          {report.score}
                        </motion.span>
                        <span className="text-xs text-ink/35 dark:text-white/30">out of 10</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      {[
                        { label: "Market Demand", value: report.market_pulse.demand, max: 10 },
                        { label: "Confidence", value: typeof report.market_pulse.confidence === "string" ? 7 : report.market_pulse.confidence, max: 10 },
                        { label: "Overall Score", value: report.score, max: 10 }
                      ].map((m, i) => (
                        <div key={m.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-ink/45 dark:text-white/40">{m.label}</span>
                            <span className="font-semibold text-ink">{m.value}/{m.max}</span>
                          </div>
                          <div className="h-2 rounded-full bg-ink/5 dark:bg-white/5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-terracotta to-moss dark:from-aurora-purple dark:to-aurora-blue"
                              initial={{ width: 0 }}
                              animate={{ width: `${(m.value / m.max) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.15 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                <GapList gaps={report.gaps} />
              </>
            ) : (
              <motion.div className="glass-panel rounded-2xl p-7 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-display text-xl text-ink">Score doesn't match filter</h3>
                <p className="mt-2 text-sm text-ink/40 dark:text-white/35">
                  This idea's score ({report.score * 10}%) doesn't fall in the "{filter}" range.
                </p>
              </motion.div>
            )}
          </motion.div>
        );

      case "strengths":
        return (
          <motion.div key="strengths" className="space-y-5" {...stepVariants}>
            <div>
              <span className="pill">Step 4</span>
              <h2 className="mt-2 font-display text-2xl text-ink">Strengths & Weaknesses</h2>
              <p className="mt-1 text-sm text-ink/40 dark:text-white/35">SWOT analysis of your startup idea</p>
            </div>
            <SwotGrid swot={report.swot} />
          </motion.div>
        );

      case "summary":
        return (
          <motion.div key="summary" className="space-y-5" {...stepVariants}>
            <div>
              <span className="pill">Step 5</span>
              <h2 className="mt-2 font-display text-2xl text-ink">Summary</h2>
            </div>

            <motion.div
              className="rounded-2xl border border-ink/5 dark:border-white/5 bg-gradient-to-br from-ink/90 to-moss/70 dark:from-night-card dark:to-night-surface backdrop-blur-xl p-7 text-cream shadow-panel-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3
                    className="font-display text-3xl"
                    style={{ background: "linear-gradient(135deg, #faf8f5 0%, #c4796b 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  >
                    {idea.idea_name}
                  </h3>
                  <p className="mt-1.5 text-cream/40 text-sm">{idea.problem_statement}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-display text-4xl text-white">{report.score}</div>
                    <div className="text-[10px] text-cream/40 uppercase tracking-wider">Score</div>
                  </div>
                  <LikeButton ideaId={idea.idea_name} entry={result} />
                </div>
              </div>
            </motion.div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                { icon: "⚔️", label: "Competition", val: report.competition },
                { icon: "📈", label: "Market Timing", val: report.market_pulse.timing },
                { icon: "🎯", label: "Demand", val: `${report.market_pulse.demand}/10` }
              ].map((c, i) => (
                <motion.div key={c.label} className="glass-panel rounded-xl p-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                  <div className="text-xl mb-1.5">{c.icon}</div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/35 dark:text-white/30">{c.label}</p>
                  <p className="mt-0.5 font-display text-lg text-ink">{c.val}</p>
                </motion.div>
              ))}
            </div>

            <motion.div className="glass-panel rounded-xl p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h4 className="font-display text-lg text-ink mb-2">🔎 Key Gaps</h4>
              <div className="space-y-1.5">
                {report.gaps.slice(0, 3).map((gap, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink/55 dark:text-white/45">
                    <span className="text-terracotta dark:text-aurora-pink font-bold">{i + 1}.</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="glass-panel rounded-xl p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h4 className="font-display text-lg text-ink mb-2">💡 Top Suggestions</h4>
              <div className="space-y-1.5">
                {report.suggestions.slice(0, 3).map((sug, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink/55 dark:text-white/45">
                    <span className="text-moss dark:text-aurora-green font-bold">{i + 1}.</span>
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to="/validate" className="inline-flex rounded-xl bg-ink dark:bg-aurora-purple px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-cream dark:text-white shadow-md transition-all">
                  Validate another idea
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to="/history" className="inline-flex rounded-xl border border-ink/8 dark:border-white/8 bg-white/40 dark:bg-white/5 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-ink shadow-sm transition-all">
                  View history
                </Link>
              </motion.div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="relative mx-auto max-w-7xl px-5 py-8 md:px-8 lg:py-12 z-10 min-h-[60vh]">
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      <StepNavigation currentStep={currentStep} onStepChange={setCurrentStep} />
    </main>
  );
}
