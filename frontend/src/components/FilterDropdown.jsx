import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown } from "lucide-react";

const FilterDropdown = ({ onFilterChange, currentFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filters = [
    { value: "all", label: "All Scores", range: "0-10" },
    { value: "low", label: "Low Scores", range: "0-5" },
    { value: "medium", label: "Medium Scores", range: "5.1-7.5" },
    { value: "high", label: "High Scores", range: "7.6-10" }
  ];
  const selected = filters.find(f => f.value === currentFilter) || filters[0];

  return (
    <div className="relative z-[90]">
      <motion.button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink shadow-sm transition-all hover:border-terracotta/25 hover:bg-white dark:border-white/10 dark:bg-night-card dark:text-white"
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Filter size={14} className="text-ink/55 dark:text-white/60" />
        <span className="font-semibold text-ink/75 dark:text-white/80">{selected.label}</span>
        <span className="rounded-md bg-ink/7 px-2 py-0.5 text-xs font-semibold text-ink/65 dark:bg-white/10 dark:text-white/70">
          {selected.range}
        </span>
        <ChevronDown size={14} className={`text-ink/55 dark:text-white/60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
            className="absolute right-0 top-full z-[100] mt-1.5 w-56 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-panel-lg dark:border-white/10 dark:bg-night-card">
            {filters.map(f => (
              <motion.button key={f.value} onClick={() => { onFilterChange(f.value); setIsOpen(false); }}
                className={`w-full px-3 py-2.5 text-left text-sm transition-colors ${
                  currentFilter === f.value
                    ? "bg-terracotta/10 text-terracotta dark:bg-aurora-purple/15 dark:text-aurora-purple"
                    : "text-ink/75 hover:bg-ink/5 dark:text-white/75 dark:hover:bg-white/8"
                }`}
                whileHover={{ x: 2 }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{f.label}</span>
                  <span className="rounded-md bg-ink/7 px-2 py-0.5 text-xs font-semibold text-ink/60 dark:bg-white/10 dark:text-white/65">
                    {f.range}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
