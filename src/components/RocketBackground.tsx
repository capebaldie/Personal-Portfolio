"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { Ref } from "react";

/** Scroll progress at which the side boosters burn out and peel away. */
const SEP = 0.35;

/** Only where the right margin is actually empty, and never under reduced motion. */
const QUERY = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

/**
 * A blueprint rocket that launches off a pad at the bottom right and climbs
 * with the scroll. Height follows scroll progress; thrust follows scroll
 * *speed*, so the engines fire while the reader scrolls and cut out the moment
 * they stop.
 */
export function RocketBackground() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );

  const { scrollY, scrollYProgress } = useScroll();
  const thrust = useSpring(
    useTransform(useVelocity(scrollY), (v) => Math.min(Math.abs(v) / 1200, 1)),
    { stiffness: 220, damping: 30, restDelta: 0.001 },
  );

  // Eased in, so liftoff is slow and the climb gathers speed.
  const rocketY = useTransform(scrollYProgress, [0, 1], ["0vh", "-112vh"], {
    ease: (t) => t ** 1.5,
  });
  const rocketOpacity = useTransform(
    scrollYProgress,
    [0, 0.9, 0.98],
    [1, 1, 0],
  );
  const padY = useTransform(scrollYProgress, [0, 0.12], ["0%", "100%"]);
  const flameScale = useTransform(thrust, (t) => 0.35 + 0.65 * t);
  const coreFlame = useTransform(thrust, (t) => Math.min(1, t * 4));
  const boosterFlame = useTransform(
    [thrust, scrollYProgress],
    ([t, p]: number[]) => (p < SEP ? Math.min(1, t * 4) : 0),
  );

  const peel = [SEP, SEP + 0.04, SEP + 0.25];
  const boosterDrop = useTransform(scrollYProgress, peel, ["0%", "4%", "320%"]);
  const boosterOpacity = useTransform(
    scrollYProgress,
    [SEP + 0.08, SEP + 0.25],
    [1, 0],
  );
  const leftX = useTransform(scrollYProgress, peel, ["0%", "-40%", "-420%"]);
  const leftRotate = useTransform(scrollYProgress, peel, [0, -3, -22]);
  const rightX = useTransform(scrollYProgress, peel, ["0%", "40%", "420%"]);
  const rightRotate = useTransform(scrollYProgress, peel, [0, 3, 22]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreFlameRef = useRef<HTMLDivElement>(null);
  const leftFlameRef = useRef<HTMLDivElement>(null);
  const rightFlameRef = useRef<HTMLDivElement>(null);

  // Exhaust clouds: line-drawn cartoon puffs on a canvas, left in screen space
  // behind the engines. They pop in, swell, drift and shrink away. The loop
  // only runs while firing or while clouds are still on screen.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Theme colours, re-read whenever the loop starts so a toggle is picked up.
    let ink = "";
    let paper = "";
    const readTheme = () => {
      const s = getComputedStyle(canvas);
      ink = s.getPropertyValue("--accent").trim();
      paper = s.getPropertyValue("--background").trim();
    };

    type Cloud = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      age: number;
      spin: number;
      lobes: [number, number, number][]; // dx, dy, radius — in units of size
    };
    let clouds: Cloud[] = [];
    const spawn = (
      x: number,
      y: number,
      spread: number,
      drift = 16,
      size = 1,
    ) => {
      const n = 3 + Math.floor(Math.random() * 3);
      const lobes: Cloud["lobes"] = [[0, 0, 1]];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.6;
        lobes.push([
          Math.cos(a) * 0.85,
          Math.sin(a) * 0.6,
          0.55 + Math.random() * 0.3,
        ]);
      }
      clouds.push({
        x: x + (Math.random() - 0.5) * spread,
        y,
        vx: (Math.random() - 0.5) * drift,
        vy: 8 + Math.random() * 20,
        size: (5 + Math.random() * 4) * size,
        life: 1.4 + Math.random() * 1.2,
        age: 0,
        spin: (Math.random() - 0.5) * 0.6,
        lobes,
      });
    };
    const emit = (
      el: HTMLElement | null,
      rate: number,
      dt: number,
      onPad: boolean,
    ) => {
      const rect = el?.getBoundingClientRect();
      if (!rect || rect.height === 0) return;
      for (let n = rate * dt + Math.random(); n >= 1; n--) {
        // On the pad the exhaust hits the ground and billows sideways.
        spawn(
          rect.left + rect.width / 2,
          rect.top + rect.height * (0.6 + Math.random() * 0.4),
          rect.width * (onPad ? 4 : 0.6),
          onPad ? 80 : 16,
        );
      }
    };

    // Pops in with an overshoot, swells slowly, then shrinks to nothing —
    // cartoon timing rather than a fade.
    const scaleAt = (k: number) => {
      if (k < 0.15) {
        const u = k / 0.15;
        return u * (1 + 0.35 * Math.sin(u * Math.PI));
      }
      if (k < 0.7) return 1 + (k - 0.15) * 0.8;
      return 1.44 * (1 - (k - 0.7) / 0.3) ** 1.5;
    };

    const draw = (c: Cloud) => {
      const s = scaleAt(c.age / c.life) * c.size;
      if (s < 0.5) return;
      const rot = c.spin * c.age;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const pts = c.lobes.map(([dx, dy, r]) => [
        c.x + (dx * cos - dy * sin) * s,
        c.y + (dx * sin + dy * cos) * s,
        r * s,
      ]);
      // Outline every lobe, then paint the insides over the overlaps so only
      // the scalloped outer edge survives. Later clouds sit over earlier ones.
      ctx.beginPath();
      for (const [x, y, r] of pts) {
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.beginPath();
      for (const [x, y, r] of pts) {
        const inner = Math.max(r - 0.9, 0);
        ctx.moveTo(x + inner, y);
        ctx.arc(x, y, inner, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    let raf = 0;
    let last = 0;
    let prevP = scrollYProgress.get();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = thrust.get();
      const p = scrollYProgress.get();

      if (t > 0.02) {
        const onPad = p < 0.05;
        emit(coreFlameRef.current, t * 12, dt, onPad);
        if (p < SEP) {
          emit(leftFlameRef.current, t * 7, dt, onPad);
          emit(rightFlameRef.current, t * 7, dt, onPad);
        }
      }
      // A little burst where each booster lets go.
      if (prevP < SEP !== p < SEP) {
        for (const el of [leftFlameRef.current, rightFlameRef.current]) {
          const rect = el?.getBoundingClientRect();
          if (rect && rect.width > 0) {
            for (let i = 0; i < 3; i++)
              spawn(
                rect.left + rect.width / 2,
                rect.top,
                rect.width * 2,
                40,
                0.8,
              );
          }
        }
      }
      prevP = p;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = ink;
      ctx.fillStyle = paper;
      ctx.lineWidth = 1.1;
      clouds = clouds.filter((c) => (c.age += dt) < c.life);
      for (const c of clouds) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.vx *= 0.97;
        c.vy *= 0.985;
        draw(c);
      }

      raf = t > 0.02 || clouds.length ? requestAnimationFrame(frame) : 0;
    };

    const unsubscribe = thrust.on("change", (v) => {
      if (v > 0.02 && !raf) {
        readTheme();
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [enabled, thrust, scrollYProgress]);

  if (!enabled) return null;

  return (
    <div className="rocket-field" aria-hidden="true">
      <canvas ref={canvasRef} className="rocket-clouds" />

      {/* Pad drawing at 0.1rem per unit. The rocket's centre line is unit 35
          and its nozzles rest on the platform at unit 88. */}
      <motion.div className="rocket-pad" style={{ y: padY }}>
        <svg viewBox="0 0 70 100">
          <defs>
            <pattern
              id="rk-grid"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path className="rk-grid-line" d="M5 0 H0 V5" />
            </pattern>
            <radialGradient id="rk-fade-g" cx="0.5" cy="0.8" r="0.55">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="rk-fade">
              <rect
                x="-20"
                y="-10"
                width="110"
                height="110"
                fill="url(#rk-fade-g)"
              />
            </mask>
          </defs>
          <rect
            x="-20"
            y="-10"
            width="110"
            height="110"
            fill="url(#rk-grid)"
            mask="url(#rk-fade)"
          />

          {/* Platform, flame trench, hold-down clamps */}
          <path className="rk-part" d="M2 90 H68 V100 H2 Z" />
          <path className="rk-part rk-hatch" d="M25 90 H45 V96 H25 Z" />
          <path
            className="rk-part"
            d="M24 86 H27 V90 H24 Z M43 86 H46 V90 H43 Z"
          />

          {/* Service tower: rails, cross-bracing, swing arms */}
          <path
            className="rk-line"
            d="M54 14 V90 M62 14 V90 M52 12 H64 V14 H52 Z M47.5 32 H54 M47.5 58 H54"
          />
          <path
            className="rk-line rk-faint"
            d="M54 14 L62 22 L54 30 L62 38 L54 46 L62 54 L54 62 L62 70 L54 78 L62 86"
          />
          <circle className="rk-beacon" cx="58" cy="9.5" r="1.4" />

          {/* Vehicle height dimension */}
          <path className="rk-line rk-faint" d="M12 12.2 H20 M12 88 H21" />
          <path
            className="rk-line"
            d="M15 13 V87 M13.8 15.4 L15 13 L16.2 15.4 M13.8 84.6 L15 87 L16.2 84.6"
          />
          <text
            className="rk-label"
            transform="translate(12.4 50) rotate(-90)"
            textAnchor="middle"
          >
            H 76.0
          </text>
          <text className="rk-label" x="8" y="96.2">
            LC-01
          </text>
        </svg>
      </motion.div>

      <motion.div
        className="rocket"
        style={{ y: rocketY, opacity: rocketOpacity }}
      >
        <svg viewBox="0 0 24 130">
          <defs>
            <pattern
              id="rk-hatch"
              width="2.4"
              height="2.4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <path className="rk-hatch-line" d="M0 0 V2.4" />
            </pattern>
          </defs>
          <path
            className="rk-part"
            d="M12 1 C17 7 19 16 19 26 V118 H5 V26 C5 16 7 7 12 1 Z"
          />
          <path
            className="rk-hatch"
            d="M14.5 3.2 C17.4 8 19 16 19 26 V118 H15 V26 C15 17 14.9 9 14.5 3.2 Z"
          />
          <path className="rk-line rk-center" d="M12 -5 V136" />
          <path
            className="rk-line"
            d="M7.3 10 H16.7 M5 26 H19 M5 44 H19 M5 48 H19 M5 84 H19"
          />
          <circle className="rk-part" cx="12" cy="35" r="2.6" />
          <path
            className="rk-part"
            d="M5 118 H19 L17.5 122 H6.5 Z M9 122 H15 L16.5 130 H7.5 Z"
          />
          <path
            className="rk-line rk-faint"
            d="M10.5 122 L9.8 130 M13.5 122 L14.2 130"
          />
        </svg>
        <Flame
          ref={coreFlameRef}
          className="rocket-flame-core"
          scale={flameScale}
          opacity={coreFlame}
        />

        <motion.div
          className="rocket-booster rocket-booster-left"
          style={{
            x: leftX,
            y: boosterDrop,
            rotate: leftRotate,
            opacity: boosterOpacity,
          }}
        >
          <Booster />
          <Flame
            ref={leftFlameRef}
            className="rocket-flame-booster"
            scale={flameScale}
            opacity={boosterFlame}
          />
        </motion.div>
        <motion.div
          className="rocket-booster rocket-booster-right"
          style={{
            x: rightX,
            y: boosterDrop,
            rotate: rightRotate,
            opacity: boosterOpacity,
          }}
        >
          <Booster mirrored />
          <Flame
            ref={rightFlameRef}
            className="rocket-flame-booster"
            scale={flameScale}
            opacity={boosterFlame}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Strap-on booster; the fin sits on the outboard side. */
function Booster({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 10 90"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <path className="rk-part" d="M1 64 L-2.5 78 V83 H1 Z" />
      <path
        className="rk-part"
        d="M5 1 C7.8 4 9 9 9 16 V82 H1 V16 C1 9 2.2 4 5 1 Z"
      />
      <path className="rk-hatch" d="M6.5 2.8 C8.2 5.5 9 10 9 16 V82 H6.5 Z" />
      <path className="rk-line rk-center" d="M5 -3 V94" />
      <path className="rk-line" d="M2.2 6 H7.8 M1 16 H9 M1 50 H9" />
      <path className="rk-part" d="M2.5 82 H7.5 L8.3 90 H1.7 Z" />
    </svg>
  );
}

/** Outlined plume around a hatched inner core, with a CSS flicker. */
function Flame({
  ref,
  className,
  scale,
  opacity,
}: {
  ref: Ref<HTMLDivElement>;
  className: string;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      ref={ref}
      className={`rocket-flame ${className}`}
      style={{ scaleY: scale, opacity }}
    >
      <svg viewBox="0 0 24 80" preserveAspectRatio="none">
        <g className="rocket-flame-flicker">
          <path
            className="rk-part"
            d="M5 0 H19 C21 14 17 34 12 60 C7 34 3 14 5 0 Z"
          />
          <path
            className="rk-line rk-hatch"
            d="M8 0 H16 C17 10 15 20 12 34 C9 20 7 10 8 0 Z"
          />
        </g>
      </svg>
    </motion.div>
  );
}
