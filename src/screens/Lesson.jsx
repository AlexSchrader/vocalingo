import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhaseShell from "../components/PhaseShell.jsx";
import TeachCard from "../components/games/TeachCard.jsx";
import ChoiceCard from "../components/games/ChoiceCard.jsx";
import TypeCard from "../components/games/TypeCard.jsx";
import BuildCard from "../components/games/BuildCard.jsx";
import TraceCard from "../components/games/TraceCard.jsx";
import { useStore } from "../store/useStore.js";
import { getLesson } from "../data/index.js";
import { LIVE_CARD_KINDS } from "../data/contract.js";
import { initLearn, currentStep, answerStep } from "../store/learnQueue.js";
import { C, F } from "../theme.js";

// Guard: the runner must only route kinds that are declared in LIVE_CARD_KINDS.
// Throws immediately (in all environments) so wiring a new card without
// registering it in contract.js fails loud rather than silently shipping.
function assertLiveKind(kindKey) {
  if (!LIVE_CARD_KINDS.includes(kindKey)) {
    throw new Error(
      `Lesson runner routed unlisted card kind "${kindKey}". ` +
        `Add it to LIVE_CARD_KINDS in src/data/contract.js first.`
    );
  }
}

// Pick the REVIEW card for a due item from its mastery rung — the ladder doing
// its job. (Learning steps for new items are handled separately below.)
//   RECOGNIZED (1) → multiple choice
//   RECALLED   (2) → type the meaning (kana: type the rōmaji)
//   PRODUCED+  (3+) → produce the Japanese (vocab: build; kana: type)
function reviewStepFor(item) {
  const rung = item.rung ?? 1;
  if (rung <= 1) return { kind: "choice" };
  if (rung === 2) return { kind: "type", mode: "meaning" };
  // Kana at rung 3+: write from memory (free trace). Vocab: build tiles.
  return item.type === "kana" ? { kind: "trace" } : { kind: "build" };
}

// The recall (check2) card for an item in its learning steps: type the meaning
// (vocab) or the rōmaji (kana). "produce" kana only appears at rung 3+ in reviews.
function recallMode() {
  return "meaning";
}

// The daily session runner (Brief A.1):
//   1. REVIEW — every due item, single-pass, app-judged (grade → FSRS + rung).
//   2. LEARN  — fresh items run teach → interleaved recognition + recall checks
//      → graduate to FSRS spaced review (graduateItem, once each).
// The session is continuous; finishing returns to Today with the floor met.
export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const items = useStore((s) => s.items);
  const dueItems = useStore((s) => s.dueItems);
  const gradeItem = useStore((s) => s.gradeItem);
  const graduateItem = useStore((s) => s.graduateItem);
  const completeReviews = useStore((s) => s.completeReviews);
  const completeLesson = useStore((s) => s.completeLesson);
  const rollDailyGoal = useStore((s) => s.rollDailyGoal);

  const lesson = useMemo(() => getLesson(lessonId), [lessonId]);

  // Snapshot both queues once on mount so grading (which mutates due/rung)
  // doesn't reshuffle the session.
  const reviewQueue = useMemo(
    () => dueItems().map((it) => ({ ...reviewStepFor(it), id: it.id })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lessonId]
  );
  const freshIds = useMemo(() => {
    const lessonItems = (lesson?.items ?? []).map((def) => items[def.id]).filter(Boolean);
    return lessonItems.filter((it) => (it.rung ?? 0) < 1).map((it) => it.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const [reviewIdx, setReviewIdx] = useState(0);
  const [learn, setLearn] = useState(() => initLearn(freshIds));
  const [reviewsDone, setReviewsDone] = useState(false);
  const [finished, setFinished] = useState(false);

  const inReview = reviewIdx < reviewQueue.length;
  const learnStep = currentStep(learn);
  const done = !inReview && learnStep === null;

  // Clear the review debt exactly once, when the review phase ends.
  useEffect(() => {
    if (!reviewsDone && !inReview) {
      completeReviews();
      setReviewsDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inReview, reviewsDone]);

  // Mark the lesson done once everything is played. Kept above the early return
  // for the Rules of Hooks.
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
      <PhaseShell title="Lesson" progress={0} onClose={() => navigate("/")}>
        <div style={{ margin: "auto", color: C.inkSoft }}>Lesson not found.</div>
      </PhaseShell>
    );
  }

  const total = reviewQueue.length + learn.queue.length;
  const current = reviewIdx + learn.pos;
  const progress = total === 0 ? 1 : Math.min(current, total) / total;

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
          <div style={{ fontFamily: F.disp, fontSize: 24, fontWeight: 700 }}>Session complete</div>
          <div style={{ color: C.inkSoft, maxWidth: 300 }}>
            {learned > 0
              ? `Nice — you practiced ${learned} new word${learned === 1 ? "" : "s"}. They'll come back for review in a few days.`
              : "Reviews cleared. Nothing new to learn right now."}
          </div>
          <button
            onClick={() => navigate("/")}
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
            Back to Today
          </button>
        </div>
      </PhaseShell>
    );
  }

  // --- handlers ---
  const onReviewGrade = (id, grade) => {
    gradeItem(id, grade);
    setReviewIdx((i) => i + 1);
  };
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
  let label;
  let body;
  if (inReview) {
    const step = reviewQueue[reviewIdx];
    const item = items[step.id];
    label = "Review";
    const onGraded = (g) => onReviewGrade(item.id, g);
    const kindKey = step.kind === "type" ? `type:${step.mode}` : step.kind;
    assertLiveKind(kindKey);
    body =
      step.kind === "choice" ? (
        <ChoiceCard key={`r${reviewIdx}`} item={item} allItems={items} onGraded={onGraded} />
      ) : step.kind === "type" ? (
        <TypeCard key={`r${reviewIdx}`} item={item} mode={step.mode} onGraded={onGraded} />
      ) : step.kind === "trace" ? (
        <TraceCard key={`r${reviewIdx}`} item={item} mode="free" onGraded={onGraded} />
      ) : (
        <BuildCard key={`r${reviewIdx}`} item={item} onGraded={onGraded} />
      );
  } else {
    const item = items[learnStep.id];
    // Key by queue position so a re-presented (or repeated) card mounts fresh.
    const k = `l${learn.pos}`;
    if (learnStep.step === "teach") {
      assertLiveKind("teach");
      label = "Learn";
      body = <TeachCard key={k} item={item} onAdvance={advanceTeach} />;
    } else if (learnStep.step === "check1") {
      assertLiveKind("choice");
      label = "Practice";
      body = <ChoiceCard key={k} item={item} allItems={items} onGraded={onCheck} />;
    } else if (item.type === "kana") {
      assertLiveKind("trace");
      label = "Practice";
      body = <TraceCard key={k} item={item} mode="guided" onGraded={onCheck} />;
    } else {
      const mode = recallMode(item);
      assertLiveKind(`type:${mode}`);
      label = "Practice";
      body = <TypeCard key={k} item={item} mode={mode} onGraded={onCheck} />;
    }
  }

  return (
    <PhaseShell
      title={`${label} · ${Math.min(current + 1, total)}/${total}`}
      progress={progress}
      onClose={() => navigate("/")}
    >
      {body}
    </PhaseShell>
  );
}
