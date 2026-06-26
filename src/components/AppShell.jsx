import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Flame, Settings } from "lucide-react";
import BottomNav from "./BottomNav.jsx";
import { C, F } from "../theme.js";
import { useStore } from "../store/useStore.js";

// Max content width — on phones the app fills the screen; on wider/desktop it
// stays a centered column so it reads like a real app instead of stretching
// sparse edge-to-edge. Fluid (max-width + auto margins), no device breakpoints.
const MAXW = 600;

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
          paddingTop: "env(safe-area-inset-top)",
          background: C.surface,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
       <div style={{ maxWidth: MAXW, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
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
       </div>
      </header>

      <main style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {/* Centered column. Flex so screens that fill the height (e.g. the chat,
            with a pinned input) work, while scrolling screens still grow. */}
        <div style={{ maxWidth: MAXW, width: "100%", margin: "0 auto", minHeight: "100%", display: "flex", flexDirection: "column" }}>
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
