import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PhaseShell from "../components/PhaseShell.jsx";
import ChoiceCard from "../components/games/ChoiceCard.jsx";
import TypeCard from "../components/games/TypeCard.jsx";
import BuildCard from "../components/games/BuildCard.jsx";
import TraceCard from "../components/games/TraceCard.jsx";
import CardBreath from "../components/CardBreath.jsx";
import { useStore } from "../store/useStore.js";
import { isReviewable } from "../store/mastery.js";
import { buildSandboxItems, runnerWriters } from "../store/dev.js";
import { LIVE_CARD_KINDS } from "../data/contract.js";
import { C, F } from "../theme.js";

function assertLiveKind(kindKey) {
  if (!LIVE_CARD_KINDS.includes(kindKey)) {
    throw new Error(`Review routed unlisted card kind "${kindKey}". Add it to LIVE_CARD_KINDS first.`);
  }
}

function reviewStepFor(item) {
  const rung = item.rung ?? 1;
  if (rung <= 1) return { kind: "choice" };
  if (rung === 2) return { kind: "type", mode: "meaning" };
  return item.type === "kana" ? { kind: "trace" } : { kind: "build" };
}

export default function Review() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sandbox (Dev Mode) run: review a single lesson's items at a preview depth,
  // against a throwaway in-memory map, with every store writer no-op'd. Used by
  // the dev panel's mid-progress / mastered previews. Fully isolated from real state.
  const sandbox = searchParams.get("sandbox") === "1";
  const home = sandbox ? "/dev" : "/";

  const storeItems = useStore((s) => s.items);
  const dueItems = useStore((s) => s.dueItems);
  const sandboxItems = useMemo(
    () =>
      sandbox
        ? buildSandboxItems(searchParams.get("lesson"), searchParams.get("state") ?? "mid")
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sandbox]
  );
  const items = sandbox ? sandboxItems : storeItems;

  const realWriters = {
    gradeItem: useStore((s) => s.gradeItem),
    completeReviews: useStore((s) => s.completeReviews),
    rollDailyGoal: useStore((s) => s.rollDailyGoal),
  };
  const { gradeItem, completeReviews, rollDailyGoal } = runnerWriters(sandbox, realWriters);

  // Snapshot the queue on mount — grading mutates items but shouldn't reshuffle.
  // In sandbox only the previewed lesson's items are reviewable (everything else
  // is rung 0), so filtering by isReviewable yields exactly that lesson.
  const reviewQueue = useMemo(
    () => {
      const source = sandbox ? Object.values(items).filter(isReviewable) : dueItems();
      return source.map((it) => ({ ...reviewStepFor(it), id: it.id }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  const done = idx >= reviewQueue.length;

  useEffect(() => {
    if (done && !finished) {
      completeReviews();
      rollDailyGoal();
      setFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (reviewQueue.length === 0) {
    return (
      <PhaseShell title="Reviews" progress={1} onClose={() => navigate(home)}>
        <div style={{ margin: "auto", textAlign: "center", color: C.inkSoft }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          Nothing due right now.
          <br />
          <button
            onClick={() => navigate(home)}
            style={{ marginTop: 16, padding: "12px 24px", borderRadius: 12, border: "none", background: C.ai, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
          >
            {sandbox ? "Back to Dev panel" : "Back to Today"}
          </button>
        </div>
      </PhaseShell>
    );
  }

  const progress = Math.min(idx, reviewQueue.length) / reviewQueue.length;

  if (finished || done) {
    return (
      <PhaseShell title="Reviews" progress={1}>
        <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ fontSize: 56 }}>✓</div>
          <div style={{ fontFamily: F.disp, fontSize: 24, fontWeight: 700 }}>Reviews cleared</div>
          <div style={{ color: C.inkSoft, maxWidth: 300 }}>
            {reviewQueue.length} item{reviewQueue.length === 1 ? "" : "s"} reviewed.
          </div>
          <button
            data-testid="back-to-today"
            onClick={() => navigate(home)}
            style={{ marginTop: 8, padding: "14px 28px", borderRadius: 14, border: "none", background: C.ai, color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: F.body, cursor: "pointer" }}
          >
            {sandbox ? "Back to Dev panel" : "Back to Today"}
          </button>
        </div>
      </PhaseShell>
    );
  }

  const step = reviewQueue[idx];
  const item = items[step.id];
  const onGraded = (grade) => {
    gradeItem(item.id, grade);
    setIdx((i) => i + 1);
  };
  const kindKey = step.kind === "type" ? `type:${step.mode}` : step.kind;
  assertLiveKind(kindKey);

  let card;
  if (step.kind === "choice") {
    card = <ChoiceCard item={item} allItems={items} onGraded={onGraded} />;
  } else if (step.kind === "type") {
    card = <TypeCard item={item} mode={step.mode} onGraded={onGraded} />;
  } else if (step.kind === "trace") {
    card = <TraceCard item={item} mode="free" onGraded={onGraded} />;
  } else {
    card = <BuildCard item={item} onGraded={onGraded} />;
  }

  return (
    <PhaseShell title={`${sandbox ? "🧪 Dev · " : ""}Review · ${idx + 1}/${reviewQueue.length}`} progress={progress} onClose={() => navigate(home)}>
      {/* Keyed remount per card drives the entrance "breath" (fade + brief
          input guard) so carried taps don't bleed into the next card. */}
      <CardBreath key={`r${idx}`}>{card}</CardBreath>
    </PhaseShell>
  );
}
