import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { C, F } from "../theme.js";

// Canned replies — the AI is stubbed for this brief.
// TODO: POST /api/haruki (Claude + ElevenLabs)
const CANNED = [
  "こんにちは！ I'm Haruki. Let's practice — try greeting me.",
  "いいね！ Nice. Now try saying goodbye.",
  "上手 (jōzu)! You're getting the hang of this.",
  "Keep going — repetition is how it sticks. もう一度！",
];

export default function Haruki() {
  const [messages, setMessages] = useState([
    { from: "haruki", text: "こんにちは！ I'm Haruki, your tutor. Say something in Japanese." },
  ]);
  const [draft, setDraft] = useState("");
  const replyIdx = useRef(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const reply = CANNED[replyIdx.current % CANNED.length];
    replyIdx.current += 1;
    setMessages((m) => [...m, { from: "me", text }, { from: "haruki", text: reply }]);
    setDraft("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: F.disp, fontSize: 22, fontWeight: 700 }}>Haruki</div>
        <div style={{ fontSize: 13, color: C.inkSoft }}>Your AI tutor (responses are canned for now)</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8 }}>
        {messages.map((m, i) => {
          const mine = m.from === "me";
          return (
            <div key={i} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius: 16,
                  borderBottomRightRadius: mine ? 4 : 16,
                  borderBottomLeftRadius: mine ? 16 : 4,
                  background: mine ? C.ai : C.surface,
                  color: mine ? "#fff" : C.ink,
                  border: mine ? "none" : `1px solid ${C.line}`,
                  fontFamily: F.body,
                  fontSize: 15,
                  lineHeight: 1.4,
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 999,
            border: `1px solid ${C.line}`,
            background: C.surface,
            fontFamily: F.body,
            fontSize: 15,
            outline: "none",
          }}
        />
        <button
          onClick={send}
          aria-label="Send"
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            background: C.ai,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
