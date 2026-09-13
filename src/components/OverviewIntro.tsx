"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lede } from "./Lede";

export function OverviewIntro({
  tagline,
  lede,
  paragraphs,
}: {
  tagline: string;
  lede: string;
  paragraphs: string[];
}) {
  const reduceMotion = useReducedMotion();
  const entry = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };

  return (
    <div className="prose">
      <motion.div
        initial={entry}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.32, 1, 0.56, 1] }}
      >
        <Lede
          text={tagline}
          animate={false}
          className="display text-[clamp(1.4rem,2.6vw,1.85rem)] leading-snug font-medium sm:font-normal"
        />
      </motion.div>

      <motion.div
        initial={entry}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.6,
          delay: reduceMotion ? 0 : 0.2,
          ease: [0.32, 1, 0.56, 1],
        }}
      >
        <p className="mt-6">{lede}</p>
        {paragraphs.map((paragraph) => (
          <p className="hidden sm:block" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </motion.div>
    </div>
  );
}
