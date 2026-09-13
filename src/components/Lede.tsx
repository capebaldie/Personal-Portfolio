"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The landing line makes one quiet entrance on first paint, rather than
 * animating individual words or characters.
 */
export function Lede({
  text,
  className,
  animate = true,
}: {
  text: string;
  className?: string;
  animate?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (!animate) {
    return <p className={className}>{text}</p>;
  }

  return (
    <motion.p
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.p>
  );
}
