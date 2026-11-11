import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GitCompare, ExternalLink, Trash2 } from "lucide-react";
import LikeButton from "./LikeButton";

export default function HistoryTimeline({ entries, selectedIds, onToggle, onDelete }) {
  return (
    <div className="grid gap-3">
      {entries.map((entry, i) => {
        const active = selectedIds.includes(entry.id);
        return (
          <motion.div key={entry.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className={`text-left rounded-xl border p-4 transition-all card-hover ${
              active
                ? "border-terracotta/20 dark:border-aurora-purple/20 bg-ink/90 dark:bg-night-card text-cream"
                : "border-ink/4 dark:border-white/4 bg-white/50 dark:bg-white/3 text-ink hover:-translate-y-0.5"
            }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${active ? "text-cream/45" : "text-ink/25 dark:text-white/20"}`}>
                  {new Date(entry.created_at).toLocaleString()}
                </p>
                <h3 className="mt-1.5 font-display text-xl">{entry.idea.idea_name}</h3>
              </div>
              <div className="flex items-center gap-2.5">
                <LikeButton ideaId={entry.idea.idea_name} entry={entry} size="sm" />
                <div className="text-right">
                  <p className={`text-xs ${active ? "text-cream/50" : "text-ink/35 dark:text-white/30"}`}>Score</p>
                  <p className="font-display text-3xl">{entry.report.score}</p>
                </div>
              </div>
            </div>
            <p className={`mt-3 text-sm leading-5 line-clamp-2 ${active ? "text-cream/50" : "text-ink/45 dark:text-white/35"}`}>
              {entry.idea.problem_statement}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onToggle(entry.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-all ${
                  active
                    ? "border-white/15 bg-white/10 text-cream"
                    : "border-ink/8 bg-white/40 text-ink/55 dark:border-white/8 dark:bg-white/5 dark:text-white/45"
                }`}
              >
                <GitCompare className="h-3.5 w-3.5" />
                {active ? "Selected" : "Compare"}
              </button>
              <Link
                to={`/results/${entry.id}`}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-all ${
                  active
                    ? "bg-white/10 text-cream"
                    : "bg-ink text-cream dark:bg-white/10 dark:text-white"
                }`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open report
              </Link>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-all ${
                  active
                    ? "border-terracotta/35 bg-terracotta/15 text-dusty-rose"
                    : "border-terracotta/20 bg-terracotta/5 text-terracotta dark:border-aurora-pink/20 dark:bg-aurora-pink/8 dark:text-aurora-pink"
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
