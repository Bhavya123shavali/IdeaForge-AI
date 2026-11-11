import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const LikeButton = ({ ideaId, entry, initialLiked = false, size = "md" }) => {
  const storageKey = entry?.id || ideaId;

  const [liked, setLiked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("likedIdeas") || "{}");
      const record = saved[storageKey] || saved[ideaId];
      return Boolean(record === true || record?.liked || initialLiked);
    } catch {
      return initialLiked;
    }
  });

  useEffect(() => {
    const syncLiked = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("likedIdeas") || "{}");
        const record = saved[storageKey] || saved[ideaId];
        setLiked(Boolean(record === true || record?.liked || initialLiked));
      } catch {
        setLiked(initialLiked);
      }
    };

    window.addEventListener("likedIdeasChanged", syncLiked);
    return () => window.removeEventListener("likedIdeasChanged", syncLiked);
  }, [ideaId, initialLiked, storageKey]);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    let all = {};
    try {
      all = JSON.parse(localStorage.getItem("likedIdeas") || "{}");
    } catch {
      all = {};
    }
    delete all[ideaId];
    delete all[storageKey];
    if (newLiked) {
      all[storageKey] = {
        liked: true,
        entryId: entry?.id || null,
        ideaId,
        idea: entry?.idea || null,
        report: entry?.report || null,
        created_at: entry?.created_at || null
      };
    }
    localStorage.setItem("likedIdeas", JSON.stringify(all));
    window.dispatchEvent(new Event("likedIdeasChanged"));
  };

  const s = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const i = size === "sm" ? 14 : 18;

  return (
    <motion.button
      onClick={toggleLike}
      className={`${s} flex items-center justify-center rounded-lg border transition-all ${
        liked
          ? "border-terracotta/20 bg-terracotta/8 text-terracotta dark:border-aurora-pink/20 dark:bg-aurora-pink/8 dark:text-aurora-pink"
          : "border-ink/6 dark:border-white/6 bg-white/40 dark:bg-white/3 text-ink/30 dark:text-white/20 hover:text-terracotta dark:hover:text-aurora-pink"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.85 }}
      title={liked ? "Unlike" : "Like"}
    >
      <Heart size={i} fill={liked ? "currentColor" : "none"} />
    </motion.button>
  );
};

export default LikeButton;
