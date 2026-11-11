import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Search, Zap } from "lucide-react";
import IdeaForm from "../components/IdeaForm";
import FloatingAnalyzeButton from "../components/FloatingAnalyzeButton";
import LoadingOverlay from "../components/LoadingOverlay";
import { api } from "../services/api";

const initialValues = {
  idea_name: "",
  problem_statement: "",
  target_audience: "",
  revenue_model: ""
};

const featureCards = [
  {
    icon: Search,
    title: "Competitor scan",
    desc: "Synthetic market map",
    color: "text-dusty-blue dark:text-aurora-blue"
  },
  {
    icon: Brain,
    title: "Memory engine",
    desc: "Detects repeated patterns",
    color: "text-dusty-mauve dark:text-aurora-purple"
  },
  {
    icon: Zap,
    title: "Gap detector",
    desc: "Flags weak models",
    color: "text-terracotta dark:text-aurora-pink",
    centered: true
  }
];

export default function ValidatePage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [sampleIdeas, setSampleIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getSampleIdeas().then(setSampleIdeas).catch(() => setSampleIdeas([]));
  }, []);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSampleLoad = (value) => {
    const selected = sampleIdeas[Number(value)];
    if (selected) setValues(selected);
  };

  const handleSubmit = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    const missingField = Object.entries(values).find(([, value]) => !value.trim());
    if (missingField) {
      setError("Fill in all fields or pick one of the idea starters first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await api.validateIdea(values);
      localStorage.setItem("startupscope_latest_result", JSON.stringify(result));
      window.dispatchEvent(new Event("historyChanged"));
      navigate("/results");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingOverlay message="Analyzing your idea..." />}
      </AnimatePresence>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-6 px-5 py-10 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
        <IdeaForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onSampleLoad={handleSampleLoad}
          loading={loading}
          sampleIdeas={sampleIdeas}
          error={error}
        />

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-5"
        >
          <motion.div
            className="rounded-2xl border border-ink/5 bg-ink/90 p-7 text-cream shadow-panel-lg backdrop-blur-xl dark:border-white/5 dark:bg-night-card/90"
            whileHover={{ y: -3 }}
          >
            <motion.span
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Built for real founder decisions
            </motion.span>
            <motion.h2
              className="mt-4 font-display text-4xl leading-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "linear-gradient(135deg, #faf8f5 0%, #c4796b 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              From vague instinct to an investable report.
            </motion.h2>
            <motion.p
              className="mt-4 text-sm leading-7 text-cream/45"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Competitor scanning, AI scoring, SWOT breakdowns, and memory-aware warnings from past ideas.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid flex-1 auto-rows-fr gap-4 sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {featureCards.map((feature, i) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  className={`glass-panel flex min-h-[210px] flex-col items-center justify-center rounded-xl p-6 text-center card-hover ${
                    feature.centered ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)]" : ""
                  }`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="mb-3 flex items-center justify-center gap-2.5">
                    <Icon className={`h-5 w-5 ${feature.color}`} />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 dark:text-white/45">
                      {feature.title}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-ink/55 dark:text-white/50">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>
      </main>

      <FloatingAnalyzeButton onClick={handleSubmit} loading={loading} />
    </>
  );
}
