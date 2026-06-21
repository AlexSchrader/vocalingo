import { useState, useMemo, useRef } from "react";
import { C, F } from "../../theme.js";
import { deriveGrade } from "../../store/grading.js";
import { sfxClick, sfxCorrect, sfxWrong } from "../../store/sfx.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build card (rung PRODUCED): reconstruct the reading from scrambled syllable
// tiles. App-judged — assembling the correct reading grades by speed; a wrong
// final assembly grades `again`.
export default function BuildCard({ item, onGraded }) {
  const target = (item.reading || item.front).replace(/[ˉ̄]/g, "");
  const tiles = useMemo(() => shuffle(target.split("")), [item.id, target]);
  const shownAt = useRef(performance.now());
  const [picked, setPicked] = useState([]);

  const assembled = picked.map((i) => tiles[i]).join("");
  const correct = assembled === target;
  const full = picked.length === tiles.length;

  const commit = () => {
    if (correct) sfxCorrect(); else sfxWrong();
    const grade = correct
      ? deriveGrade({
          kind: "typed",
          correct: true,
          elapsedMs: performance.now() - shownAt.current,
          target,
        })
      : "again";
    onGraded(grade);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
      <div style={{ fontSize: 13, color: C.inkSoft, fontWeight: 600 }}>Build the reading</div>

      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.line}`,
          borderRadius: 20,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: F.jp, fontSize: 48, fontWeight: 500 }}>{item.front}</div>
        {item.meaning && <div style={{ marginTop: 4, color: C.inkSoft }}>{item.meaning}</div>}
      </div>

      <div
        style={{
          minHeight: 56,
          borderRadius: 12,
          border: `1.5px solid ${full ? (correct ? C.matcha : C.shu) : C.line}`,
          background: C.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.mono,
          fontSize: 22,
          color: full ? (correct ? C.matcha : C.shu) : C.ink,
          letterSpacing: 2,
        }}
      >
        {assembled || <span style={{ color: C.locked }}>tap tiles below</span>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {tiles.map((t, i) => {
          const used = picked.includes(i);
          return (
            <button
              key={i}
              data-testid="tile"
              disabled={used}
              onClick={() => { sfxClick(); setPicked((p) => [...p, i]); }}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: `1.5px solid ${C.ai}`,
                background: used ? C.lockedBg : C.aiSoft,
                color: used ? C.locked : C.aiDeep,
                fontFamily: F.mono,
                fontSize: 18,
                fontWeight: 700,
                cursor: used ? "default" : "pointer",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
        <button
          onClick={() => setPicked([])}
          style={{
            padding: 16,
            borderRadius: 14,
            border: `1.5px solid ${C.line}`,
            background: C.surface,
            color: C.inkSoft,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: F.body,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <button
          onClick={commit}
          disabled={!full}
          style={{
            flex: 1,
            padding: 16,
            borderRadius: 14,
            border: "none",
            background: full ? C.ai : C.lockedBg,
            color: full ? "#fff" : C.locked,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: F.body,
            cursor: full ? "pointer" : "default",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
