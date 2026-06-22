import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Flame, Settings } from "lucide-react";
import BottomNav from "./BottomNav.jsx";
import { C, F } from "../theme.js";
import { useStore } from "../store/useStore.js";

// 100dvh flex column: pinned top bar, scrolling content, pinned bottom nav.
// Fluid layout only — no device breakpoints.
export default function AppShell() {
  const navigate = useNavigate();
  const seedOnce = useStore((s) => s.seedOnce);
  const streak = useStore((s) => s.streak);

  useEffect(() => {
    seedOnce();
  }, [seedOnce]);

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: C.washi,
        color: C.ink,
        fontFamily: F.body,
      }}
    >
      <header
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          paddingTop: "calc(12px + env(safe-area-inset-top))",
          background: C.surface,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <img
            src="/icon-192.png"
            alt="Lingua"
            width={26}
            height={26}
            style={{ borderRadius: 7, display: "block" }}
          />
          <span style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>
            Lingua
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            aria-label="streak"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 11px",
              borderRadius: 999,
              background: C.aiSoft,
              color: C.aiDeep,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <Flame size={15} color={C.shu} fill={streak.current > 0 ? C.shu : "none"} />
            {streak.current}
          </div>
          {/* Settings lives here as a gear (to the right of the streak), not in
              the bottom nav, which stays the four primary tabs. */}
          <button
            aria-label="Settings"
            onClick={() => navigate("/settings")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 999,
              border: "none",
              background: "transparent",
              color: C.inkSoft,
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Settings size={20} strokeWidth={1.9} />
          </button>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
