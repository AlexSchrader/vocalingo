import { useRef, useState, useEffect } from "react";
import { C } from "../../theme.js";
import { sfxCorrect, sfxWrong } from "../../store/sfx.js";
import { KANJIVG } from "../../data/kanjivg.js";

const KVG_SIZE = 109; // fixed by KanjiVG spec — not a tuning knob
// Skip stroke animations in Playwright/WebDriver so CI smoke tests finish quickly.
const IS_WEBDRIVER = typeof navigator !== "undefined" && !!navigator.webdriver;

// All tuning knobs in one place. A playtest feel-fix is a one-line change here.
const TRACE_OPTS = {
  resampleN: 80,        // points to resample each stroke path to
  matchThreshold: 0.22, // distance normalization in strokeScore; larger = more tolerant
  acceptScore: 0.3,     // minimum strokeScore result to accept a drawn stroke
  retryLimit: 2,        // misses before grade degrades from "hard" to "again"
};

// Sample an SVG path string into N evenly-spaced [x,y] points using the DOM.
function samplePath(d, n) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;top:-9999px";
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const len = path.getTotalLength();
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const pt = path.getPointAtLength((i / n) * len);
    pts.push([pt.x, pt.y]);
  }
  svg.remove();
  return pts;
}

// Scale KanjiVG points [0–109] → canvas CSS pixel space.
function scale(pts, s) {
  return pts.map(([x, y]) => [x * s, y * s]);
}

// How well does drawnPts match expectedPts (both in canvas px)?
// Returns 0–1; < MATCH_THRESHOLD → reject.
function strokeScore(drawn, expected, canvasW) {
  if (drawn.length < 3) return 0;
  const norm = (pts) => pts.map(([x, y]) => [x / canvasW, y / canvasW]);
  const a = norm(drawn);
  const b = norm(expected);
  // Wrong direction: start of drawn must be near start of expected
  if (Math.hypot(a[0][0] - b[0][0], a[0][1] - b[0][1]) > 0.35) return 0;
  // Average nearest-neighbour distance
  let total = 0;
  for (const [ax, ay] of a) {
    let min = Infinity;
    for (const [bx, by] of b) {
      const d = Math.hypot(ax - bx, ay - by);
      if (d < min) min = d;
    }
    total += min;
  }
  return Math.max(0, 1 - total / a.length / TRACE_OPTS.matchThreshold);
}

// Draw a polyline on canvas ctx.
function drawLine(ctx, pts, color, width) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();
  ctx.restore();
}

// ---

// mode: "guided" → animated guide then trace; "free" → draw from memory with snap
export default function TraceCard({ item, mode = "guided", onGraded }) {
  const strokes = KANJIVG[item.front] ?? [];
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const drawing = useRef(false);
  const currentPts = useRef([]);

  // Pre-sampled stroke points in KanjiVG space (computed once per item)
  const strokePts = useRef([]);

  const [strokeIdx, setStrokeIdx] = useState(0);
  // phase: "animating" | "waiting" | "drawing" | "snapping" | "done"
  const [phase, setPhase] = useState(mode === "guided" ? "animating" : "drawing");
  const [doneStrokes, setDoneStrokes] = useState([]); // confirmed stroke indices
  const [feedback, setFeedback] = useState(null); // null|"correct"|"wrong"
  const [misses, setMisses] = useState(0);

  // --- canvas helpers ---

  function getCtx() { return canvasRef.current?.getContext("2d") ?? null; }
  function getScale() {
    const c = canvasRef.current;
    return c ? c.getBoundingClientRect().width / KVG_SIZE : 1;
  }

  function setupCanvas() {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.round(rect.width * dpr);
    c.height = Math.round(rect.height * dpr);
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Redraw only the confirmed (snapped) strokes.
  function redrawConfirmed(extraDoneStrokes) {
    const ctx = getCtx();
    if (!ctx) return;
    const s = getScale();
    const c = canvasRef.current;
    ctx.clearRect(0, 0, c.width, c.height);
    const list = extraDoneStrokes ?? doneStrokes;
    for (const i of list) {
      const pts = scale(strokePts.current[i] ?? [], s);
      drawLine(ctx, pts, C.ai, 8);
    }
  }

  // --- effects ---

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, []);

  // Reset everything when item changes.
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    strokePts.current = strokes.map((d) => samplePath(d, TRACE_OPTS.resampleN));
    setStrokeIdx(0);
    setDoneStrokes([]);
    setPhase(mode === "guided" ? "animating" : "drawing");
    setFeedback(null);
    setMisses(0);
    currentPts.current = [];
    drawing.current = false;
    setTimeout(() => redrawConfirmed([]), 0);
  }, [item.id]);

  // Guided animation: play the stroke, then hand off to user.
  useEffect(() => {
    if (phase !== "animating") return;
    if (strokeIdx >= strokes.length) return;

    const pts = scale(strokePts.current[strokeIdx] ?? [], getScale());
    let i = 0;

    const tick = () => {
      const ctx = getCtx();
      if (!ctx) return;
      redrawConfirmed();
      // Faded guide path (full)
      drawLine(ctx, pts, `${C.ai}33`, 10);
      // Animated portion
      drawLine(ctx, pts.slice(0, i + 1), `${C.ai}99`, 10);
      // Leading dot
      if (pts[i]) {
        ctx.save();
        ctx.fillStyle = C.ai;
        ctx.beginPath();
        ctx.arc(pts[i][0], pts[i][1], 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      i += 2;
      if (i < pts.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Hold for 300ms then let user trace
        rafRef.current = null;
        setTimeout(() => {
          redrawConfirmed();
          // Leave faded guide visible while user traces
          drawLine(getCtx(), pts, `${C.ai}33`, 10);
          setPhase("waiting");
        }, 300);
      }
    };
    const timer = setTimeout(() => {
      if (IS_WEBDRIVER) {
        // Skip animation in test environments — go straight to "waiting" phase.
        redrawConfirmed();
        drawLine(getCtx(), pts, `${C.ai}33`, 10);
        setPhase("waiting");
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    }, IS_WEBDRIVER ? 0 : 350);
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, strokeIdx]);

  // --- snap animation ---

  function snapAndAdvance(drawnPts, nextDone) {
    setPhase("snapping");
    const ctx = getCtx();
    if (!ctx) { finishStroke(nextDone); return; }
    const s = getScale();
    const target = scale(strokePts.current[doneStrokes.length] ?? [], s);
    const n = Math.max(drawnPts.length, target.length);
    const lerp = (a, b, t) => a + (b - a) * t;
    const getPt = (arr, i) => arr[Math.min(Math.round((i / n) * (arr.length - 1)), arr.length - 1)];
    let t = 0;

    const tick = () => {
      redrawConfirmed();
      ctx.save();
      ctx.strokeStyle = C.ai;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const [ax, ay] = getPt(drawnPts, i);
        const [bx, by] = getPt(target, i);
        const x = lerp(ax, bx, t);
        const y = lerp(ay, by, t);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
      t += 0.1;
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        finishStroke(nextDone);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function finishStroke(nextDone) {
    setDoneStrokes(nextDone);
    const next = nextDone.length;
    if (next >= strokes.length) {
      setPhase("done");
      redrawConfirmed(nextDone);
    } else {
      setStrokeIdx(next);
      if (mode === "guided") {
        setPhase("animating");
      } else {
        setPhase("drawing");
        redrawConfirmed(nextDone);
      }
    }
  }

  // --- pointer events ---

  function canvasPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  function onPointerDown(e) {
    if (phase !== "waiting" && phase !== "drawing") return;
    e.preventDefault();
    canvasRef.current.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    currentPts.current = [canvasPos(e)];
    const ctx = getCtx();
    if (ctx) {
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }

  function onPointerMove(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const p = canvasPos(e);
    const prev = currentPts.current[currentPts.current.length - 1];
    currentPts.current.push(p);
    const ctx = getCtx();
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(prev[0], prev[1]);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();
  }

  function onPointerUp() {
    if (!drawing.current) return;
    drawing.current = false;
    const pts = [...currentPts.current];
    currentPts.current = [];
    if (pts.length < 3) return;

    const s = getScale();
    const expected = scale(strokePts.current[strokeIdx] ?? [], s);
    const canvasW = canvasRef.current?.getBoundingClientRect().width ?? 280;

    if (mode === "guided") {
      // Guided: accept any ink → snap to path
      setFeedback("correct");
      sfxCorrect();
      const nextDone = [...doneStrokes, strokeIdx];
      setTimeout(() => { setFeedback(null); snapAndAdvance(pts, nextDone); }, 150);
    } else {
      // Free: score the stroke
      const score = strokeScore(pts, expected, canvasW);
      if (score > TRACE_OPTS.acceptScore) {
        setFeedback("correct");
        sfxCorrect();
        const nextDone = [...doneStrokes, strokeIdx];
        setTimeout(() => { setFeedback(null); snapAndAdvance(pts, nextDone); }, 150);
      } else {
        const newMisses = misses + 1;
        setMisses(newMisses);
        setFeedback("wrong");
        sfxWrong();
        setTimeout(() => {
          setFeedback(null);
          redrawConfirmed();
          // After 2 misses, show the stroke guide briefly
          if (newMisses >= TRACE_OPTS.retryLimit) {
            const guidePts = scale(strokePts.current[strokeIdx] ?? [], s);
            drawLine(getCtx(), guidePts, `${C.shu}99`, 10);
            setTimeout(() => redrawConfirmed(), 1000);
          }
        }, 600);
      }
    }
  }

  // --- grade on done ---

  useEffect(() => {
    if (phase !== "done") return;
    const grade = misses === 0 ? "good" : misses <= TRACE_OPTS.retryLimit ? "hard" : "again";
    const timer = setTimeout(() => onGraded?.(grade), 500);
    return () => clearTimeout(timer);
  }, [phase]);

  // --- test hook (dev only) ---
  // Exposes window.__trace.{ submitGood, submitBad } so the smoke test can drive
  // free-mode trace deterministically without pointer events. Never shipped in
  // production builds. hookRef is updated every render so the hook always sees
  // the latest phase/strokeIdx/doneStrokes without the effect re-registering.
  const hookRef = useRef({});
  hookRef.current = {
    submitGood() {
      if (phase !== "drawing" && phase !== "waiting") return;
      const s = getScale();
      const pts = scale(strokePts.current[strokeIdx] ?? [], s);
      if (pts.length < 3) return;
      drawing.current = true;
      currentPts.current = pts;
      onPointerUp();
    },
    submitBad() {
      if (phase !== "drawing" && phase !== "waiting") return;
      // Points in the far bottom-right corner — guaranteed to fail the direction
      // check for every kana stroke, which starts near the character centre.
      const c = canvasRef.current;
      const w = c?.getBoundingClientRect().width ?? 280;
      drawing.current = true;
      currentPts.current = Array.from({ length: 5 }, (_, i) => [w - 5, w - 5 + i]);
      onPointerUp();
    },
  };
  useEffect(() => {
    if (import.meta.env.PROD) return;
    window.__trace = {
      submitGood: () => hookRef.current.submitGood(),
      submitBad: () => hookRef.current.submitBad(),
    };
    return () => { delete window.__trace; };
  }, [item.id]);

  // --- render ---

  const hint = phase === "animating"
    ? `Stroke ${strokeIdx + 1} of ${strokes.length} — watch`
    : phase === "waiting"
    ? `Stroke ${strokeIdx + 1} of ${strokes.length} — now trace it`
    : phase === "drawing"
    ? `Stroke ${strokeIdx + 1} of ${strokes.length}`
    : phase === "done"
    ? "Done!"
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.inkSoft, fontWeight: 600 }}>
          {mode === "guided" ? "Trace the character" : "Write from memory"}
        </span>
        <span style={{ fontSize: 12, color: C.inkSoft }}>{hint}</span>
      </div>

      <div
        style={{
          aspectRatio: "1 / 1",
          alignSelf: "stretch",
          position: "relative",
          background: C.surface,
          border: `2px solid ${
            feedback === "correct" ? C.matcha : feedback === "wrong" ? C.shu : C.line
          }`,
          borderRadius: 20,
          overflow: "hidden",
          transition: "border-color 180ms",
        }}
      >
        {/* Ghost character in the same KanjiVG coordinate space as the canvas strokes.
            viewBox 0 0 109 109 + xMinYMin meet mirrors getScale() = canvasWidth/109.
            vectorEffect keeps stroke width in screen pixels regardless of SVG scale. */}
        <svg
          aria-hidden
          viewBox="0 0 109 109"
          preserveAspectRatio="xMinYMin meet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", userSelect: "none" }}
        >
          {strokes.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.lockedBg} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        {/* Stroke progress dots */}
        <div style={{ position: "absolute", top: 10, right: 12, display: "flex", gap: 5 }}>
          {strokes.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: doneStrokes.includes(i) ? C.matcha : i === strokeIdx ? C.ai : C.line,
                transition: "background 200ms",
              }}
            />
          ))}
        </div>

        <canvas
          ref={canvasRef}
          data-testid="trace-pad"
          aria-label={`Trace ${item.front}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
            cursor: phase === "animating" || phase === "snapping" ? "default" : "crosshair",
          }}
        />
      </div>
    </div>
  );
}
