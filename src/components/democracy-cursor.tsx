"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

/**
 * Decorative "seat of democracy" emblem — a line-art Parliament House
 * crowned by a slowly turning Ashoka Chakra — that trails the cursor
 * on spring physics and banks into its direction of travel.
 *
 * Rendered only for fine-pointer devices; disabled for reduced motion.
 */

const SIZE = 144;

/* 24-spoke Chakra: 12 diameter lines at 15° */
const CHAKRA = { cx: 100, cy: 34, r: 17 };
const SPOKES = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 12;
  return {
    x1: +(CHAKRA.cx + CHAKRA.r * Math.cos(a)).toFixed(2),
    y1: +(CHAKRA.cy + CHAKRA.r * Math.sin(a)).toFixed(2),
    x2: +(CHAKRA.cx - CHAKRA.r * Math.cos(a)).toFixed(2),
    y2: +(CHAKRA.cy - CHAKRA.r * Math.sin(a)).toFixed(2),
  };
});

/* Colonnade: evenly spaced pillars across the front facade */
const COLUMNS = Array.from({ length: 9 }, (_, i) => 60 + i * 10);

export function DemocracyCursor() {
  const reduce = useReducedMotion();
  const [seen, setSeen] = useState(false);

  /* Raw pointer position */
  const px = useMotionValue(-SIZE);
  const py = useMotionValue(-SIZE);

  /* Spring-tracked follower — the trailing, weighty feel */
  const x = useSpring(px, { stiffness: 110, damping: 17, mass: 0.65 });
  const y = useSpring(py, { stiffness: 110, damping: 17, mass: 0.65 });

  /* Bank into horizontal travel: spring the velocity-derived tilt */
  const vx = useVelocity(x);
  const tiltTarget = useTransform(vx, [-1400, 0, 1400], [-16, 0, 16]);
  const tilt = useSpring(tiltTarget, { stiffness: 170, damping: 22 });

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        px.set(e.clientX);
        py.set(e.clientY);
        setSeen(true);
      });
    };
    const onLeave = () => setSeen(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, px, py]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-20 will-change-transform"
      style={{ x, y }}
    >
      <motion.div
        className="-ml-[72px] -mt-[72px]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: seen ? 0.92 : 0,
          scale: seen ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
      >
        <motion.div
          style={{ rotate: tilt }}
          animate={{ y: [0, -9, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 5.2, ease: "easeInOut" },
            default: { type: "spring", stiffness: 170, damping: 22 },
          }}
        >
          <DemocracyMark />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function DemocracyMark() {
  return (
    <svg
      viewBox="0 0 200 200"
      width={SIZE}
      height={SIZE}
      fill="none"
      role="presentation"
    >
      {/* Ashoka Chakra — ever-turning wheel */}
      <motion.g
        stroke="var(--indelible)"
        strokeWidth={2}
        strokeLinecap="round"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        <circle cx={CHAKRA.cx} cy={CHAKRA.cy} r={CHAKRA.r} />
        {SPOKES.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeWidth={1.4} />
        ))}
        <circle cx={CHAKRA.cx} cy={CHAKRA.cy} r={3.2} fill="var(--indelible)" stroke="none" />
      </motion.g>

      {/* Parliament House — colonnade elevation */}
      <g
        stroke="var(--ink)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* dome + finial */}
        <path d="M74 92a26 26 0 0 1 52 0" stroke="var(--indelible)" />
        <path d="M85 92a15 15 0 0 1 30 0" stroke="var(--faint)" strokeWidth={1.6} />
        <line x1={100} y1={66} x2={100} y2={59} />
        <circle cx={100} cy={56} r={2.4} fill="var(--indelible)" stroke="none" />

        {/* cornice */}
        <ellipse cx={100} cy={95} rx={54} ry={9} />

        {/* side walls */}
        <line x1={46} y1={101} x2={46} y2={150} />
        <line x1={154} y1={101} x2={154} y2={150} />

        {/* pillars */}
        <g stroke="var(--muted)" strokeWidth={2}>
          {COLUMNS.map((c) => (
            <line key={c} x1={c} y1={106} x2={c} y2={146} />
          ))}
        </g>

        {/* central doorway */}
        <path d="M93 146v-6a7 7 0 0 1 14 0v6" stroke="var(--muted)" strokeWidth={2} />

        {/* plinth */}
        <path d="M40 154q60 14 120 0" />
      </g>

      {/* steps */}
      <g stroke="var(--faint)" strokeWidth={2} strokeLinecap="round">
        <path d="M76 163q24 5.5 48 0" />
        <path d="M62 171q38 7.5 76 0" />
        <path d="M48 179q52 10 104 0" />
      </g>
    </svg>
  );
}
