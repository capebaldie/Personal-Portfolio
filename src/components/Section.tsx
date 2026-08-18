"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * One deep-linkable section. The heading is the display face at a size no docs
 * theme would use — that contrast against the dense body below is the whole
 * idea.
 *
 * The reveal is deliberately small (12px, once, never repeating). Scroll
 * animation on a reference document should feel like the page settling, not
 * like a landing page performing.
 */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="section-anchor border-b border-line py-16 last:border-b-0 md:py-20"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          id={`${id}-heading`}
          className="section-heading display uppercase mb-8 text-[clamp(1.75rem,3.6vw,2.4rem)] leading-[1.1]"
        >
          {title}
        </h2>
        {children}
      </motion.div>
    </section>
  );
}
