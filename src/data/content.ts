/**
 * Every word on the site comes from this file.
 *
 * Real data: `profile`, `experience`, `about`, `principles`, `stack`.
 * NOT real: `projects` — see the warning above that array before deploying.
 */

export const profile = {
  name: "Amal a s",
  role: "Software Developer",
  tagline:
    "I build fast, thoughtful interfaces — then work backwards to understand the systems that power them.",
  location: "Kochi, India",
  email: "amalsunil863@gmail.com",
  available: true,
  /** Served from public/. Self-hosted rather than a Drive link: `download`
   *  is ignored cross-origin, and a share permission can lapse silently. */
  resume: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/capebaldie" },
    // TODO: real profile URLs — these currently point at bare domains.
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};

/** Sidebar structure. `id` must match the <Section id> rendered on the page. */
export const nav = [
  {
    group: null,
    items: [{ id: "overview", label: "Overview" }],
  },
  {
    group: "Work",
    items: [
      { id: "experience", label: "Experience" },
      { id: "projects", label: "Projects" },
    ],
  },
  {
    group: "About",
    items: [
      { id: "how-i-work", label: "How I work" },
      { id: "stack", label: "Stack" },
      { id: "contact", label: "Contact" },
    ],
  },
];

/** Flat id list, in document order — the scroll spy observes exactly these. */
export const sectionIds = nav.flatMap((g) => g.items.map((i) => i.id));

export const about = {
  lede: "Front-end engineer with three years of experience building and shipping products. Lately, I've been working deeper into the stack — backend and AI, mostly with Python — because I want to understand more than just the interface.",
  paragraphs: [
    "I care about the seam where design meets engineering — where most of the interesting problems live. A design that can't survive contact with real data isn't finished, and an implementation that quietly drops the details isn't either.",
    "I'm drawn to problems where the interface is only the visible part. The more I build, the more interested I become in the systems, decisions, and trade-offs underneath.",
  ],
};

/** The opinions worth defending in an interview. Docs sites earn their layout
 *  with content like this — prose that isn't just a list of nouns. */
export const principles = [
  {
    title: "Pick the lightest tool that holds",
    body: "A marketing site does not need hydration. Astro ships zero JS by default and HTMX covers most of what's left; reaching for Next.js is a decision that should be justified by something, not assumed.",
  },
  {
    title: "The seam is the job",
    body: "Handoff is where quality leaks. Loading states, empty states, error states, and long strings are all design problems that only show up in code — so they're mine to solve, not somebody else's to spec.",
  },
  {
    title: "Write code you'd be happy to inherit",
    body: "Optimise for the person reading this at 3am eight months from now. That usually means fewer abstractions than feel clever at the time.",
  },
];

export type Role = {
  company: string;
  period: string;
  title: string;
  blurb: string;
  detail: string[];
  tags: string[];
  href?: string;
};

/** Most recent first. */
export const experience: Role[] = [
  {
    company: "Neumeral Technologies",
    period: "2023 — Present",
    title: "Software Developer",
    blurb:
      "Six-plus products shipped over three years, mostly front-end — Next.js and Astro, with Payload behind them and HTMX where a full SPA was the wrong tool.",
    detail: [
      "Shipped and maintained six-plus client products across three years, owning the front-end end to end on most of them.",
      "Standardised on Payload as the CMS layer, so content changes stopped requiring deploys.",
      // TODO: add one concrete outcome with a number — load time, bundle size,
      // conversion, a migration you led. This is the line interviewers ask about.
    ],
    tags: ["Next.js", "Astro", "Payload", "Tailwind", "HTMX"],
  },
  {
    company: "Techfriar",
    period: "2023 · 3 months",
    title: "Trainee Software Developer",
    blurb:
      "Training stint: turned Figma files into working React screens and ported a static HTML site to a Next.js app.",
    detail: [
      "Translated Figma designs into responsive React components.",
      "Ported a static HTML marketing site to Next.js.",
    ],
    tags: ["Next.js", "React", "Tailwind", "Figma"],
  },
];

export type Project = {
  name: string;
  year: string;
  blurb: string;
  detail: string;
  tags: string[];
  href: string;
};

/**
 * ⚠️  PLACEHOLDER DATA — DO NOT DEPLOY AS-IS.
 *
 * Every entry below is invented and every `href` points at github.com. One of
 * them claims "2k+ stars". A recruiter who clicks any of these lands on the
 * GitHub homepage, which reads worse than having no projects section at all.
 *
 * Replace with real work, or delete the array — the Projects section renders
 * an honest empty state when it's empty.
 */
export const projects: Project[] = [
  {
    name: "Driftwood",
    year: "2025",
    blurb: "Local-first terminal journal with end-to-end encrypted sync.",
    detail:
      "A TUI journal that keeps everything on disk first and syncs encrypted blobs between devices, so there's no server that can read your entries.",
    tags: ["Rust", "SQLite", "TUI"],
    href: "https://github.com",
  },
  {
    name: "Halftone",
    year: "2024",
    blurb: "Open-source WebGL playground for dithering and halftone shaders.",
    detail:
      "A browser playground for experimenting with dithering and halftone shaders, with live parameter tweaking and PNG export.",
    tags: ["WebGL", "GLSL", "TypeScript"],
    href: "https://github.com",
  },
  {
    name: "Cronwig",
    year: "2024",
    blurb: "Zero-dependency cron parser that explains any expression in 3kb.",
    detail:
      "Parses a cron expression and renders it as plain English. No dependencies, 3kb minified, works in both Node and the browser.",
    tags: ["TypeScript", "Zero-dep"],
    href: "https://github.com",
  },
];

export const stack = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "Astro",
      "HTMX",
      "Tailwind",
      "CSS",
      "Framer Motion",
    ],
  },
  {
    group: "Backend & data",
    items: [
      "Node.js",
      "FastAPI",
      "Payload",
      "Prisma",
      "SQLite",
      "Postgres",
      "Redis",
    ],
  },
  {
    group: "Tooling",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "Vercel",
      "Vitest",
      "Figma",
      "Claude Code",
      "Codex",
      "Cloudflare",
    ],
  },
];
