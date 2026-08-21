"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { partyColor } from "@/src/lib/parties";

/** Shared "premium" easing — fast start, long soft landing. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Reveal — fades/rises into view. `load` animates on mount instead    */
/* of waiting for a scroll intersection (for above-the-fold content).  */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  load = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  load?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={load ? { opacity: 1, y: 0 } : undefined}
      whileInView={load ? undefined : { opacity: 1, y: 0 }}
      viewport={load ? undefined : { once: true, margin: "0px 0px -72px 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* MaskLine — line rises out of an overflow mask (hero headline).      */
/* ------------------------------------------------------------------ */
export function MaskLine({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <span className="block">{children}</span>;
  }
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <motion.span
        className="block"
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger — orchestrates StaggerItem children one after another.      */
/* Works on mount (`load`) or when scrolled into view.                 */
/* ------------------------------------------------------------------ */
const STAGGER_TAGS = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  dl: motion.dl,
  section: motion.section,
} as const;

export function Stagger({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
  load = false,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof STAGGER_TAGS;
  stagger?: number;
  delay?: number;
  load?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = STAGGER_TAGS[as];
  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <Tag
      className={className}
      initial="hidden"
      animate={load ? "show" : undefined}
      whileInView={load ? undefined : "show"}
      viewport={load ? undefined : { once: true, margin: "0px 0px -64px 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Tag>
  );
}

const ITEM_TAGS = { div: motion.div, li: motion.li } as const;

export function StaggerItem({
  children,
  className,
  as = "div",
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof ITEM_TAGS;
  y?: number;
}) {
  const Tag = ITEM_TAGS[as];
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* CtaLink — primary/secondary button with hover lift + press feel.    */
/* ------------------------------------------------------------------ */
const MotionLink = motion.create(Link);

export function CtaLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <MotionLink
      href={href}
      className={`button${secondary ? " secondary" : ""}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
    </MotionLink>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — ledger numbers count up the first time they appear.       */
/* ------------------------------------------------------------------ */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
    if (reduce) {
      el.textContent = fmt(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.5,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return <span ref={ref}>{"0"}</span>;
}

/* ------------------------------------------------------------------ */
/* AnimatedHemicycle — seat-by-seat sweep-in driven by a single        */
/* viewport observer on the <svg>; delays ripple from the apex down.   */
/* ------------------------------------------------------------------ */
export function AnimatedHemicycle({
  seats,
  geometry,
  summaryLabel,
  className = "",
  spread = 0.85,
}: {
  seats: { index: number; x: number; y: number; blockKey: string; blockLabel: string }[];
  geometry: { width: number; height: number; seatRadius: number };
  summaryLabel: string;
  className?: string;
  spread?: number;
}) {
  const reduce = useReducedMotion();
  let minY = Infinity;
  let maxY = -Infinity;
  for (const s of seats) {
    if (s.y < minY) minY = s.y;
    if (s.y > maxY) maxY = s.y;
  }
  const range = maxY - minY || 1;

  return (
    <motion.svg
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      role="img"
      aria-label={summaryLabel}
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={reduce ? undefined : { once: true, amount: 0.2 }}
    >
      {seats.map((seat) => {
        const vacant = seat.blockKey === "__vacant";
        const fill = vacant ? "var(--seat-track)" : partyColor(seat.blockKey);
        const delay = ((seat.y - minY) / range) * spread;
        return (
          <motion.circle
            key={seat.index}
            cx={seat.x}
            cy={seat.y}
            r={geometry.seatRadius}
            fill={fill}
            stroke={vacant ? "var(--rule-strong)" : "rgba(0,0,0,0.14)"}
            strokeWidth={vacant ? 1 : 0.5}
            strokeDasharray={vacant ? "2 1.6" : undefined}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            variants={{
              hidden: { opacity: 0, scale: 0 },
              show: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.45, delay, ease: EASE },
              },
            }}
          >
            {!vacant && <title>{seat.blockLabel}</title>}
          </motion.circle>
        );
      })}
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollProgress — thin indelible reading bar pinned to the top.      */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-indelible"
      style={{ scaleX }}
    />
  );
}
