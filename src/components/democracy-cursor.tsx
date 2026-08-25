"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * A soft tricolour glow that briefly follows mouse movement.
 * It stays decorative, ignores touch pointers, and fades when the pointer rests.
 */

const SIZE = 76;
const HALF = SIZE / 2;
const IDLE_DELAY_MS = 140;

export function DemocracyCursor() {
  const reduceMotion = useReducedMotion();
  const [isMoving, setIsMoving] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);

  const pointerX = useMotionValue(-SIZE);
  const pointerY = useMotionValue(-SIZE);
  const x = useSpring(pointerX, { stiffness: 420, damping: 34, mass: 0.35 });
  const y = useSpring(pointerY, { stiffness: 420, damping: 34, mass: 0.35 });

  useEffect(() => {
    if (reduceMotion) return;

    const hide = () => {
      setIsMoving(false);
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      if (frame.current !== null) cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        pointerX.set(event.clientX);
        pointerY.set(event.clientY);
        setIsMoving(true);

        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(hide, IDLE_DELAY_MS);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", hide);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [pointerX, pointerY, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-20 will-change-transform"
      style={{ x, y }}
    >
      <motion.div
        className="rounded-full will-change-transform"
        style={{
          width: SIZE,
          height: SIZE,
          marginLeft: -HALF,
          marginTop: -HALF,
          background:
            "radial-gradient(circle at 30% 32%, rgba(255, 140, 26, 1) 0%, rgba(255, 153, 51, 0.82) 28%, transparent 58%), radial-gradient(circle at 52% 46%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.7) 28%, transparent 56%), radial-gradient(circle at 70% 68%, rgba(16, 118, 5, 1) 0%, rgba(19, 136, 8, 0.85) 30%, transparent 60%)",
          filter: "blur(6px) saturate(1.35)",
        }}
        initial={false}
        animate={{
          opacity: isMoving ? 1 : 0,
          scale: isMoving ? 1 : 0.72,
        }}
        transition={{
          opacity: {
            duration: isMoving ? 0.1 : 0.42,
            ease: "easeOut",
          },
          scale: {
            type: "spring",
            stiffness: 300,
            damping: 26,
          },
        }}
      />
    </motion.div>
  );
}
