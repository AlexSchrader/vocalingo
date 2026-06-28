import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedItems, LANGUAGES, UNITS } from "../data/index.js";
import { newCard, schedule, isDue } from "./srs.js";
import { nextRung, isReviewable } from "./mastery.js";
import { migrateState, PERSIST_VERSION } from "./migrate.js";
import { matchesDevCode } from "./dev.js";

// Seed every item with a fresh FSRS card attached as its srs. Card attachment
// lives here (not in the data loader) per Brief 2.
function freshSeed() {
  const seed = seedItems();
  const out = {};
  for (const [id, it] of Object.entries(seed)) out[id] = { ...it, srs: newCard() };
  return out;
}

// ISO date string (YYYY-MM-DD) in local time, used for streak/daily bookkeeping.
function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function yesterdayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const XP_BY_GRADE = { again: 2, hard: 5, good: 10, easy: 15 };

const CEFR_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3 };

// Lazy cache: itemId → { cefr, lang } — built once from UNITS on first access.
let _itemMeta = null;
function itemMetaMap() {
  if (_itemMeta) return _itemMeta;
  _itemMeta = {};
  for (const unit of UNITS)
    for (const lesson of unit.lessons)
      if (lesson.cefr && lesson.items)
        for (const def of lesson.items)
          _itemMeta[def.id] = { cefr: lesson.cefr, lang: unit.lang };
  return _itemMeta;
}

// True when every item at CEFR ≤ targetLevel for langId is at rung ≥ 1.
function isLevelComplete(langId, targetLevel, items) {
  const maxIdx = CEFR_ORDER[targetLevel] ?? 0;
  const defs = UNITS.filter((u) => u.lang === langId)
    .flatMap((u) => u.lessons.filter((l) => l.items && (CEFR_ORDER[l.cefr] ?? 0) <= maxIdx))
    .flatMap((l) => l.items);
  if (defs.length === 0) return false;
  return defs.every((def) => (items[def.id]?.rung ?? 0) >= 1);
}

// Default language progress state, derived from the static LANGUAGES table.
function initialLanguages() {
  const out = {};
  for (const lang of LANGUAGES) {
    out[lang.id] = { ...lang, level: "pre-A1", xp: 0 };
  }
  return out;
}

export const useStore = create(
  persist(
    (set, get) => ({
      items: {},
      languages: initialLanguages(),
      streak: { current: 0, longest: 0, freezes: 2, lastActive: null },
      stats: { xpTotal: 0 },
      daily: { date: null, reviewsCleared: false, lessonDone: false },
      devMode: false,
      // User preferences. `sfx` = synthesized answer chimes/clicks; `autoplayAudio`
      // = auto-play the pronunciation clip when a Teach card appears (the speaker
      // button always plays regardless). Both default on; persisted. Old persisted
      // state without this key keeps these defaults via persist's shallow merge.
      settings: { sfx: true, autoplayAudio: true },
      ui: {},

      setSetting: (key, value) =>
        set((s) => ({ settings: { ...s.settings, [key]: value } })),

      // Merge seed items in on first run; no-op once items exist. Also rolls the
      // daily bookkeeping over if the calendar day has changed.
      seedOnce: () => {
        set((s) => {
          const items = Object.keys(s.items).length ? s.items : freshSeed();
          let daily = s.daily;
          if (daily.date !== todayISO()) {
            daily = { date: todayISO(), reviewsCleared: false, lessonDone: false };
          }
          // Backfill any language progress entries added since last persist.
          const languages = { ...initialLanguages(), ...s.languages };
          return { items, daily, languages };
        });
      },

      // Selector: items whose FSRS card is due AND that have climbed at least to
      // RECOGNIZED. Fresh items (rung 0) are not "due" — they enter via a lesson.
      dueItems: () => {
        return Object.values(get().items).filter(
          (it) => isReviewable(it) && it.srs && isDue(it.srs)
        );
      },

      // Derived: reviews are locked (blocking a new lesson) while there is
      // review debt that hasn't been cleared today.
      reviewsLocked: () => {
        const { daily } = get();
        return get().dueItems().length > 0 && !daily.reviewsCleared;
      },

      // Grade a single item: reschedule via SRS, advance/hold/drop its rung,
      // and award XP. Persisted.
      gradeItem: (id, grade) => {
        set((s) => {
          const item = s.items[id];
          if (!item) return s;
          const srs = schedule(item.srs, grade);
          const rung = nextRung(item, grade);
          const gain = XP_BY_GRADE[grade] ?? 0;

          const items = { ...s.items, [id]: { ...item, srs, rung } };
          const stats = { ...s.stats, xpTotal: s.stats.xpTotal + gain };
          const lang = s.languages[item.lang];
          const languages = lang
            ? { ...s.languages, [item.lang]: { ...lang, xp: lang.xp + gain } }
            : s.languages;
          return { items, stats, languages };
        });
      },

      completeReviews: () => {
        set((s) => ({ daily: { ...s.daily, date: todayISO(), reviewsCleared: true } }));
      },

      // Graduate a freshly-learned item out of the in-session learning steps into
      // FSRS spaced review (Brief A.1). Fires exactly once per item: first real
      // FSRS schedule, rung → RECOGNIZED, XP once. `grade` reflects how the
      // learning steps went (`good` clean, `hard` if any retry).
      graduateItem: (id, grade) => {
        set((s) => {
          const item = s.items[id];
          if (!item || (item.rung ?? 0) >= 1) return s; // already graduated
          const srs = schedule(item.srs, grade);
          const gain = XP_BY_GRADE[grade] ?? 0;
          const items = { ...s.items, [id]: { ...item, srs, rung: 1 } };
          const stats = { ...s.stats, xpTotal: s.stats.xpTotal + gain };
          const lang = s.languages[item.lang];
          const languages = lang
            ? { ...s.languages, [item.lang]: { ...lang, xp: lang.xp + gain } }
            : s.languages;
          return { items, stats, languages };
        });
      },

      // Mark the day's lesson done. Graduation of new items is now per-item via
      // graduateItem (Brief A.1) — this no longer blanket-graduates anything.
      completeLesson: () => {
        set((s) => ({ daily: { ...s.daily, date: todayISO(), lessonDone: true } }));
        get().checkCascade();
      },

      // Daily goal: reviews are mandatory; lesson is optional bonus.
      // Streak triggers when reviews are cleared, OR when there are no reviews
      // due today and the lesson was done (new learner, early days).
      rollDailyGoal: () => {
        const { daily } = get();
        const nothingDue = get().dueItems().length === 0;
        const met = daily.reviewsCleared || (nothingDue && daily.lessonDone);
        if (!met) return false;
        get().bumpStreak();
        get().checkCascade();
        return true;
      },

      // Streak bookkeeping. Idempotent for a given day (no double-count).
      bumpStreak: () => {
        set((s) => {
          const today = todayISO();
          const st = s.streak;
          if (st.lastActive === today) return s; // already counted today

          let current;
          let freezes = st.freezes;
          if (st.lastActive === yesterdayISO()) {
            current = st.current + 1;
          } else if (st.lastActive == null) {
            current = 1;
          } else {
            // Missed one or more days: spend a freeze to preserve the streak,
            // otherwise it resets and today starts a fresh streak of 1.
            if (freezes > 0) {
              freezes -= 1;
              current = st.current + 1;
            } else {
              current = 1;
            }
          }
          const longest = Math.max(st.longest, current);
          return { streak: { current, longest, freezes, lastActive: today } };
        });
      },

      // Cascade: update each language's CEFR level from actual item completion,
      // then unlock any language whose prerequisite is now satisfied.
      checkCascade: () => {
        set((s) => {
          const newLangs = { ...s.languages };
          let changed = false;

          for (const langDef of LANGUAGES) {
            const st = newLangs[langDef.id];
            if (!st || st.level !== "pre-A1") continue;
            if (isLevelComplete(langDef.id, "A1", s.items)) {
              newLangs[langDef.id] = { ...st, level: "A1" };
              changed = true;
            }
          }

          for (const langDef of LANGUAGES) {
            const st = newLangs[langDef.id];
            if (!st || st.unlocked || !langDef.unlock) continue;
            const prereq = newLangs[langDef.unlock.lang];
            if (!prereq) continue;
            if ((CEFR_ORDER[prereq.level] ?? -1) >= (CEFR_ORDER[langDef.unlock.level] ?? 0)) {
              newLangs[langDef.id] = { ...st, unlocked: true };
              changed = true;
            }
          }

          return changed ? { languages: newLangs } : s;
        });
      },

      // Selector: items the learner has touched for `lang`, scoped to CEFR ≤
      // maxLevel and rung ≤ maxRung. Used by Haruki to know what the learner
      // actually knows before generating practice prompts.
      inventoryFor: ({ lang, maxLevel = "A1", maxRung = Infinity }) => {
        const maxIdx = CEFR_ORDER[maxLevel] ?? 0;
        const meta = itemMetaMap();
        return Object.values(get().items).filter((it) => {
          if (it.lang !== lang) return false;
          if ((it.rung ?? 0) > maxRung) return false;
          const m = meta[it.id];
          return m && (CEFR_ORDER[m.cefr] ?? 0) <= maxIdx;
        });
      },

      // Dev Mode unlock (Settings → code field). Convenience for solo
      // playtesting, NOT security — the code lives in the bundle. Persisted so it
      // survives reloads; `disableDevMode` turns it back off.
      unlockDevMode: (code) => {
        if (!matchesDevCode(code)) return false;
        set({ devMode: true });
        return true;
      },
      disableDevMode: () => set({ devMode: false }),

      // Dev/testing helper: wipe all persisted progress back to seed.
      resetAll: () => {
        set({
          items: freshSeed(),
          languages: initialLanguages(),
          streak: { current: 0, longest: 0, freezes: 2, lastActive: null },
          stats: { xpTotal: 0 },
          daily: { date: todayISO(), reviewsCleared: false, lessonDone: false },
          ui: {},
        });
      },

      // Dev-only playtest helper (wired behind import.meta.env.DEV in the UI):
      // make every item due now across a spread of rungs so a single session
      // shows all the active-recall card types. Kana cap at RECALLED (no awkward
      // typed-kana production); vocab spread up to PRODUCED (Build).
      devSeedReviews: () => {
        set((s) => {
          const items = { ...s.items };
          const duePast = new Date(Date.now() - 1000);
          Object.keys(items).forEach((id, i) => {
            const it = items[id];
            const maxR = it.type === "kana" ? 2 : 3;
            const rung = 1 + (i % maxR);
            items[id] = { ...it, rung, srs: { ...it.srs, due: duePast } };
          });
          return { items, daily: { ...s.daily, reviewsCleared: false } };
        });
      },
    }),
    {
      name: "lingua-v1",
      version: PERSIST_VERSION,
      // One-time, on rehydrate: replace any pre-FSRS srs with a fresh card,
      // preserving rung and all other progress (don't crash old v0.1 state).
      migrate: migrateState,
      partialize: (s) => ({
        items: s.items,
        languages: s.languages,
        streak: s.streak,
        stats: s.stats,
        daily: s.daily,
        devMode: s.devMode,
        settings: s.settings,
        // ui is transient; not persisted.
      }),
    }
  )
);
