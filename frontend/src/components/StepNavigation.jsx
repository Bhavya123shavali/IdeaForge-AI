import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const steps = [
  { key: "analysis", label: "Analysis" },
  { key: "ideas", label: "Ideas" },
  { key: "score", label: "Score" },
  { key: "strengths", label: "SWOT" },
  { key: "summary", label: "Summary" }
];

export default function StepNavigation({ currentStep, onStepChange }) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < steps.length - 1;

  return (
    <div className="sticky bottom-0 z-40 mt-6">
      <div className="mx-auto max-w-7xl px-5 pb-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl border p-3 flex items-center justify-between gap-3"
        >
          <motion.button
            onClick={() => canGoBack && onStepChange(steps[currentIndex - 1].key)}
            disabled={!canGoBack}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              canGoBack ? "bg-ink/5 text-ink dark:bg-white/5 dark:text-white cursor-pointer hover:bg-ink/8 dark:hover:bg-white/8" : "text-ink/15 dark:text-white/10 cursor-not-allowed"
            }`}
            whileHover={canGoBack ? { scale: 1.02 } : {}}
            whileTap={canGoBack ? { scale: 0.98 } : {}}
          >
            <ChevronLeft size={16} /> Back
          </motion.button>

          <div className="hidden sm:flex items-center gap-1.5">
            {steps.map((step, i) => {
              const isActive = step.key === currentStep;
              const isCompleted = i < currentIndex;
              return (
                <motion.button
                  key={step.key}
                  onClick={() => onStepChange(step.key)}
                  className="flex items-center gap-1.5 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isActive ? "w-7 bg-gradient-to-r from-terracotta to-moss dark:from-aurora-purple dark:to-aurora-blue"
                        : isCompleted ? "w-2 bg-terracotta/35 dark:bg-aurora-purple/35"
                        : "w-2 bg-ink/8 dark:bg-white/8"
                    }`}
                    layout
                  />
                </motion.button>
              );
            })}
          </div>

          <span className="sm:hidden text-xs font-medium text-ink/30 dark:text-white/25 uppercase tracking-wider">
            {currentIndex + 1}/{steps.length}
          </span>

          <motion.button
            onClick={() => canGoNext && onStepChange(steps[currentIndex + 1].key)}
            disabled={!canGoNext}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              canGoNext ? "bg-ink dark:bg-aurora-purple text-cream dark:text-white shadow-sm cursor-pointer hover:shadow-md"
                : "bg-moss dark:bg-aurora-green text-white shadow-sm cursor-default"
            }`}
            whileHover={canGoNext ? { scale: 1.02 } : {}}
            whileTap={canGoNext ? { scale: 0.98 } : {}}
          >
            {canGoNext ? "Next" : "Done"} {canGoNext && <ChevronRight size={16} />}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
