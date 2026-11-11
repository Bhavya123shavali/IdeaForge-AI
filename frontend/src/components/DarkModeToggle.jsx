import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <motion.button
      onClick={() => setDark(!dark)}
      className="fixed top-20 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-ink/5 dark:border-white/5 bg-white/60 dark:bg-night-card/60 backdrop-blur-md shadow-sm hover:shadow-md text-ink dark:text-white transition-all"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      title={dark ? "Light mode" : "Dark mode"}
    >
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun size={16} />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon size={16} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
