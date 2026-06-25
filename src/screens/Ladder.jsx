import { Lock, Check } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { LANGUAGES, UNITS } from "../data/index.js";
import { roadmapFor } from "../data/ja/roadmap.js";
import { masteryPct, isMastered } from "../store/mastery.js";
import { C, F } from "../theme.js";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2"];
const CEFR_IDX = { "pre-A1": 0, A1: 1, A2: 2, B1: 3, B2: 4 };

// Authored item defs for a language, in lesson order (gojūon for kana).
function defsFor(langId, predicate = () => true) {
  return UNITS.filter((u) => u.lang === langId)
    .flatMap((u) => u.lessons.filter((l) => Array.isArray(l.items)).flatMap((l) => l.items))
    .filter(predicate);
}

// Real A1 progress: fraction of A1-lesson items at rung ≥ 1.
function a1PercentFor(langId, items) {
  const defs = UNITS.filter((u) => u.lang === langId)
    .flatMap((u) => u.lessons.filter((l) => l.cefr === "A1" && Array.isArray(l.items)))
    .flatMap((l) => l.items);
  if (defs.length === 0) return 0;
  const done = defs.filter((def) => (items[def.id]?.rung ?? 0) >= 1).length;
  return Math.round((done / defs.length) * 100);
}

function unlockText(lang) {
  if (!lang.unlock) return "";
  const src = LANGUAGES.find((l) => l.id === lang.unlock.lang);
  return `Unlocks at ${src?.name ?? lang.unlock.lang} ${lang.unlock.level}`;
}

export default function Ladder() {
  const languages = useStore((s) => s.languages);
  const items = useStore((s) => s.items);

  const stations = LANGUAGES.map((l) => languages[l.id] ?? { ...l, level: "pre-A1", xp: 0 });
  // Active language = the first unlocked one still being climbed (Japanese today).
  const active = stations.find((l) => l.unlocked) ?? stations[0];
  const others = stations.filter((l) => l.id !== active.id);

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontFamily: F.disp, fontSize: 22, fontWeight: 700 }}>Ladder</div>
        <div style={{ fontSize: 13, color: C.inkSoft }}>Your whole climb — what's done, what's next.</div>
      </div>

      <ActiveLanguage lang={active} items={items} />
      <KanaSection langId={active.id} items={items} />
      <UnitsSection langId={active.id} items={items} />

      {others.length > 0 && (
        <Section title="Next languages">
          <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 10 }}>
            One at a time — each unlocks when its predecessor reaches A1.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {others.map((l) => (
              <LangRow key={l.id} lang={l} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// --- Active language: CEFR ladder (the spine) -------------------------------

function ActiveLanguage({ lang, items }) {
  const targetIdx = CEFR_IDX[lang.target] ?? 1;
  const levelIdx = CEFR_IDX[lang.level] ?? 0;
  const rungs = CEFR_LEVELS.filter((r) => CEFR_IDX[r] <= targetIdx);
  // Current rung = first not-yet-completed level.
  const currentRung = rungs.find((r) => CEFR_IDX[r] > levelIdx) ?? lang.target;

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 34 }}>{lang.flag}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.disp, fontSize: 18, fontWeight: 700 }}>{lang.name}</div>
          <div style={{ fontSize: 12, color: C.inkSoft }}>
            {lang.level === "pre-A1" ? "Starting out" : lang.level} → {lang.target} goal
          </div>
        </div>
        <img
          src="/lingua-proud.png"
          alt=""
          aria-hidden
          style={{ width: 56, height: 56, objectFit: "contain", marginTop: -6, marginBottom: -6 }}
        />
      </div>

      {/* CEFR rungs, goal at the top — the literal ladder. */}
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
        {[...rungs].reverse().map((rung, i, arr) => {
          const done = CEFR_IDX[rung] <= levelIdx;
          const current = rung === currentRung;
          const pct = current && rung === "A1" ? a1PercentFor(lang.id, items) : null;
          return (
            <CefrRung
              key={rung}
              level={rung}
              done={done}
              current={current}
              pct={pct}
              first={i === 0}
              last={i === arr.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}

function CefrRung({ level, done, current, pct, first, last }) {
  const color = done ? C.matcha : current ? C.ai : C.locked;
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {/* rail + node */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 22 }}>
        <div style={{ width: 2, flex: 1, background: first ? "transparent" : C.line }} />
        <div
          style={{
            width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
            background: done ? C.matcha : current ? C.ai : C.lockedBg,
            border: `2px solid ${color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {done && <Check size={9} color="#fff" />}
        </div>
        <div style={{ width: 2, flex: 1, background: last ? "transparent" : C.line }} />
      </div>
      {/* label + state */}
      <div style={{ flex: 1, padding: "8px 0", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: current ? 700 : 600, fontSize: 15, color: current || done ? C.ink : C.inkSoft }}>
            {level}
            {current && <span style={{ fontSize: 11, fontWeight: 600, color: C.ai, marginLeft: 8 }}>you're here</span>}
          </span>
          {done && <span style={{ fontSize: 11, fontWeight: 700, color: C.matcha }}>Done</span>}
          {current && pct != null && <span style={{ fontSize: 12, fontWeight: 700, color: C.ai }}>{pct}%</span>}
        </div>
        {current && pct != null && (
          <div style={{ height: 6, borderRadius: 999, background: C.lockedBg, overflow: "hidden", marginTop: 5 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: C.ai, transition: "width 250ms ease" }} />
          </div>
        )}
        {current && pct == null && (
          <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 3 }}>Lessons coming soon</div>
        )}
      </div>
    </div>
  );
}

// --- Kana section -----------------------------------------------------------

function KanaSection({ langId, items }) {
  const kanaDefs = defsFor(langId, (d) => d.type === "kana");
  if (kanaDefs.length === 0) return null;
  const learned = kanaDefs.filter((d) => (items[d.id]?.rung ?? 0) >= 1).length;
  const mastered = kanaDefs.filter((d) => isMastered(items[d.id])).length;

  return (
    <Section title={`Hiragana — ${learned}/${kanaDefs.length} learned`}>
      <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 12 }}>
        {mastered} mastered · the bar under each character fills as you review it over time.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {kanaDefs.map((d) => (
          <KanaChip key={d.id} char={d.front} item={items[d.id]} />
        ))}
      </div>
    </Section>
  );
}

function KanaChip({ char, item }) {
  const learned = (item?.rung ?? 0) >= 1;
  const pct = masteryPct(item);
  const mastered = isMastered(item);
  const accent = mastered ? C.matcha : C.ai;
  return (
    <div
      style={{
        width: 44,
        borderRadius: 10,
        border: `1px solid ${learned ? accent : C.line}`,
        background: learned ? C.surface : C.lockedBg,
        opacity: learned ? 1 : 0.5,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.jp,
          fontSize: 22,
          fontWeight: 500,
          color: learned ? C.ink : C.locked,
        }}
      >
        {char}
      </div>
      {/* Mastery bar — only once the character has been introduced (rung ≥ 1).
          Un-introduced kana show just the muted glyph, no bar. */}
      {learned && (
        <div style={{ height: 4, background: C.lockedBg }}>
          <div style={{ width: `${Math.max(6, pct * 100)}%`, height: "100%", background: accent, transition: "width 250ms ease" }} />
        </div>
      )}
    </div>
  );
}

// --- Units section ----------------------------------------------------------

function UnitsSection({ langId, items }) {
  const units = UNITS.filter((u) => u.lang === langId).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const roadmap = roadmapFor(langId);

  // Per-unit progress; "current" = first unit not fully done.
  let currentMarked = false;
  const rows = units.map((u) => {
    const defs = u.lessons.filter((l) => Array.isArray(l.items)).flatMap((l) => l.items);
    const done = defs.filter((d) => (items[d.id]?.rung ?? 0) >= 1).length;
    const total = defs.length;
    const isDone = total > 0 && done === total;
    let status = "coming";
    if (isDone) status = "done";
    else if (!currentMarked) { status = "current"; currentMarked = true; }
    return { unit: u, done, total, status };
  });

  return (
    <Section title="Units">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map(({ unit, done, total, status }, i) => (
          <UnitRow key={unit.id} n={i + 1} title={unit.title} done={done} total={total} status={status} />
        ))}
        {roadmap.map((r, i) => (
          <ComingRow key={`rm${i}`} n={units.length + i + 1} title={r.title} theme={r.theme} />
        ))}
      </div>
    </Section>
  );
}

function UnitRow({ n, title, done, total, status }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const badge = status === "done"
    ? { text: "Done", color: C.matcha }
    : status === "current"
    ? { text: "Current", color: C.ai }
    : { text: "Coming", color: C.locked };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: C.surface, border: `1px solid ${C.line}` }}>
      <Num n={n} color={badge.color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: F.jp, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: badge.color, flexShrink: 0 }}>{badge.text}</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: C.lockedBg, overflow: "hidden", marginTop: 6 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: status === "done" ? C.matcha : C.ai, transition: "width 250ms ease" }} />
        </div>
        <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 4 }}>{done}/{total} items</div>
      </div>
    </div>
  );
}

function ComingRow({ n, title, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: C.lockedBg, border: `1px dashed ${C.line}`, opacity: 0.8 }}>
      <Num n={n} color={C.locked} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: F.jp, fontWeight: 700, fontSize: 15, color: C.inkSoft }}>{title}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.locked, flexShrink: 0 }}>Coming soon</span>
        </div>
        <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 4 }}>{theme}</div>
      </div>
    </div>
  );
}

function Num({ n, color }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: C.washi, border: `1px solid ${color}`, color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
      {n}
    </div>
  );
}

// --- Other languages --------------------------------------------------------

function LangRow({ lang }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: C.lockedBg, border: `1px solid ${C.lockedBg}`, opacity: 0.8 }}>
      <div style={{ fontSize: 26 }}>{lang.flag}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: F.disp, fontSize: 15, fontWeight: 700, color: C.inkSoft }}>{lang.name}</span>
          <Lock size={13} color={C.locked} />
        </div>
        <div style={{ fontSize: 12, color: C.inkSoft }}>{unlockText(lang)} · {lang.target} goal</div>
      </div>
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
