import { useState, useEffect } from "react";
import { C, F } from "../../theme.js";

const GRADES = [
  { grade: "again", label: "Again", color: C.shu },
  { grade: "hard", label: "Hard", color: C.inkSoft },
  { grade: "good", label: "Good", color: C.ai },
  { grade: "easy", label: "Easy", color: C.matcha },
];

// Fully wired recall card: show the item front, reveal the reading/meaning,
// then grade it. Grading flows up to the session runner, which calls
// store.gradeItem(id, grade).
export default function RecallCard({ item, onGrade }) {
  const [revealed, setRevealed] = useState(false);

  // Reset when the item changes (new card in the session).
  useEffect(() => setRevealed(false), [item.id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          background: C.surface,
          border: `1px solid ${C.line}`,
          borderRadius: 20,
          padding: "32px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: F.jp, fontSize: 72, fontWeight: 500, lineHeight: 1 }}>
          {item.front}
        </div>

        {revealed ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontFamily: F.mono, fontSize: 20, color: C.ai, fontWeight: 600 }}>
              {item.reading}
            </div>
            {item.meaning && (
              <div style={{ fontSize: 18, color: C.ink }}>{item.meaning}</div>
            )}
            {item.example && (
              <div style={{ marginTop: 8, fontSize: 14, color: C.inkSoft }}>
                <span style={{ fontFamily: F.jp }}>{item.example.jp}</span>
                {" — "}
                {item.example.en}
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: C.locked }}>Tap reveal to check</div>
        )}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          data-testid="reveal"
          style={{
            padding: "16px",
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
          Reveal
        </button>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {GRADES.map(({ grade, label, color }) => (
            <button
              key={grade}
              onClick={() => onGrade(grade)}
              style={{
                padding: "14px",
                borderRadius: 12,
                border: `1.5px solid ${color}`,
                background: C.surface,
                color,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: F.body,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
