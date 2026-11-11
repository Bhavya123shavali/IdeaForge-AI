import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const fields = [
  { key: "idea_name", label: "Idea name", type: "input" },
  { key: "problem_statement", label: "Problem statement", type: "textarea" },
  { key: "target_audience", label: "Target audience", type: "textarea" },
  { key: "revenue_model", label: "Revenue model", type: "textarea" }
];

export default function IdeaForm({ values, onChange, onSubmit, onSampleLoad, loading, sampleIdeas, error }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="idea-form-panel relative overflow-hidden rounded-2xl border border-ink/5 p-6 shadow-panel card-hover dark:border-white/6 md:p-8"
    >
      {/* Top accent */}
      <div className="form-top-accent absolute left-0 right-0 top-0 h-1 rounded-t-2xl" />
      <div className="form-soft-accent pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-10" />

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between relative">
        <div>
          <span className="pill">Founder Input</span>
          <h2 className="mt-2 font-display text-3xl leading-tight text-ink dark:text-[#1f2527]">
            Pressure-test your startup idea
          </h2>
        </div>
        <motion.select
          onChange={(e) => onSampleLoad(e.target.value)}
          defaultValue=""
          className="cursor-pointer rounded-lg border border-ink/6 bg-ink/3 px-3 py-2.5 text-sm text-ink outline-none transition-all hover:bg-ink/6 dark:border-white/8 dark:bg-night/80 dark:text-white/80 dark:hover:bg-night-surface"
          whileHover={{ scale: 1.01 }}
        >
          <option value="" disabled>Load sample idea</option>
          {sampleIdeas.map((idea, i) => (
            <option key={idea.idea_name} value={i}>{idea.idea_name}</option>
          ))}
        </motion.select>
      </div>

      {sampleIdeas.length > 0 && (
        <div className="relative mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink/35 dark:text-white/30">
            <Lightbulb className="h-3.5 w-3.5" />
            Idea starters
          </span>
          {sampleIdeas.slice(0, 4).map((idea, i) => (
            <motion.button
              key={idea.idea_name}
              type="button"
              onClick={() => onSampleLoad(String(i))}
              className="rounded-lg border border-ink/6 bg-white/45 px-3 py-2 text-xs font-semibold text-ink/55 transition-all hover:border-terracotta/25 hover:text-terracotta dark:border-white/8 dark:bg-white/5 dark:text-white/45 dark:hover:text-aurora-pink"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {idea.idea_name}
            </motion.button>
          ))}
        </div>
      )}

      <form className="grid gap-4 relative" onSubmit={onSubmit}>
        {fields.map((field, i) => (
          <motion.div key={field.key} className="floating-field" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.06 }}>
            {field.type === "input" ? (
              <input id={field.key} placeholder={field.label} value={values[field.key]} onChange={(e) => onChange(field.key, e.target.value)} />
            ) : (
              <textarea id={field.key} placeholder={field.label} rows={3} value={values[field.key]} onChange={(e) => onChange(field.key, e.target.value)} />
            )}
            <label htmlFor={field.key}>{field.label}</label>
          </motion.div>
        ))}

        <motion.button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:border dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/14"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
              Running validation...
            </span>
          ) : (
            "Generate validation report"
          )}
        </motion.button>

        {error && (
          <motion.p
            className="rounded-lg border border-terracotta/20 bg-terracotta/5 px-3 py-2 text-sm text-terracotta dark:border-terracotta/15 dark:bg-terracotta/10 dark:text-dusty-rose"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </form>
    </motion.div>
  );
}
