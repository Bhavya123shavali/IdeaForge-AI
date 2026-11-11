import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, GitCompare, HeartOff, Trash2 } from "lucide-react";
import FilterDropdown from "../components/FilterDropdown";
import { api } from "../services/api";

const likedCardStyle = {
  position: "relative",
  zIndex: 60,
  display: "block",
  width: "100%",
  minHeight: "150px",
  padding: "18px 22px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "linear-gradient(135deg, rgba(45,52,54,0.98), rgba(45,52,54,0.94))",
  color: "#faf8f5",
  boxShadow: "0 18px 65px rgba(45,52,54,0.2)",
  opacity: 1,
  isolation: "isolate"
};

const mutedTextStyle = {
  color: "rgba(250,248,245,0.68)"
};

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "9px",
  border: "1px solid rgba(250,248,245,0.16)",
  background: "rgba(250,248,245,0.08)",
  padding: "7px 10px",
  color: "rgba(250,248,245,0.82)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase"
};

export default function LikedIdeasPage() {
  const [likedIdeas, setLikedIdeas] = useState({});
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLiked = () => {
    try {
      setLikedIdeas(JSON.parse(localStorage.getItem("likedIdeas") || "{}"));
    } catch {
      setLikedIdeas({});
    }
  };

  const refreshData = () => {
    loadLiked();
    setLoading(true);
    api
      .getHistory()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshData();
    window.addEventListener("likedIdeasChanged", refreshData);
    window.addEventListener("historyChanged", refreshData);
    return () => {
      window.removeEventListener("likedIdeasChanged", refreshData);
      window.removeEventListener("historyChanged", refreshData);
    };
  }, []);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      api.compareIdeas(selectedIds).then(setComparison).catch(() => setComparison(null));
    } else {
      setComparison(null);
    }
  }, [selectedIds]);

  const likedList = Object.entries(likedIdeas).filter(([, record]) => record === true || record?.liked);
  const entriesByName = new Map(entries.map((entry) => [entry.idea.idea_name, entry]));
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const likedItems = likedList.map(([key, record]) => {
    const ideaId = record?.idea?.idea_name || record?.ideaId || key;
    const entry =
      entriesById.get(record?.entryId || key) ||
      entriesByName.get(ideaId) ||
      (record?.idea && record?.report
        ? {
            id: record.entryId || key,
            created_at: record.created_at,
            idea: record.idea,
            report: record.report
          }
        : null);

    return { key, ideaId, entry };
  });
  const filteredItems = likedItems.filter(({ entry }) => {
    if (filter === "all") return true;
    if (!entry?.report?.score) return false;

    const score = Number.parseFloat(entry.report.score);
    if (Number.isNaN(score)) return false;
    if (filter === "low") return score <= 5;
    if (filter === "medium") return score > 5 && score <= 7.5;
    if (filter === "high") return score > 7.5;
    return true;
  });
  const removeLiked = (key, ideaId, entryId) => {
    const next = { ...likedIdeas };
    delete next[key];
    delete next[ideaId];
    localStorage.setItem("likedIdeas", JSON.stringify(next));
    setLikedIdeas(next);
    if (entryId) setSelectedIds((current) => current.filter((id) => id !== entryId));
    window.dispatchEvent(new Event("likedIdeasChanged"));
  };

  const deleteReport = async (key, ideaId, entryId) => {
    if (!entryId) {
      removeLiked(key, ideaId, entryId);
      return;
    }
    await api.deleteHistoryEntry(entryId);
    setEntries((current) => current.filter((entry) => entry.id !== entryId));
    setSelectedIds((current) => current.filter((id) => id !== entryId));
    removeLiked(key, ideaId, entryId);
  };

  const toggleCompare = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : current.length === 4 ? [...current.slice(1), id] : [...current, id]
    );
  };

  return (
    <main className="relative z-30 mx-auto max-w-7xl space-y-5 px-2 py-4 sm:px-5 md:px-8 lg:py-8">
      <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <span className="pill">Favorites</span>
          <h2 className="mt-2 font-display text-4xl text-ink dark:text-white">Liked Ideas</h2>
          <p className="mt-2 text-sm text-ink/50 dark:text-white/45">
            Your saved ideas from validation reports.
          </p>
        </div>
        {likedList.length > 0 && (
          <FilterDropdown onFilterChange={setFilter} currentFilter={filter} />
        )}
      </motion.div>

      {comparison && (
        <motion.div className="glass-panel rounded-2xl p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="pill">Liked comparison</span>
          <h3 className="mt-2 font-display text-2xl text-ink dark:text-white">
            Best liked idea: {comparison.leader.idea_name}
          </h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {comparison.comparison.map((item) => (
              <div key={item.id} className="rounded-lg border border-ink/6 bg-white/90 px-3 py-2 text-sm text-ink/70 shadow-sm dark:border-white/8 dark:bg-night-card/90 dark:text-white/70">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-ink dark:text-white">{item.idea_name}</strong>
                  <span>{item.score}/10</span>
                </div>
                <p className="mt-1 line-clamp-1">Next: {item.best_suggestion}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="glass-panel rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl text-ink dark:text-white">Loading saved ideas...</h3>
          <p className="mt-2 text-sm text-ink/50 dark:text-white/40">Checking history and favorites.</p>
        </div>
      ) : likedList.length > 0 ? (
          <div className="relative z-[60] grid gap-3">
            {filteredItems.length > 0 ? filteredItems.map(({ key, ideaId, entry }) => (
              <div
                key={key}
                style={likedCardStyle}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span
                      style={{
                        display: "inline-flex",
                        borderRadius: "999px",
                        border: "1px solid rgba(250,248,245,0.14)",
                        background: "rgba(250,248,245,0.07)",
                        padding: "4px 10px",
                        color: "rgba(250,248,245,0.62)",
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase"
                      }}
                    >
                      {entry?.created_at ? new Date(entry.created_at).toLocaleString() : "Saved idea"}
                    </span>
                    <h3
                      className="font-display"
                      style={{
                        marginTop: "18px",
                        color: "#faf8f5",
                        fontSize: "clamp(24px, 3vw, 32px)",
                        lineHeight: 1.08,
                        overflowWrap: "anywhere"
                      }}
                    >
                      {ideaId}
                    </h3>
                    <p
                      style={{
                        ...mutedTextStyle,
                        marginTop: "8px",
                        maxWidth: "980px",
                        fontSize: "13px",
                        lineHeight: 1.55
                      }}
                    >
                      {entry?.idea?.problem_statement || "No description available for this saved idea."}
                    </p>
                  </div>
                  <div
                    style={{
                      minWidth: "82px",
                      borderRadius: "12px",
                      border: "1px solid rgba(250,248,245,0.14)",
                      background: "rgba(250,248,245,0.08)",
                      padding: "10px 12px",
                      textAlign: "center"
                    }}
                  >
                    <p style={{ margin: 0, color: "rgba(250,248,245,0.55)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Score</p>
                    <strong className="font-display" style={{ display: "block", color: "#fff", fontSize: "30px", lineHeight: 1 }}>
                      {entry?.report?.score ?? "-"}
                    </strong>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry && (
                    <>
                      <Link
                        to={`/results/${entry.id}`}
                        style={{ ...buttonStyle, background: "#faf8f5", color: "#2d3436" }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleCompare(entry.id)}
                        style={{
                          ...buttonStyle,
                          background: selectedIds.includes(entry.id) ? "rgba(143,170,145,0.24)" : buttonStyle.background,
                          color: "#faf8f5"
                        }}
                      >
                        <GitCompare className="h-3.5 w-3.5" />
                        {selectedIds.includes(entry.id) ? "Selected" : "Compare"}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeLiked(key, ideaId, entry?.id)}
                    style={{ ...buttonStyle, borderColor: "rgba(196,121,107,0.36)", background: "rgba(196,121,107,0.16)", color: "#f2c3ba" }}
                  >
                    <HeartOff className="h-3.5 w-3.5" />
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReport(key, ideaId, entry?.id)}
                    style={{ ...buttonStyle, borderColor: "rgba(255,255,255,0.22)", background: "rgba(0,0,0,0.18)", color: "#ffffff" }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )) : (
              <motion.div className="glass-panel rounded-2xl p-7 text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="font-display text-2xl text-ink dark:text-white">No liked ideas in this score range</h3>
                <p className="mt-2 text-sm text-ink/50 dark:text-white/40">
                  Change the score filter to see the rest of your saved ideas.
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div className="glass-panel rounded-2xl p-7 text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="font-display text-2xl text-ink dark:text-white">No liked ideas yet</h3>
            <p className="mt-2 text-sm text-ink/50 dark:text-white/40">
              Validate ideas and hit the heart icon to save favorites.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-5">
              <Link to="/validate"
                className="inline-flex rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-cream shadow-md transition-all dark:border dark:border-white/10 dark:bg-white/10 dark:text-white">
                Start validating
              </Link>
            </motion.div>
          </motion.div>
        )}
    </main>
  );
}
