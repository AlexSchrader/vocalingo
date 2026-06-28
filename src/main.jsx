import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Keep the PWA fresh. The default register-only script never checked for new
// deploys, so a cached build stuck until a manual hard-refresh (the stale
// Ladder/audio bug). Here we check for a new service worker on load and reload
// ONCE when it takes control — but only if the page was already controlled (a
// real update), never on first install or in test runs.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => reg.update())
      .catch(() => {});
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing || !hadController) return; // skip first-install claim
      refreshing = true;
      window.location.reload();
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Cloud progress sync (Supabase) — dynamically imported so the SDK stays out of
// the initial render path. No-ops entirely when Supabase env isn't configured.
import("./store/cloudSync.js")
  .then(({ initCloudSync }) => initCloudSync())
  .catch(() => {});
