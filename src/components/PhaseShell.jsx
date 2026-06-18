import { C, F } from "../theme.js";

// Reusable lesson-phase layout: a pinned top bar (title + progress), a scrolling
// body, and a pinned footer for the primary action. Mirrors AppShell's column
// model so lessons feel native on a phone.
export default function PhaseShell({ title, progress, onClose, children, footer }) {
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
          padding: "12px 16px",
          paddingTop: "calc(12px + env(safe-area-inset-top))",
          background: C.surface,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close lesson"
              style={{
                border: "none",
                background: "transparent",
                fontSize: 20,
                lineHeight: 1,
                cursor: "pointer",
                color: C.inkSoft,
                padding: 0,
              }}
            >
              ✕
            </button>
          )}
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 999,
              background: C.lockedBg,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.round((progress ?? 0) * 100)}%`,
                height: "100%",
                background: C.ai,
                transition: "width 200ms ease",
              }}
            />
          </div>
        </div>
        {title && (
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: C.inkSoft }}>{title}</div>
        )}
      </header>

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: 16,
        }}
      >
        {children}
      </main>

      {footer && (
        <footer
          style={{
            flexShrink: 0,
            padding: 16,
            paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
            background: C.surface,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}
