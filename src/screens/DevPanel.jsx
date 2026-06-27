import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, RotateCcw, FlaskConical, Play } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { UNITS } from "../data/index.js";
import { devDiagnostics, sandboxRoute, PREVIEW_STATES, PREVIEW_LABEL } from "../store/dev.js";
import { C, F } from "../theme.js";

function Section({ title, children }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function Stat({ label, value, warn }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
      <span style={{ flex: 1, fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: warn ? C.shu : C.ink, fontFamily: F.mono }}>
        {value}
      </span>
    </div>
  );
}

// Hidden playtest panel — visible only when Dev Mode is unlocked. Reads from
// UNITS data (no hardcoded unit names): launches any lesson directly (bypassing
// ladder/unlock gating) in a fully isolated sandbox run. See src/store/dev.js.
export default function DevPanel() {
  const navigate = useNavigate();
  const devMode = useStore((s) => s.devMode);
  const resetAll = useStore((s) => s.resetAll);
  const [confirming, setConfirming] = useState(false);

  const diag = useMemo(() => devDiagnostics(), []);

  // Guard: not security, just don't render the panel when locked.
  useEffect(() => {
    if (!devMode) navigate("/settings", { replace: true });
  }, [devMode, navigate]);
  if (!devMode) return null;

  const doReset = () => {
    resetAll();
    setConfirming(false);
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          aria-label="Back"
          onClick={() => navigate("/settings")}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 999, border: "none", background: "transparent", color: C.inkSoft, cursor: "pointer", padding: 0 }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div style={{ fontFamily: F.disp, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <FlaskConical size={20} color={C.ai} /> Dev Mode
          </div>
          <div style={{ fontSize: 13, color: C.inkSoft }}>Isolated playtest — nothing here touches real progress.</div>
        </div>
      </div>

      <Section title="Diagnostics — is the new unit wired right?">
        <Stat label="Units registered" value={diag.unitCount} />
        <Stat label="Lessons (playable)" value={diag.lessonCount} />
        <Stat label="Items total" value={diag.itemCount} />
        <Stat label="Kana with stroke data" value={`${diag.kanaWithStroke} / ${diag.kanaTotal}`} />
        {diag.kanaMissing.length > 0 ? (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", color: C.shu, fontSize: 13, fontWeight: 600, marginTop: 6 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            Missing KanjiVG stroke data: {diag.kanaMissing.join("  ")}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 6 }}>
            ✓ Every kana has stroke data.
          </div>
        )}
      </Section>

      {UNITS.map((unit) => {
        const lessons = unit.lessons.filter((l) => l.items);
        return (
          <Section key={unit.id} title={`${unit.title} · ${unit.id} · ${lessons.length} lesson${lessons.length === 1 ? "" : "s"}`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lessons.map((lesson) => (
                <div key={lesson.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{lesson.title}</span>
                    <span style={{ fontSize: 12, color: C.inkSoft, fontFamily: F.mono }}>
                      {lesson.cefr} · {lesson.items.length} items
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PREVIEW_STATES.map((state) => (
                      <button
                        key={state}
                        onClick={() => navigate(sandboxRoute(lesson.id, state))}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "8px 12px",
                          borderRadius: 10,
                          border: `1.5px solid ${state === "fresh" ? C.ai : C.line}`,
                          background: state === "fresh" ? C.aiSoft : C.surface,
                          color: state === "fresh" ? C.aiDeep : C.inkSoft,
                          fontSize: 13,
                          fontWeight: 700,
                          fontFamily: F.body,
                          cursor: "pointer",
                        }}
                      >
                        <Play size={13} /> {PREVIEW_LABEL[state]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      })}

      <Section title="Danger zone">
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 12, border: `1.5px solid ${C.shu}`, background: C.surface, color: C.shu, fontSize: 15, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
          >
            <RotateCcw size={18} />
            Reset my real progress
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", color: C.shu, fontSize: 13, fontWeight: 600 }}>
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              This wipes your real progress (every item, streak, freezes, XP) back to a fresh
              start. Dev Mode stays unlocked. It can't be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirming(false)}
                style={{ flex: 1, padding: 14, borderRadius: 12, border: `1.5px solid ${C.line}`, background: C.surface, color: C.inkSoft, fontSize: 15, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={doReset}
                style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: C.shu, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
              >
                Reset everything
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
