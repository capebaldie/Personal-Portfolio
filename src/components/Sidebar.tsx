"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, profile, sectionIds } from "@/data/content";
import { pickActive, isAtBottom, type SpyEntry } from "@/lib/scroll-spy";
import { ThemeToggle } from "./ThemeToggle";
import { Monogram } from "./Monogram";

/**
 * Tracks which section is at the reading position.
 *
 * rootMargin narrows the viewport to a band near the top, so "intersecting"
 * already means "roughly where the eye is". The decision itself lives in
 * `pickActive` so it can be tested without a DOM.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Latest known state per section, kept across callbacks — the observer
    // only reports what *changed*, but pickActive needs the full picture.
    const state = new Map<string, SpyEntry>(
      elements.map((el) => [
        el.id,
        { id: el.id, isIntersecting: false, top: 0 },
      ]),
    );

    const update = () => {
      // The last section is short enough that it may never reach the band, so
      // it would never highlight. At the bottom of the page, it always wins.
      if (
        isAtBottom(
          window.scrollY,
          window.innerHeight,
          document.body.scrollHeight,
        )
      ) {
        setActive(ids[ids.length - 1]);
        return;
      }
      // Map order is document order, which makes ties resolve predictably.
      setActive((prev) => pickActive([...state.values()], prev));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          state.set(entry.target.id, {
            id: entry.target.id,
            isIntersecting: entry.isIntersecting,
            top: entry.boundingClientRect.top,
          });
        }
        update();
      },
      // Top 10%–30% of the viewport: below the sticky header, above the fold.
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [ids]);

  return active;
}

function NavList({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate?: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <nav aria-label="Sections">
      {nav.map((section) => (
        <div key={section.group ?? "root"} className="mb-7">
          {section.group && (
            <p className="mb-2 px-3 font-mono text-xs tracking-wide text-muted">
              {section.group}
            </p>
          )}
          <ul>
            {section.items.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  {isActive && (
                    <motion.span
                      // Shared layoutId is what makes the marker slide between
                      // items instead of blinking out and back in.
                      layoutId="active-marker"
                      layout={!reduceMotion}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                      className="absolute inset-0 bg-background border-l-2 border-accent"
                      aria-hidden="true"
                    />
                  )}
                  <a
                    href={`#${item.id}`}
                    onClick={onNavigate}
                    aria-current={isActive ? "true" : undefined}
                    // relative so the anchor paints above the absolute marker
                    className={`relative block px-3 py-1.5 text-base transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Identity() {
  const reduceMotion = useReducedMotion();

  return (
    // Settles in just ahead of the lede's word stagger, so the landing reads
    // name first, then what the name claims to do.
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#overview" className="display text-2xl leading-tight">
        {profile.name}
      </a>
      <p className="mt-1 font-mono text-xs text-muted">{profile.role}</p>
      {profile.available && (
        <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-muted">
          <span
            aria-hidden="true"
            className="status-dot h-1.5 w-1.5 shrink-0 rounded-full bg-ok"
          />
          Available for work
        </p>
      )}
    </motion.div>
  );
}

export function Sidebar() {
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);

  // Lock body scroll behind the mobile drawer, and let Escape close it —
  // anything that covers the page is expected to answer to Escape.
  //
  // The drawer covers the page but isn't a modal, so instead of a focus trap
  // the content behind it goes `inert`: native, one attribute, and it takes
  // the whole subtree out of tab order and the accessibility tree at once.
  // The desktop rail needs no such treatment — it's display:none at this width.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Escape leaves focus on a node that's about to unmount, which drops it
      // to <body> and restarts the tab order. Hand it back to the trigger.
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      main?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Desktop rail. Deliberately no search box and no right-hand "On this
          page" column — both are the giveaway that a docs theme was reused,
          and neither earns its keep at six sections. */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col justify-between border-r border-line bg-surface px-8 py-10 lg:flex">
        <div>
          <Identity />
          <div className="mt-10">
            <NavList active={active} />
          </div>
        </div>

        {/* The rail had ~400px of nothing between the nav and this row. The
            monogram gives the bottom of the column something to sit on. */}
        <div className="flex flex-col gap-5">
          {/* <Monogram /> */}
          <div className="flex items-center justify-between border-t border-line pt-4">
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-xs text-muted transition-colors hover:text-foreground"
            >
              {profile.email}
            </a>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile bar. Header and drawer share one fixed wrapper so the drawer
          sits directly under the bar without hardcoding its height. */}
      <div className="fixed inset-x-0 top-0 z-40 lg:hidden">
        <header className="flex items-center justify-between border-b border-line bg-background/85 px-5 py-3 backdrop-blur-md">
          <a href="#overview" className="display text-xl">
            {profile.name}
          </a>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-foreground"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d={open ? "M4 4L16 16M16 4L4 16" : "M2 5H18M2 10H18M2 15H18"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              // 5rem ≈ the bar's own height, so a long nav scrolls internally
              // rather than running off the bottom of the viewport.
              className="max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-line bg-surface px-5 py-8"
            >
              <NavList active={active} onNavigate={() => setOpen(false)} />
              {/* Padded to a 44px target rather than sized up — at text-xs
                  the bare link was a ~16px tall tap area on a touch device.
                  The -ml-2 puts the text back on the nav's left edge. */}
              <a
                href={`mailto:${profile.email}`}
                className="-ml-2 inline-flex min-h-11 items-center px-2 font-mono text-xs text-muted"
              >
                {profile.email}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
