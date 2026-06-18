import { useState } from "react";
import { C, F } from "../../theme.js";

// Visual trace card ported from the mockup. Local interaction only: the learner
// "traces" by tapping the glyph, which marks it done and advances the session.
// TODO: real KanjiVG stroke-order tracing engine.
export default function TraceCard({ item, onAdvance }) {
  const [traced, setTraced] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
      <div style={{ fontSize: 13, color: C.inkSoft, fontWeight: 600 }}>Trace the character</div>
      <button
        onClick={() => setTraced(true)}
        data-testid="trace-pad"
        aria-label={`Trace ${item.front}`}
        style={{
          flex: 1,
          position: "relative",
          background: C.surface,
          border: `2px dashed ${traced ? C.matcha : C.line}`,
          borderRadius: 20,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: F.jp,
            fontSize: 140,
            color: traced ? C.ink : C.lockedBg,
            transition: "color 200ms ease",
          }}
        >
          {item.front}
        </span>
      </button>
      <button
        onClick={onAdvance}
        disabled={!traced}
        style={{
          padding: 16,
          borderRadius: 14,
          border: "none",
          background: traced ? C.ai : C.lockedBg,
          color: traced ? "#fff" : C.locked,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: F.body,
          cursor: traced ? "pointer" : "default",
        }}
      >
        {traced ? "Continue" : "Trace to continue"}
      </button>
    </div>
  );
}
