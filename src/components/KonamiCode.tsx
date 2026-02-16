"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const EASTER_EGGS = [
  "🏀 You found the secret court! Peter's shooting 100% from downtown today.",
  "👻 Kuroko Mode Activated. You can't see me, but I'm everywhere.",
  "⚡ The Zone has been entered. Focus: maximum. Distractions: zero.",
  "🎮 ↑↑↓↓←→←→BA — A person of culture, I see.",
  "🌊 \"The sea is for those who are brave enough to leave the shore.\"",
];

export default function KonamiCode() {
  const [keys, setKeys] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleKey = useCallback((e: KeyboardEvent) => {
    setKeys((prev) => {
      const next = [...prev, e.key].slice(-KONAMI.length);
      if (next.join(",") === KONAMI.join(",")) {
        const msg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
        setMessage(msg);
        setTimeout(() => setMessage(null), 4000);
        return [];
      }
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl backdrop-blur-lg border shadow-2xl max-w-md text-center font-bold"
          style={{
            background: "rgba(0,0,0,0.8)",
            borderColor: "rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
