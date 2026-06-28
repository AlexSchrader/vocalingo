import { Lock, Check } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { LANGUAGES, UNITS } from "../data/index.js";
import { roadmapFor } from "../data/ja/roadmap.js";
import { masteryPct, isMastered } from "../store/mastery.js";
import { C, F } from "../theme.js";

// Stage sectioning for the Units list. `stage` lives on each unit (and roadmap
// entry); these drive the section headers in climb order. The JLPT tag is shown
// only for the Japanese track — Latin-alphabet languages get plain CEFR labels
// and simply render no Pre-A1 group (they have no pre-a1 units).
const STAGE_ORDER = ["pre-a1", "a1", "a2", "b1", "b2"];
const STAGE_LABEL = { "pre-a1": "Pre-A1", a1: "A1", a2: "A2", b1: "B1", b2: "B2" };
const JLPT_BY_STAGE = { ja: { a1: "N5", a2: "N4", b1: "N3", b2: "N2" } };

function stageHeading(langId, stage) {
  const label = STAGE_LABEL[stage] ?? stage;
  const jlpt = JLPT_BY_STAGE[langId]?.[stage];
  return jlpt ? `${label} · ${jlpt}` : label;
}

// Authored item defs for a language, in lesson order (gojūon for kana).
function defsFor(langId, predicate = () => true) {
  return UNITS.filter((u) => u.lang === langId)
    .flatMap((u) => u.lessons.filter((l) => Array.isArray(l.items)).flatMap((l) => l.items))
    .filter(predicate);
}

// Progress within a CEFR stage: fraction of that stage's unit items at rung ≥ 1.
// Stages are unit-level (`u.stage`), so a stage spans whole units (the kana
// foundation is "pre-a1"; the first thematic vocab units are "a1"). Returns
// totals so the spine can show "you're here / done / coming" honestly.
function stageStats(langId, stage, items) {
  const defs = UNITS.filter((u) => u.lang === langId && (u.stage ?? "a1") === stage)
    .flatMap((u) => u.lessons.filter((l) => Array.isArray(l.items)).flatMap((l) => l.items));
  const total = defs.length;
  const done = defs.filter((def) => (items[def.id]?.rung ?? 0) >= 1).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0, complete: total > 0 && done === total };
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
  // The spine is the CEFR stages up to the goal, INCLUDING Pre-A1 — the kana
  // foundation is a real stage you climb before A1, not A1 itself. Stages are
  // unit-level, so "you're here" is derived from actual progress (the first
  // stage that isn't fully complete), not a stored level that never advances.
  const targetStageIdx = Math.max(0, STAGE_ORDER.indexOf((lang.target ?? "B2").toLowerCase()));
  const stages = STAGE_ORDER.slice(0, targetStageIdx + 1);
  const statsByStage = Object.fromEntries(stages.map((s) => [s, stageStats(lang.id, s, items)]));
  // Current stage = first one not yet complete (or the goal, if all are done).
  const currentStage = stages.find((s) => !statsByStage[s].complete) ?? stages[stages.length - 1];
  const cur = statsByStage[currentStage];

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
      </div>

      {/* CEFR rungs (goal at top) on the left; Lingua stands big on the right.
          The mascot is ADAPTIVE: clamp() scales it with viewport width (no fixed
          px), and the rung block centers vertically so it stays tidy. The
          current-level progress bar lives full-width BELOW, under the mascot. */}
      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "stretch" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {[...stages].reverse().map((stage, i, arr) => (
            <CefrRung
              key={stage}
              level={STAGE_LABEL[stage] ?? stage}
              done={statsByStage[stage].complete}
              current={stage === currentStage}
              first={i === 0}
              last={i === arr.length - 1}
            />
          ))}
        </div>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-end" }}>
          <img
            src="/mascot/lingua-proud.png"
            alt=""
            aria-hidden
            style={{ width: "clamp(120px, 30vw, 220px)", height: "auto", objectFit: "contain", objectPosition: "bottom" }}
          />
        </div>
      </div>

      {/* Current-stage progress — full width, below the mascot. */}
      {cur.total > 0 ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: C.ink }}>{stageHeading(lang.id, currentStage)} progress</span>
            <span style={{ fontWeight: 700, color: C.ai }}>{cur.pct}%</span>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: C.lockedBg, overflow: "hidden" }}>
            <div style={{ width: `${cur.pct}%`, height: "100%", background: C.ai, transition: "width 250ms ease" }} />
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 12, fontSize: 12, color: C.inkSoft }}>Lessons for {STAGE_LABEL[currentStage] ?? currentStage} coming soon.</div>
      )}
    </div>
  );
}

function CefrRung({ level, done, current, first, last }) {
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
      <div style={{ flex: 1, padding: "8px 0", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: current ? 700 : 600, fontSize: 15, color: current || done ? C.ink : C.inkSoft }}>
          {level}
          {current && <span style={{ fontSize: 11, fontWeight: 600, color: C.ai, marginLeft: 8 }}>you're here</span>}
        </span>
        {done && <span style={{ fontSize: 11, fontWeight: 700, color: C.matcha }}>Done</span>}
      </div>
    </div>
  );
}

// --- Writing-system section -------------------------------------------------

// Classify a kana by script + voicing, content-agnostically. NFD decomposition
// exposes a combining dakuten (゛U+3099) or handakuten (゜U+309A) on voiced kana
// (が = か + ゛), so base vs voiced is detected, never hardcoded — and katakana
// vs hiragana is just the codepoint block. New rows (katakana dakuten, combos)
// slot into the right group automatically as they ship.
function kanaGroupOf(char) {
  const voiced = /[゙゚]/.test(char.normalize("NFD"));
  const cp = char.codePointAt(0);
  const katakana = cp >= 0x30a0 && cp <= 0x30ff;
  if (katakana) return voiced ? "kata-voiced" : "kata";
  return voiced ? "hira-voiced" : "hira";
}

// The voiced rows carry their real names: the ゛dashes are "dakuten" (が/ざ/だ/ば),
// the ゜circle is "handakuten" (ぱ). Showing the terms teaches them, instead of
// the bare marks reading as just "lines and a circle".
const KANA_GROUPS = [
  { key: "hira", label: "Hiragana" },
  { key: "hira-voiced", label: "Hiragana dakuten/handakuten" },
  { key: "kata", label: "Katakana" },
  { key: "kata-voiced", label: "Katakana dakuten/handakuten" },
];

function KanaSection({ langId, items }) {
  const kanaDefs = defsFor(langId, (d) => d.type === "kana");
  if (kanaDefs.length === 0) return null;
  const groups = KANA_GROUPS
    .map((g) => ({ ...g, defs: kanaDefs.filter((d) => kanaGroupOf(d.front) === g.key) }))
    .filter((g) => g.defs.length > 0);

  return (
    <Section title="Writing system">
      <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 14 }}>
        The bar under each character fills as you review it over time.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {groups.map((g) => {
          const learned = g.defs.filter((d) => (items[d.id]?.rung ?? 0) >= 1).length;
          const mastered = g.defs.filter((d) => isMastered(items[d.id])).length;
          return (
            <div key={g.key} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: C.ai, textTransform: "uppercase" }}>
                  {g.label}
                </span>
                <div style={{ flex: 1, height: 1, background: C.line }} />
                <span style={{ fontSize: 11, color: C.inkSoft, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {learned}/{g.defs.length} learned{mastered > 0 ? ` · ${mastered} mastered` : ""}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {g.defs.map((d) => (
                  <KanaChip key={d.id} char={d.front} item={items[d.id]} />
                ))}
              </div>
            </div>
          );
        })}
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

  // Per-unit progress; "current" = first unit not fully done (computed across the
  // whole track, independent of sectioning).
  let currentMarked = false;
  const unitRows = units.map((u) => {
    const defs = u.lessons.filter((l) => Array.isArray(l.items)).flatMap((l) => l.items);
    const done = defs.filter((d) => (items[d.id]?.rung ?? 0) >= 1).length;
    const total = defs.length;
    const isDone = total > 0 && done === total;
    let status = "coming";
    if (isDone) status = "done";
    else if (!currentMarked) { status = "current"; currentMarked = true; }
    return { kind: "unit", stage: u.stage ?? "a1", id: u.id, title: u.title, done, total, status };
  });
  const roadmapRows = roadmap.map((r, i) => ({
    kind: "coming", stage: r.stage ?? "a1", id: `rm${i}`, title: r.title, theme: r.theme,
  }));

  // Render one group per stage that actually has rows, in climb order. A global
  // counter keeps the numbering continuous top-to-bottom across sections.
  const stagesPresent = STAGE_ORDER.filter(
    (s) => unitRows.some((r) => r.stage === s) || roadmapRows.some((r) => r.stage === s)
  );
  let n = 0;

  return (
    <Section title="Units">
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {stagesPresent.map((stage) => {
          const rows = [
            ...unitRows.filter((r) => r.stage === stage),
            ...roadmapRows.filter((r) => r.stage === stage),
          ];
          return (
            <div key={stage} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <StageHeader label={stageHeading(langId, stage)} />
              {rows.map((r) => {
                n += 1;
                return r.kind === "unit" ? (
                  <UnitRow key={r.id} n={n} title={r.title} done={r.done} total={r.total} status={r.status} />
                ) : (
                  <ComingRow key={r.id} n={n} title={r.title} theme={r.theme} />
                );
              })}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function StageHeader({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: C.ai, textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: C.line }} />
    </div>
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
