"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";

/**
 * One deep-linkable section. The heading is the display face at a size no docs
 * theme would use — that contrast against the dense body below is the whole
 * idea.
 *
 * The heading and body settle in sequence, while nested lists can add their
 * own stagger without making the whole section wait for every child.
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
  // Flips once when the section reaches the viewport; CSS keys the heading's
  // highlighter sweep off it. Also fires under reduced motion, where the
  // sweep rules are inert and the marker just sits at rest.
  const [seen, setSeen] = useState(false);

  const sectionVariants = {
    hidden: { opacity: 0 },
    shown: { opacity: 1 },
  };

  const headingVariants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
    shown: { opacity: 1, y: 0 },
  };

  const contentVariants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 },
    shown: { opacity: 1, y: 0 },
  };

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`section-anchor border-b border-line py-16 last:border-b-0 md:py-20 ${
        seen ? "marker-shown" : ""
      }`}
    >
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "shown"}
        onViewportEnter={() => setSeen(true)}
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h2
          id={`${id}-heading`}
          className="section-heading display uppercase mb-10 lg:mb-12 text-[clamp(2.4rem,3.6vw,2.75rem)] leading-[1.1]"
          variants={headingVariants}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>
        <motion.div
          variants={contentVariants}
          transition={{
            duration: 0.58,
            delay: reduceMotion ? 0 : 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
