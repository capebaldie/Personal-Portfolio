"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function RocketBackground() {
  const { scrollYProgress } = useScroll();
  const rocketY = useTransform(scrollYProgress, [0, 1], ["78vh", "-18vh"]);
  const rocketOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.82, 0.96, 1],
    [0.9, 1, 1, 0.65, 0],
  );
  const flameOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.78, 0.9],
    [0.35, 1, 1, 0],
  );
  const smokeOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.18, 0.82, 0.94],
    [0, 0.5, 1, 1, 0],
  );
  const detachedStageY = useTransform(
    scrollYProgress,
    [0.2, 0.32, 0.52, 0.72],
    ["0vh", "8vh", "18vh", "26vh"],
  );
  const detachedStageOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.28, 0.62, 0.74],
    [0, 0.8, 0.45, 0],
  );

  return (
    <div className="rocket-field" aria-hidden="true">
      <motion.div
        className="rocket"
        style={{ y: rocketY, opacity: rocketOpacity }}
      >
        <svg viewBox="0 0 64 112" role="presentation">
          <motion.path className="rocket-smoke" d="M32 78 C25 88 39 91 29 102" style={{ opacity: smokeOpacity }} />
          <motion.path className="rocket-flame" d="M27 76 C27 84 29 87 32 90 C35 87 37 84 37 76" style={{ opacity: flameOpacity }} />
          <path className="rocket-fin rocket-fin-left" d="M22 60 C14 64 10 72 11 79 C17 78 22 74 25 68" />
          <path className="rocket-fin rocket-fin-right" d="M42 60 C50 64 54 72 53 79 C47 78 42 74 39 68" />
          <path className="rocket-shell" d="M32 5 C21 14 17 28 19 47 L24 70 C26 77 38 77 40 70 L45 47 C47 28 43 14 32 5 Z" />
          <circle className="rocket-window" cx="32" cy="38" r="6" />
          <path className="rocket-highlight" d="M27 16 C23 25 22 35 23 46" />
        </svg>
      </motion.div>
      <motion.div
        className="rocket-stage"
        style={{ y: detachedStageY, opacity: detachedStageOpacity }}
      />
    </div>
  );
}
