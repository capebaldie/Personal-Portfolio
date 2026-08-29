"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The landing line. Words rise in sequence on first paint — this is the one
 * place the site animates on load rather than on scroll, because it's the
 * first thing read. The full sentence stays in the DOM for screen readers;
 * the animated copy is aria-hidden so the stagger never chops the reading.
 */
export function Lede({ text, className }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.p
      className={className}
      initial={reduceMotion ? false : "hidden"}
      animate="shown"
      variants={{
        shown: {
          transition: { staggerChildren: 0.045, delayChildren: 0.15 },
        },
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block whitespace-pre"
            variants={{
              hidden: { opacity: 0, y: "0.5em" },
              shown: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {word + " "}
          </motion.span>
        ))}
      </span>
    </motion.p>
  );
}
