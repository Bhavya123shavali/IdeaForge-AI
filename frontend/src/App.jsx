import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import ValidatePage from "./pages/ValidatePage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import LikedIdeasPage from "./pages/LikedIdeasPage";
import DarkModeToggle from "./components/DarkModeToggle";
import ParticleBackground from "./components/ParticleBackground";
import ButterflyAnimation from "./components/ButterflyAnimation";

const navClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
    isActive
      ? "bg-ink/90 text-cream shadow-sm dark:bg-white/10 dark:text-white"
      : "text-ink/50 hover:bg-ink/5 hover:text-ink dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
  }`;

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-hero-mesh transition-colors duration-500">
      <ParticleBackground />
      <ButterflyAnimation behindContent={location.pathname.startsWith("/liked")} />
      <DarkModeToggle />

      <header className="sticky top-0 z-30 border-b border-ink/5 bg-cream/80 backdrop-blur-xl transition-colors duration-500 dark:border-white/5 dark:bg-night/80">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-5 md:px-8">
          <NavLink to="/" className="group flex min-w-0 flex-shrink-0 items-center gap-3">
            <img
              src="/logo.png"
              alt="StartupScope AI Logo"
              className="h-9 w-9 rounded-lg object-cover"
            />
            <div className="min-w-0 leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-terracotta transition-colors dark:text-aurora-purple">
                StartupScope AI
              </p>
              <h1 className="truncate font-display text-lg text-ink transition-colors group-hover:text-terracotta dark:group-hover:text-aurora-purple md:text-xl">
                Idea Validation
              </h1>
            </div>
          </NavLink>

          <nav className="flex max-w-full gap-0.5 overflow-x-auto rounded-xl border border-ink/5 bg-white/40 p-1 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
            <NavLink to="/" className={navClass} end>
              Home
            </NavLink>
            <NavLink to="/validate" className={navClass}>
              Validate
            </NavLink>
            <NavLink to="/results" className={navClass}>
              Results
            </NavLink>
            <NavLink to="/liked" className={navClass}>
              Liked
            </NavLink>
            <NavLink to="/history" className={navClass}>
              History
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/validate" element={<ValidatePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/results/:entryId" element={<ResultsPage />} />
              <Route path="/liked" element={<LikedIdeasPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 mt-auto border-t border-ink/5 bg-cream/60 backdrop-blur-md dark:border-white/5 dark:bg-night/60">
        <div className="flex w-full flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-5 md:px-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-5 w-5 rounded object-cover" />
            <span className="text-xs font-medium text-ink/40 dark:text-white/30">
              StartupScope AI - Idea Validation Assistant
            </span>
          </div>
          <p className="text-xs text-ink/30 dark:text-white/20">
            Built with AI - Competitor Scanning - SWOT Analysis - Memory Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
