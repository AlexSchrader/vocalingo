// Cloud sync orchestration — the side-effecting layer that ties the Supabase
// client, the store, and the pure decision logic (sync.js) together. Imported
// dynamically at startup (main.jsx) so the Supabase SDK stays out of the initial
// render path. The push-vs-pull decision lives in sync.js (unit-tested); this
// file is the plumbing: auth listener, fetch/upload, debounced uploads.
import { supabase, isCloudConfigured } from "../lib/supabase.js";
import { useStore } from "./useStore.js";
import { PERSIST_VERSION, migrateState } from "./migrate.js";
import { chooseSource, extractProgress } from "./sync.js";

const DEBOUNCE_MS = 1500;

let currentUser = null;
let lastSerialized = null;
let applyingCloud = false; // guards the pull → setState → subscription loop
let uploadTimer = null;

function blobNow() {
  return extractProgress(useStore.getState());
}

async function fetchCloud(userId) {
  const { data, error } = await supabase
    .from("progress")
    .select("data, version, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { updatedAt: Date.parse(data.updated_at), blob: data.data ?? {}, version: data.version ?? 1 };
}

async function uploadNow() {
  if (!currentUser) return;
  const blob = blobNow();
  lastSerialized = JSON.stringify(blob);
  const { error } = await supabase.from("progress").upsert({
    user_id: currentUser.id,
    data: blob,
    version: PERSIST_VERSION,
    updated_at: new Date().toISOString(),
  });
  useStore.getState().setAuth(
    error ? { status: "error", error: error.message } : { status: "synced", error: null }
  );
}

function scheduleUpload() {
  if (!currentUser) return;
  useStore.getState().setAuth({ status: "syncing" });
  clearTimeout(uploadTimer);
  uploadTimer = setTimeout(() => uploadNow().catch(() => {}), DEBOUNCE_MS);
}

// Fires on every store change; uploads (debounced) when the synced slice really
// changed and we're signed in. Ignores changes we caused by applying a pull.
function onStoreChange() {
  if (!currentUser || applyingCloud) return;
  const ser = JSON.stringify(blobNow());
  if (ser === lastSerialized) return;
  lastSerialized = ser;
  useStore.getState().bumpModified();
  scheduleUpload();
}

async function onSignIn(u) {
  if (currentUser && currentUser.id === u.id) return; // already handled (e.g. token refresh)
  currentUser = u;
  const st = useStore.getState();
  st.setAuth({ user: { id: u.id, email: u.email ?? null }, status: "syncing", error: null });
  try {
    const cloud = await fetchCloud(u.id);
    const local = { updatedAt: useStore.getState().lastModified ?? 0, blob: blobNow() };
    const decision = chooseSource(local, cloud);
    if (decision === "pull" && cloud) {
      let blob = cloud.blob;
      if ((cloud.version ?? 1) < PERSIST_VERSION) blob = migrateState({ ...blob }, cloud.version);
      applyingCloud = true;
      useStore.getState().hydrateFromCloud(blob);
      lastSerialized = JSON.stringify(blobNow());
      applyingCloud = false;
      useStore.getState().setAuth({ status: "synced" });
    } else {
      await uploadNow(); // push — also creates the row on first sign-in
    }
  } catch (e) {
    useStore.getState().setAuth({ status: "error", error: String(e?.message ?? e) });
  }
}

function onSignOut() {
  currentUser = null;
  clearTimeout(uploadTimer);
  // Local progress stays as the offline cache; next sign-in re-syncs it.
  useStore.getState().setAuth({ user: null, status: "idle", error: null });
}

// Call once at startup. No-op (feature dormant) when Supabase isn't configured.
export function initCloudSync() {
  if (!isCloudConfigured) {
    useStore.getState().setAuth({ configured: false });
    return;
  }
  useStore.getState().setAuth({ configured: true });

  // Expose sign-in/out through the store so the UI never imports the SDK.
  useStore.setState({
    signInWithGoogle: () =>
      supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } }),
    signInWithApple: () =>
      supabase.auth.signInWithOAuth({ provider: "apple", options: { redirectTo: window.location.origin } }),
    signOut: () => supabase.auth.signOut(),
  });

  // INITIAL_SESSION / SIGNED_IN / TOKEN_REFRESHED all arrive here with a session.
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) onSignIn(session.user);
    else onSignOut();
  });

  // Upload local changes (debounced) while signed in.
  useStore.subscribe(onStoreChange);
}
