import { Flame, Snowflake, Trophy } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { LANGUAGES } from "../data/index.js";
import { RUNGS } from "../store/mastery.js";
import { C, F } from "../theme.js";

export default function Stats() {
  const streak = useStore((s) => s.streak);
  const stats = useStore((s) => s.stats);
  const languages = useStore((s) => s.languages);
  const items = useStore((s) => s.items);

  const itemList = Object.values(items);
  const rungCounts = RUNGS.map((_, r) => itemList.filter((it) => (it.rung ?? 0) === r).length);
  const learned = itemList.filter((it) => (it.rung ?? 0) >= 1).length;

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontFamily: F.disp, fontSize: 22, fontWeight: 700 }}>Stats</div>
        <div style={{ fontSize: 13, color: C.inkSoft }}>Your climb so far.</div>
      </div>

      {/* Streak + freezes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Metric icon={Flame} color={C.shu} value={streak.current} label="Streak" />
        <Metric icon={Trophy} color={C.matcha} value={streak.longest} label="Longest" />
        <Metric icon={Snowflake} color={C.ai} value={streak.freezes} label="Freezes" />
      </div>

      {/* Per-language bars */}
      <Section title="Languages">
        {LANGUAGES.map((l) => {
          const lang = languages[l.id] ?? { ...l, level: "pre-A1", xp: 0 };
          const pct = Math.min(100, Math.round((lang.xp ?? 0) / 5));
          return (
            <div key={l.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span>
                  {lang.flag} {lang.name} {!lang.unlocked && "🔒"}
                </span>
                <span style={{ color: C.inkSoft }}>{lang.level}</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: C.lockedBg, overflow: "hidden" }}>
                <div style={{ width: `${lang.unlocked ? pct : 0}%`, height: "100%", background: C.ai }} />
              </div>
            </div>
          );
        })}
      </Section>

      {/* Metric grid */}
      <Section title="Mastery">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Tile value={stats.xpTotal} label="Total XP" />
          <Tile value={itemList.length} label="Items" />
          <Tile value={learned} label="Learned" />
          <Tile value={rungCounts[5]} label="Mastered" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {RUNGS.map((name, r) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{ width: 90, color: C.inkSoft }}>{name}</span>
              <div style={{ flex: 1, height: 6, background: C.lockedBg, borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    width: itemList.length ? `${(rungCounts[r] / itemList.length) * 100}%` : 0,
                    height: "100%",
                    background: r === 5 ? C.matcha : C.ai,
                  }}
                />
              </div>
              <span style={{ width: 20, textAlign: "right", fontWeight: 700 }}>{rungCounts[r]}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Metric({ icon: Icon, color, value, label }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: 14, textAlign: "center" }}>
      <Icon size={20} color={color} />
      <div style={{ fontFamily: F.disp, fontSize: 22, fontWeight: 700, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.inkSoft, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function Tile({ value, label }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 10px" }}>
      <div style={{ fontFamily: F.disp, fontSize: 20, fontWeight: 700, color: C.ai }}>{value}</div>
      <div style={{ fontSize: 11, color: C.inkSoft, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}
