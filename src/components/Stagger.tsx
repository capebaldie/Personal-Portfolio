"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveals a list one item at a time as it comes into view.
 *
 * Items arrive as already-rendered nodes rather than raw data, so the brand
 * marks stay server-rendered — importing BrandMark from a client component
 * would drag the whole `simple-icons` package into the browser bundle.
 *
 * The movement is 6px and the stagger is 40ms, both deliberately below the
 * threshold where it reads as a performance: this sits inside the section
 * reveal that's already running, and two obvious animations on the same
 * content is one too many.
 */
export function Stagger({
  items,
  className,
  itemClassName,
}: {
  items: { key: string; node: ReactNode }[];
  className?: string;
  itemClassName?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ shown: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } } }}
    >
      {items.map((item) => (
        <motion.li
          key={item.key}
          className={itemClassName}
          variants={{
            hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 },
            shown: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.node}
        </motion.li>
      ))}
    </motion.ul>
  );
}
