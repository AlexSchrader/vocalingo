import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PhaseShell from "../components/PhaseShell.jsx";
import TeachCard from "../components/games/TeachCard.jsx";
import ChoiceCard from "../components/games/ChoiceCard.jsx";
import TypeCard from "../components/games/TypeCard.jsx";
import BuildCard from "../components/games/BuildCard.jsx";
import TraceCard from "../components/games/TraceCard.jsx";
import CardBreath from "../components/CardBreath.jsx";
import { useStore } from "../store/useStore.js";
import { getLesson } from "../data/index.js";
import { LIVE_CARD_KINDS } from "../data/contract.js";
import { initLearn, currentStep, answerStep } from "../store/learnQueue.js";
import { buildSandboxItems, runnerWriters } from "../store/dev.js";
import { C, F } from "../theme.js";

function assertLiveKind(kindKey) {
  if (!LIVE_CARD_KINDS.includes(kindKey)) {
    throw new Error(
      `Lesson runner routed unlisted card kind "${kindKey}". ` +
        `Add it to LIVE_CARD_KINDS in src/data/contract.js first.`
    );
  }
}

// The recall (check2) card for an item in its learning steps.
function recallMode() {
  return "meaning";
}

// Lesson-only session runner: teaches fresh items from the current lesson,
// then runs interleaved recognition + recall checks until each item graduates.
// Reviews are a separate session (/review). Separated so new and old content
// never mix — you learn a full row of kana, then its vocab; no old material
// interrupts first exposure.
export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sandbox (Dev Mode) run: read from a throwaway in-memory items map and route
  // every store writer to a no-op, so launching a lesson from the dev panel never
  // touches real FSRS/mastery/streak/persistence. Isolation is explicit here.
  const sandbox = searchParams.get("sandbox") === "1";
  const home = sandbox ? "/dev" : "/";

  const storeItems = useStore((s) => s.items);
  const sandboxItems = useMemo(
    () => (sandbox ? buildSandboxItems(lessonId, searchParams.get("state") ?? "fresh") : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sandbox, lessonId]
  );
  const items = sandbox ? sandboxItems : storeItems;

  const realWriters = {
    graduateItem: useStore((s) => s.graduateItem),
    completeLesson: useStore((s) => s.completeLesson),
    rollDailyGoal: useStore((s) => s.rollDailyGoal),
  };
  const { graduateItem, completeLesson, rollDailyGoal } = runnerWriters(sandbox, realWriters);

  const lesson = useMemo(() => getLesson(lessonId), [lessonId]);

  // Authored order is preserved: kana rows come before vocab in each lesson file,
  // so buildLearnQueue (teaches-first) guarantees kana are introduced before vocab.
  const freshIds = useMemo(() => {
    const lessonItems = (lesson?.items ?? []).map((def) => items[def.id]).filter(Boolean);
    return lessonItems.filter((it) => (it.rung ?? 0) < 1).map((it) => it.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const [learn, setLearn] = useState(() => initLearn(freshIds));
  const [finished, setFinished] = useState(false);

  const learnStep = currentStep(learn);
  const done = learnStep === null;

  useEffect(() => {
    if (lesson && done && !finished) {
      completeLesson(lessonId);
      rollDailyGoal();
      setFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, lesson]);

  if (!lesson) {
    return (
      <PhaseShell title="Lesson" progress={0} onClose={() => navigate(home)}>
        <div style={{ margin: "auto", color: C.inkSoft }}>Lesson not found.</div>
      </PhaseShell>
    );
  }

  const total = learn.queue.length;
  const progress = total === 0 ? 1 : Math.min(learn.pos, total) / total;

  if (finished || done) {
    const learned = freshIds.length;
    return (
      <PhaseShell title={lesson.title} progress={1}>
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 56 }}>🎉</div>
          <div style={{ fontFamily: F.disp, fontSize: 24, fontWeight: 700 }}>Lesson complete</div>
          <div style={{ color: C.inkSoft, maxWidth: 300 }}>
            {learned > 0
              ? `Nice — you learned ${learned} new item${learned === 1 ? "" : "s"}. They'll come back for review in a few days.`
              : "Nothing new in this lesson right now."}
          </div>
          <button
            data-testid="back-to-today"
            onClick={() => navigate(home)}
            style={{
              marginTop: 8,
              padding: "14px 28px",
              borderRadius: 14,
              border: "none",
              background: C.ai,
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: F.body,
              cursor: "pointer",
            }}
          >
            {sandbox ? "Back to Dev panel" : "Back to Today"}
          </button>
        </div>
      </PhaseShell>
    );
  }

  // --- handlers ---
  const advanceTeach = () => setLearn((st) => answerStep(st, null).state);
  const onCheck = (grade) => {
    const result = { pass: grade !== "again", clean: grade === "good" || grade === "easy" };
    const { state, graduated } = answerStep(learn, result);
    // setLearn BEFORE graduateItem: graduateItem triggers a Zustand useSyncExternalStore
    // notification that forces a synchronous React re-render. Queuing the learn-state
    // update first ensures React picks up pos+1 in that sync render instead of pos.
    setLearn(state);
    if (graduated) graduateItem(graduated.id, graduated.grade);
  };

  // --- current card ---
  const item = items[learnStep.id];
  const k = `l${learn.pos}`;
  let label;
  let card;
  if (learnStep.step === "teach") {
    assertLiveKind("teach");
    label = "Learn";
    card = <TeachCard item={item} onAdvance={advanceTeach} />;
  } else if (learnStep.step === "check1") {
    assertLiveKind("choice");
    label = "Practice";
    card = <ChoiceCard item={item} allItems={items} onGraded={onCheck} />;
  } else if (item.type === "kana") {
    assertLiveKind("trace");
    label = "Practice";
    card = <TraceCard item={item} mode="guided" onGraded={onCheck} />;
  } else {
    const mode = recallMode(item);
    assertLiveKind(`type:${mode}`);
    label = "Practice";
    card = <TypeCard item={item} mode={mode} onGraded={onCheck} />;
  }

  return (
    <PhaseShell
      title={`${sandbox ? "🧪 Dev · " : ""}${label} · ${Math.min(learn.pos + 1, total)}/${total}`}
      progress={progress}
      onClose={() => navigate(home)}
    >
      {/* Keyed remount per card drives the entrance "breath" (fade + brief
          input guard) so carried taps don't bleed into the next card. */}
      <CardBreath key={k}>{card}</CardBreath>
    </PhaseShell>
  );
}
