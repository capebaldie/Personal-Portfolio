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
 * Items can optionally provide a separate leading mark. Stack cards use this
 * to let the mark settle independently from the card and its label.
 */
export function Stagger({
  items,
  className,
  itemClassName,
}: {
  items: { key: string; node: ReactNode; mark?: ReactNode }[];
  className?: string;
  itemClassName?: string;
}) {
  const reduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: reduceMotion
      ? { opacity: 1 }
      : { opacity: 0, y: 16, scale: 0.97 },
    shown: { opacity: 1, y: 0, scale: 1 },
  };

  const markVariants = {
    hidden: reduceMotion
      ? { opacity: 1 }
      : { opacity: 0, scale: 0.65, rotate: -12 },
    shown: { opacity: 1, scale: 1, rotate: 0 },
  };

  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        shown: {
          transition: {
            staggerChildren: reduceMotion ? 0 : 0.1,
            delayChildren: reduceMotion ? 0 : 0.06,
          },
        },
      }}
    >
      {items.map((item) => (
        <motion.li
          key={item.key}
          className={itemClassName}
          variants={cardVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.mark && (
            <motion.span
              aria-hidden="true"
              className="inline-flex shrink-0"
              variants={markVariants}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.mark}
            </motion.span>
          )}
          {item.node}
        </motion.li>
      ))}
    </motion.ul>
  );
}
