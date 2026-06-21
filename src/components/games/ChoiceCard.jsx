import { useState, useRef, useMemo, useEffect } from "react";
import { C, F } from "../../theme.js";
import { buildOptions } from "../../store/distractors.js";
import { deriveGrade } from "../../store/grading.js";
import { sfxCorrect, sfxWrong } from "../../store/sfx.js";

// Multiple choice (rung RECOGNIZED). Vocab → pick the meaning; kana → pick the
// reading. The app judges: correct → `good` (never `easy`), wrong → `again`
// with no retry. No self-grade buttons.
export default function ChoiceCard({ item, allItems, onGraded }) {
  const isKana = item.type === "kana";
  const options = useMemo(() => buildOptions(item, allItems), [item.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const [picked, setPicked] = useState(null);

  useEffect(() => setPicked(null), [item.id]);

  const answered = picked !== null;
  const grade = answered ? deriveGrade({ kind: "mc", correct: options[picked].correct }) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
      <div style={{ fontSize: 13, color: C.inkSoft, fontWeight: 600 }}>
        {isKana ? "Which sound is this?" : "What does this mean?"}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.surface,
          border: `1px solid ${C.line}`,
          borderRadius: 20,
          padding: "28px 20px",
        }}
      >
        <span style={{ fontFamily: F.jp, fontSize: 64, fontWeight: 500 }}>{item.front}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {options.map((o, i) => {
          let bg = C.surface;
          let border = C.line;
          let color = C.ink;
          if (answered) {
            if (o.correct) {
              bg = C.matcha; border = C.matcha; color = "#fff";
            } else if (i === picked) {
              bg = C.shu; border = C.shu; color = "#fff";
            } else {
              color = C.locked;
            }
          }
          return (
            <button
              key={i}
              data-testid="option"
              data-correct={String(o.correct)}
              disabled={answered}
              onClick={() => { if (answered) return; options[i].correct ? sfxCorrect() : sfxWrong(); setPicked(i); }}
              style={{
                padding: "16px 12px",
                borderRadius: 12,
                border: `1.5px solid ${border}`,
                background: bg,
                color,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: isKana ? F.mono : F.body,
                cursor: answered ? "default" : "pointer",
                minHeight: 56,
              }}
            >
              {o.text}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={() => onGraded(grade)}
          style={{
            padding: 16,
            borderRadius: 14,
            border: "none",
            background: C.ai,
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: F.body,
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      )}
    </div>
  );
}
