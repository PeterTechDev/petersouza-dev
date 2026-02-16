"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

const LONG_PRESS_MS = 1500;
const SHAKE_THRESHOLD = 25;
const SHAKE_COUNT_NEEDED = 3;

export default function KonamiCode() {
  const keysRef = useRef<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeCountRef = useRef(0);
  const lastShakeRef = useRef(0);

  const triggerEasterEgg = useCallback(() => {
    const msg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  }, []);

  // Keyboard: Konami code
  const handleKey = useCallback((e: KeyboardEvent) => {
    const next = [...keysRef.current, e.key].slice(-KONAMI.length);
    keysRef.current = next;
    if (next.join(",") === KONAMI.join(",")) {
      triggerEasterEgg();
      keysRef.current = [];
    }
  }, [triggerEasterEgg]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Mobile: Long press (3 fingers for 1.5s)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 3) {
        longPressTimerRef.current = setTimeout(() => {
          triggerEasterEgg();
        }, LONG_PRESS_MS);
      }
    };

    const handleTouchEnd = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [triggerEasterEgg]);

  // Mobile: Shake detection
  useEffect(() => {
    if (typeof DeviceMotionEvent === "undefined") return;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
      const now = Date.now();

      if (total > SHAKE_THRESHOLD) {
        if (now - lastShakeRef.current < 800) {
          shakeCountRef.current++;
          if (shakeCountRef.current >= SHAKE_COUNT_NEEDED) {
            triggerEasterEgg();
            shakeCountRef.current = 0;
          }
        } else {
          shakeCountRef.current = 1;
        }
        lastShakeRef.current = now;
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [triggerEasterEgg]);

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
