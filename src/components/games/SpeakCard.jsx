import { useState } from "react";
import { Mic } from "lucide-react";
import { C, F } from "../../theme.js";

// Visual speak card ported from the mockup. Local interaction only: tapping the
// mic simulates a recording and lets the learner continue.
// TODO: real Whisper speech scoring.
export default function SpeakCard({ item, onAdvance }) {
  const [recorded, setRecorded] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
      <div style={{ fontSize: 13, color: C.inkSoft, fontWeight: 600 }}>Say it out loud</div>
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
        }}
      >
        <div style={{ fontFamily: F.jp, fontSize: 56, fontWeight: 500 }}>{item.front}</div>
        <div style={{ fontFamily: F.mono, fontSize: 18, color: C.ai }}>{item.reading}</div>
        <button
          onClick={() => setRecorded(true)}
          data-testid="record"
          aria-label="Record"
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            border: "none",
            background: recorded ? C.matcha : C.shu,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          <Mic size={30} />
        </button>
        <div style={{ fontSize: 13, color: recorded ? C.matcha : C.locked }}>
          {recorded ? "Nice — sounds good" : "Tap to record"}
        </div>
      </div>
      <button
        onClick={onAdvance}
        disabled={!recorded}
        style={{
          padding: 16,
          borderRadius: 14,
          border: "none",
          background: recorded ? C.ai : C.lockedBg,
          color: recorded ? "#fff" : C.locked,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: F.body,
          cursor: recorded ? "pointer" : "default",
        }}
      >
        {recorded ? "Continue" : "Record to continue"}
      </button>
    </div>
  );
}
