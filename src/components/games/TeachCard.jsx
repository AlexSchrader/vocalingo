import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { C, F } from "../../theme.js";
import { sfxClick } from "../../store/sfx.js";

function useItemAudio(text) {
  const [active, setActive] = useState(false);

  function play() {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = 0.85;
    u.onstart = () => setActive(true);
    u.onend = () => setActive(false);
    u.onerror = () => setActive(false);
    window.speechSynthesis.speak(u);
  }

  useEffect(() => { play(); }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  return { play, active };
}

export default function TeachCard({ item, onAdvance }) {
  const { play, active } = useItemAudio(item.front);
  const isKana = item.type === "kana";
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
      <div style={{ fontSize: 13, color: C.inkSoft, fontWeight: 600 }}>
        New {isKana ? "character" : "word"}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
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
        <div style={{ fontFamily: F.mono, fontSize: 20, color: C.ai, fontWeight: 600 }}>
          {item.reading}
        </div>
        {item.meaning && <div style={{ fontSize: 18 }}>{item.meaning}</div>}
        {item.example && (
          <div style={{ fontSize: 14, color: C.inkSoft }}>
            <span style={{ fontFamily: F.jp }}>{item.example.jp}</span> — {item.example.en}
          </div>
        )}

        {item.hint && (
          <div
            style={{
              fontSize: 12,
              color: C.inkSoft,
              fontStyle: "italic",
              textAlign: "center",
              maxWidth: 280,
              padding: "8px 14px",
              background: C.washi,
              borderRadius: 10,
            }}
          >
            Memory hook: {item.hint}
          </div>
        )}

        <button
          onClick={play}
          aria-label="Replay pronunciation"
          style={{
            marginTop: 4,
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: `1px solid ${active ? C.ai : C.line}`,
            background: active ? C.ai : C.washi,
            color: active ? "#fff" : C.ai,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 150ms, border-color 150ms",
          }}
        >
          <Volume2 size={20} />
        </button>
      </div>

      <button
        onClick={() => { sfxClick(); onAdvance(); }}
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
        Got it
      </button>
    </div>
  );
}
