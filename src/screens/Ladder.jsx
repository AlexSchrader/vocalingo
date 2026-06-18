import { Lock } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { LANGUAGES } from "../data/index.js";
import { C, F } from "../theme.js";

// A1 progress is a placeholder until gate math lands with the curriculum brief.
// TODO: compute real A1 % from mastered items / CEFR coverage.
function a1Percent(langProgress) {
  // Stub: scale off accumulated XP so the bar shows life. Caps at 100.
  return Math.min(100, Math.round((langProgress.xp ?? 0) / 5));
}

function unlockText(lang) {
  if (!lang.unlock) return "";
  const src = LANGUAGES.find((l) => l.id === lang.unlock.lang);
  return `Unlocks at ${src?.name ?? lang.unlock.lang} ${lang.unlock.level}`;
}

export default function Ladder() {
  const languages = useStore((s) => s.languages);
  const stations = LANGUAGES.map((l) => languages[l.id] ?? { ...l, level: "pre-A1", xp: 0 });

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontFamily: F.disp, fontSize: 22, fontWeight: 700 }}>Ladder</div>
        <div style={{ fontSize: 13, color: C.inkSoft }}>Climb one language, then the next unlocks.</div>
      </div>

      {stations.map((lang) => {
        const locked = !lang.unlocked;
        const pct = a1Percent(lang);
        return (
          <div
            key={lang.id}
            style={{
              padding: 16,
              borderRadius: 18,
              background: locked ? C.lockedBg : C.surface,
              border: `1px solid ${locked ? C.lockedBg : C.line}`,
              opacity: locked ? 0.75 : 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 34 }}>{lang.flag}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: F.disp, fontSize: 18, fontWeight: 700 }}>{lang.name}</span>
                  {locked && <Lock size={15} color={C.locked} />}
                </div>
                <div style={{ fontSize: 12, color: C.inkSoft }}>
                  {locked ? unlockText(lang) : `${lang.level} → ${lang.target} goal`}
                </div>
              </div>
            </div>

            {!locked && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.inkSoft, marginBottom: 6 }}>
                  <span>Progress to A1</span>
                  <span style={{ fontWeight: 700, color: C.ai }}>{pct}%</span>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: C.lockedBg, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: C.ai,
                      transition: "width 250ms ease",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
