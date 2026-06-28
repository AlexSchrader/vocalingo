import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Globe, Info, AlertTriangle, FlaskConical, ChevronRight, LogIn, LogOut, Cloud, CheckCircle2 } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { LANGUAGES } from "../data/index.js";
import { C, F } from "../theme.js";
import { VERSION } from "../version.js";

function Section({ title, children }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
      {Icon && <Icon size={16} color={C.inkSoft} />}
      <span style={{ flex: 1, fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 14, color: C.inkSoft, fontFamily: F.mono }}>{value}</span>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2, lineHeight: 1.35 }}>{desc}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{
          width: 46,
          height: 28,
          borderRadius: 999,
          flexShrink: 0,
          border: "none",
          cursor: "pointer",
          padding: 3,
          background: checked ? C.ai : C.locked,
          display: "flex",
          justifyContent: checked ? "flex-end" : "flex-start",
          alignItems: "center",
          transition: "background 150ms",
        }}
      >
        <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", display: "block" }} />
      </button>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const resetAll = useStore((s) => s.resetAll);
  const languages = useStore((s) => s.languages);
  const streak = useStore((s) => s.streak);
  const stats = useStore((s) => s.stats);
  const devMode = useStore((s) => s.devMode);
  const unlockDevMode = useStore((s) => s.unlockDevMode);
  const disableDevMode = useStore((s) => s.disableDevMode);
  const settings = useStore((s) => s.settings);
  const setSetting = useStore((s) => s.setSetting);
  const auth = useStore((s) => s.auth);
  const signInWithGoogle = useStore((s) => s.signInWithGoogle);
  const signOut = useStore((s) => s.signOut);
  const [confirming, setConfirming] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const ja = languages.ja ?? LANGUAGES[0];

  const doReset = () => {
    resetAll();
    setConfirming(false);
    navigate("/");
  };

  const tryUnlock = () => {
    if (unlockDevMode(code)) {
      setCode("");
      setCodeError(false);
      navigate("/dev");
    } else {
      setCodeError(true);
    }
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontFamily: F.disp, fontSize: 22, fontWeight: 700 }}>Settings</div>
        <div style={{ fontSize: 13, color: C.inkSoft }}>Manage your progress and the app.</div>
      </div>

      <Section title="About">
        <Row icon={Info} label="Version" value={VERSION} />
        <Row icon={Globe} label="Learning" value={`${ja.flag} ${ja.name} · ${ja.level}`} />
        <Row label="Streak" value={`${streak.current} day${streak.current === 1 ? "" : "s"}`} />
        <Row label="Freezes" value={streak.freezes} />
        <Row label="Total XP" value={stats.xpTotal} />
      </Section>

      <Section title="Account">
        {!auth?.configured ? (
          <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.4 }}>
            Account sync isn't configured on this build yet. Once it's set up, you'll sign in here
            and your progress will follow you to any device.
          </div>
        ) : auth.user ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Cloud size={18} color={C.ai} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {auth.user.email ?? "Signed in"}
                </div>
                <div style={{ fontSize: 12, color: auth.status === "error" ? C.shu : C.inkSoft, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  {auth.status === "synced" && <><CheckCircle2 size={12} color={C.matcha} /> Progress synced to your account</>}
                  {auth.status === "syncing" && "Syncing…"}
                  {auth.status === "error" && `Sync error: ${auth.error ?? "unknown"}`}
                  {(auth.status === "idle" || !auth.status) && "Signed in"}
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 12, border: `1.5px solid ${C.line}`, background: C.surface, color: C.inkSoft, fontSize: 14, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.4 }}>
              Sign in to save your progress to your account and pick up on any device.
            </div>
            <button
              onClick={() => signInWithGoogle()}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 12, border: `1.5px solid ${C.ai}`, background: C.aiSoft, color: C.aiDeep, fontSize: 15, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
            >
              <LogIn size={18} /> Sign in with Google
            </button>
          </div>
        )}
      </Section>

      <Section title="Sound">
        <Toggle
          label="Sound effects"
          desc="Gentle chimes on correct and incorrect answers."
          checked={settings?.sfx ?? true}
          onChange={(v) => setSetting("sfx", v)}
        />
        <Toggle
          label="Auto-play pronunciation"
          desc="Say each new word aloud when it appears. The speaker button still works either way."
          checked={settings?.autoplayAudio ?? true}
          onChange={(v) => setSetting("autoplayAudio", v)}
        />
      </Section>

      <Section title="Progress">
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: 14,
              borderRadius: 12,
              border: `1.5px solid ${C.shu}`,
              background: C.surface,
              color: C.shu,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: F.body,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={18} />
            Reset all progress
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                color: C.shu,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              This wipes every item's progress, your streak, freezes, and XP back to a
              fresh start. It can't be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirming(false)}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  border: `1.5px solid ${C.line}`,
                  background: C.surface,
                  color: C.inkSoft,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: F.body,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={doReset}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  background: C.shu,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: F.body,
                  cursor: "pointer",
                }}
              >
                Reset everything
              </button>
            </div>
          </div>
        )}
      </Section>

      <Section title="Dev Mode">
        {devMode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => navigate("/dev")}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: 14, borderRadius: 12, border: `1.5px solid ${C.ai}`, background: C.aiSoft, color: C.aiDeep, fontSize: 15, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
            >
              <FlaskConical size={18} />
              <span style={{ flex: 1, textAlign: "left" }}>Open dev panel</span>
              <ChevronRight size={18} />
            </button>
            <button
              onClick={disableDevMode}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: `1.5px solid ${C.line}`, background: C.surface, color: C.inkSoft, fontSize: 14, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
            >
              Disable Dev Mode
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: C.inkSoft }}>Enter the playtest code to unlock.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") tryUnlock();
                }}
                placeholder="Code"
                aria-label="Dev Mode code"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${codeError ? C.shu : C.line}`, background: C.surface, color: C.ink, fontSize: 15, fontFamily: F.mono, outline: "none" }}
              />
              <button
                onClick={tryUnlock}
                style={{ padding: "12px 18px", borderRadius: 12, border: "none", background: C.ai, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
              >
                Unlock
              </button>
            </div>
            {codeError && (
              <div style={{ fontSize: 13, color: C.shu, fontWeight: 600 }}>Not the right code.</div>
            )}
          </div>
        )}
      </Section>

      <div style={{ textAlign: "center", fontFamily: F.mono, fontSize: 11, color: C.locked, opacity: 0.6 }}>
        🇯🇵 {VERSION}
      </div>
    </div>
  );
}
