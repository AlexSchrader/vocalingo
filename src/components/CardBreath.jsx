import { useState, useEffect } from "react";

// A short "breath" on every new card: it fades in over ~180ms and ignores input
// for the first ~220ms, so a carried tap or double-tap from the previous card
// can't accidentally answer (or skip) the next one. This is an ND-friendly pacing
// guard — momentum shouldn't punish you — not an animation for its own sake.
//
// Driven by a keyed remount: the runners give it `key={cardKey}`, so it mounts
// fresh per card and re-runs the entrance each time. Honors prefers-reduced-motion
// by skipping the transform (the input guard still applies).
const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CardBreath({ children, ms = 220 }) {
  const [shown, setShown] = useState(false); // drives the fade-in
  const [ready, setReady] = useState(false); // gates pointer input

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const t = setTimeout(() => setReady(true), ms);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [ms]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        opacity: shown ? 1 : 0,
        transform: shown || REDUCED_MOTION ? "none" : "translateY(6px)",
        transition: "opacity 180ms ease, transform 180ms ease",
        pointerEvents: ready ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}
