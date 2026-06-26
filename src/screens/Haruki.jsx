import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Phone, PhoneOff, Send } from "lucide-react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { C, F } from "../theme.js";

// One conversation, two ways in: type OR talk. Both share the same session and
// transcript — you can call mid-text or drop back to typing, and it's the same
// chat. Powered by the ElevenLabs Conversational AI agent (Claude + Haruki's
// native-JP voice). The API key never reaches here — /api/convai-session mints
// an expiring signed URL server-side. useConversation needs ConversationProvider.
export default function Haruki() {
  return (
    <ConversationProvider>
      <HarukiChat />
    </ConversationProvider>
  );
}

function HarukiChat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [voiceOn, setVoiceOn] = useState(false);
  const [err, setErr] = useState(null);
  const pendingText = useRef(null); // text typed before the session finished connecting
  const bottomRef = useRef(null);

  const convo = useConversation({
    onConnect: () => setErr(null),
    onError: (e) => setErr(typeof e === "string" ? e : e?.message || "Connection error."),
    onMessage: (m) => {
      if (!m?.message) return;
      const mine = (m.source ?? m.role) === "user";
      setMessages((list) => {
        // Skip the echo of a text message we already added optimistically.
        const last = list[list.length - 1];
        if (mine && last && last.mine && last.text === m.message) return list;
        return [...list, { mine, text: m.message }];
      });
    },
  });

  const status = convo.status; // "disconnected" | "connecting" | "connected" | "error"
  const connected = status === "connected";
  const connecting = status === "connecting";
  const live = connected || connecting;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Once connected: flush any queued text, and set the mic to match text/voice mode.
  useEffect(() => {
    if (status !== "connected") return;
    convo.setMuted(!voiceOn);
    if (pendingText.current) {
      convo.sendUserMessage(pendingText.current);
      pendingText.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, voiceOn]);

  // End the session when leaving the screen.
  useEffect(() => () => convo.endSession(), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function ensureSession() {
    if (live) return true;
    const res = await fetch("/api/convai-session?lang=ja");
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || `Couldn't start the session (${res.status}).`);
    }
    const { signedUrl } = await res.json();
    convo.startSession({ signedUrl });
    return false; // not connected yet — caller queues
  }

  async function sendText() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((list) => [...list, { mine: true, text }]); // optimistic
    try {
      const ready = await ensureSession();
      if (ready) convo.sendUserMessage(text);
      else pendingText.current = text; // sent once connected
    } catch (e) {
      setErr(e?.message || "Couldn't reach Haruki.");
    }
  }

  async function startCall() {
    setErr(null);
    try {
      setVoiceOn(true);
      const ready = await ensureSession();
      if (ready) convo.setMuted(false);
    } catch (e) {
      setVoiceOn(false);
      setErr(e?.message || "Couldn't connect. Check your mic permission and try again.");
    }
  }

  function endCall() {
    setVoiceOn(false);
    convo.setMuted(true); // back to text; keep the session for typing
  }

  const empty = messages.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, padding: 16 }}>
      <div style={{ marginBottom: 12, flexShrink: 0 }}>
        <div style={{ fontFamily: F.disp, fontSize: 22, fontWeight: 700 }}>Haruki</div>
        <div style={{ fontSize: 13, color: C.inkSoft }}>Type or talk — it's all one conversation.</div>
      </div>

      {/* Transcript (or warm empty state) — scrolls; input stays pinned below. */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "4px 0" }}>
        {empty ? (
          <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center", color: C.inkSoft }}>
            <img src="/lingua-wave.png" alt="" aria-hidden style={{ width: "clamp(120px, 32vw, 180px)", height: "auto", objectFit: "contain" }} />
            <div style={{ fontSize: 14, maxWidth: 260 }}>Say something in Japanese — type it below, or tap the phone to talk.</div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: 16,
                  borderBottomRightRadius: m.mine ? 4 : 16,
                  borderBottomLeftRadius: m.mine ? 16 : 4,
                  background: m.mine ? C.ai : C.surface,
                  color: m.mine ? "#fff" : C.ink,
                  border: m.mine ? "none" : `1px solid ${C.line}`,
                  fontFamily: F.body,
                  fontSize: 15,
                  lineHeight: 1.4,
                }}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Live voice strip — only while on a call */}
      {voiceOn && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            marginBottom: 8,
            borderRadius: 12,
            background: C.surface,
            border: `1px solid ${C.line}`,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: convo.isSpeaking ? C.shu : C.matcha, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.ai }}>
            {connecting ? "Connecting…" : convo.isSpeaking ? "Haruki is speaking…" : "Listening — go ahead"}
          </span>
          <button
            onClick={() => convo.setMuted(!convo.isMuted)}
            aria-label={convo.isMuted ? "Unmute" : "Mute"}
            disabled={!connected}
            style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${C.line}`, background: convo.isMuted ? C.lockedBg : C.washi, color: convo.isMuted ? C.shu : C.ai, display: "flex", alignItems: "center", justifyContent: "center", cursor: connected ? "pointer" : "default", flexShrink: 0 }}
          >
            {convo.isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>
      )}

      {err && <div style={{ flexShrink: 0, fontSize: 13, color: C.shu, textAlign: "center", marginBottom: 8 }}>{err}</div>}

      {/* Input bar: type + send, and a phone toggle for voice */}
      <div style={{ flexShrink: 0, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendText()}
          placeholder="Type a message…"
          style={{ flex: 1, padding: "12px 14px", borderRadius: 999, border: `1px solid ${C.line}`, background: C.surface, fontFamily: F.body, fontSize: 15, outline: "none", minWidth: 0 }}
        />
        {draft.trim() ? (
          <button
            onClick={sendText}
            aria-label="Send"
            style={{ width: 46, height: 46, borderRadius: "50%", border: "none", background: C.ai, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <Send size={20} />
          </button>
        ) : (
          <button
            onClick={voiceOn ? endCall : startCall}
            aria-label={voiceOn ? "End call" : "Call Haruki"}
            style={{ width: 46, height: 46, borderRadius: "50%", border: "none", background: voiceOn ? C.shu : C.ai, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            {voiceOn ? <PhoneOff size={20} /> : <Phone size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
