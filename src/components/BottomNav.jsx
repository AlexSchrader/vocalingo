import { useNavigate, useLocation } from "react-router-dom";
import { Home, ListTree, MessageCircle, BarChart3 } from "lucide-react";
import { C, F } from "../theme.js";

const TABS = [
  { label: "Today", path: "/", icon: Home },
  { label: "Ladder", path: "/ladder", icon: ListTree },
  { label: "Haruki", path: "/haruki", icon: MessageCircle },
  { label: "Stats", path: "/stats", icon: BarChart3 },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        display: "flex",
        borderTop: `1px solid ${C.line}`,
        background: C.surface,
        paddingBottom: "env(safe-area-inset-bottom)",
        flexShrink: 0,
      }}
    >
      {TABS.map(({ label, path, icon: Icon }) => {
        const active = pathname === path;
        return (
          <button
            key={label}
            aria-label={label}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "10px 0 8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: active ? C.ai : C.inkSoft,
              fontFamily: F.body,
              fontSize: 11,
              fontWeight: active ? 600 : 500,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
