import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HistoryTimeline from "../components/HistoryTimeline";
import ComparisonDrawer from "../components/ComparisonDrawer";
import { api } from "../services/api";

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshHistory = () => {
    setLoading(true);
    api
      .getHistory()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshHistory();
    window.addEventListener("historyChanged", refreshHistory);
    return () => window.removeEventListener("historyChanged", refreshHistory);
  }, []);
  useEffect(() => {
    if (selectedIds.length >= 2) api.compareIdeas(selectedIds).then(setComparison).catch(() => setComparison(null));
    else setComparison(null);
  }, [selectedIds]);

  const toggleSelection = (id) => {
    setSelectedIds(c => c.includes(id) ? c.filter(x => x !== id) : c.length === 4 ? [...c.slice(1), id] : [...c, id]);
  };

  const handleDelete = async (id) => {
    await api.deleteHistoryEntry(id);
    setEntries((current) => current.filter((entry) => entry.id !== id));
    setSelectedIds((current) => current.filter((entryId) => entryId !== id));
  };

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-5 py-8 md:px-8 lg:py-12">
      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div className="glass-panel rounded-2xl p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="pill">Founder Memory</span>
          <h2 className="mt-3 font-display text-4xl text-ink">History & comparison</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/45 dark:text-white/40">
            Review prior concepts, compare validations, and track improvement over time.
          </p>
        </motion.div>
        <ComparisonDrawer data={comparison} />
      </section>

      {loading ? (
        <motion.div className="glass-panel rounded-2xl p-8 text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-display text-3xl text-ink">Loading history...</h3>
          <p className="mt-3 text-sm leading-6 text-ink/45 dark:text-white/40">Fetching saved reports.</p>
        </motion.div>
      ) : entries.length ? (
        <HistoryTimeline entries={entries} selectedIds={selectedIds} onToggle={toggleSelection} onDelete={handleDelete} />
      ) : (
        <motion.div className="glass-panel rounded-2xl p-8 text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-4xl mb-3">📝</div>
          <h3 className="font-display text-3xl text-ink">No history yet</h3>
          <p className="mt-3 text-sm leading-6 text-ink/45 dark:text-white/40">Validate a few ideas and this becomes your memory-backed founder lab.</p>
        </motion.div>
      )}
    </main>
  );
}
