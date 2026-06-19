import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedItems, getLesson, LANGUAGES } from "../data/index.js";
import { newCard, schedule, isDue, startOfTomorrow } from "./srs.js";
import { nextRung, isReviewable } from "./mastery.js";
import { migrateState, PERSIST_VERSION } from "./migrate.js";

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
      ui: {},

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

      // Mark the day's lesson done and graduate freshly-introduced items: rung 0
      // items in the lesson climb to RECOGNIZED (rung 1) and become due tomorrow.
      completeLesson: (lessonId) => {
        set((s) => {
          const lesson = getLesson(lessonId);
          const items = { ...s.items };
          const dueTomorrow = startOfTomorrow();
          if (lesson?.items) {
            for (const def of lesson.items) {
              const it = items[def.id];
              if (it && (it.rung ?? 0) < 1) {
                // Keep the fresh FSRS card (State.New) but defer its first
                // review to tomorrow; its first real grade happens then.
                items[def.id] = {
                  ...it,
                  rung: 1,
                  srs: { ...it.srs, due: dueTomorrow },
                };
              }
            }
          }
          return { items, daily: { ...s.daily, date: todayISO(), lessonDone: true } };
        });
      },

      // Daily goal is met when both halves of the loop are done. On the first
      // time it's met today, run streak logic and stamp lastActive.
      rollDailyGoal: () => {
        const { daily } = get();
        const met = daily.reviewsCleared && daily.lessonDone;
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

      // Cascade: unlock the next language once its prerequisite level is met.
      // Level computation is stubbed for this brief.
      checkCascade: () => {
        set((s) => {
          const ja = s.languages.ja;
          // TODO: A1 gate math lands with the curriculum brief. Until then the
          // Japanese level is "pre-A1" and nothing cascades.
          if (ja && ja.level === "A1" && !s.languages.es.unlocked) {
            return { languages: { ...s.languages, es: { ...s.languages.es, unlocked: true } } };
          }
          return s;
        });
      },

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
    }),
    {
      name: "vocalingo-v1",
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
        // ui is transient; not persisted.
      }),
    }
  )
);
