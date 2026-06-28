# Build Brief — Accounts + Cross-Device Progress Sync

**Goal:** progress follows the *learner*, not the device. Sign in → your items, streak, and
stats are the same on phone, laptop, anywhere. (Alex, 2026-06-28: "we need login so users
progress saves to username not device.")

**Stack (decided):** Supabase (auth + Postgres + sync) · sign-in via **Google / Apple OAuth**.
This unblocks the parked **Phase 5 (accounts/profile)** and **Phase 6 (backend)** items.

---

## Architecture

Today the store persists `{ items, languages, streak, stats, daily, devMode, settings }` to
`localStorage` under `lingua-v1` (`useStore.js` → `partialize`). That stays — it's the offline
cache. We add a thin **sync layer** on top:

```
 Zustand store ──persist──> localStorage   (offline cache, unchanged)
       │
       └── sync layer (only when signed in + Supabase configured)
                │  on sign-in: chooseSource(local, cloud) → push or pull
                │  on change:  debounced upload of the partialize blob
                ▼
        Supabase `progress` table  (one JSONB row per user, RLS-protected)
```

- **One row per user**, JSONB blob = the same slice `partialize` already produces. No schema
  churn as the store grows — the blob is opaque to Postgres. Versioned with `PERSIST_VERSION`.
- **Push vs pull** is decided by `src/store/sync.js` (`chooseSource`), already built + unit-tested:
  - no cloud row → **push** (first login migrates this device up);
  - fresh device with no real progress → **pull** (never overwrite cloud with an empty store);
  - cloud newer → **pull**; else → **push**. Last-write-wins (a merge engine isn't worth the
    risk for a solo learner).
- **Graceful degrade:** if the Supabase env vars are absent, the whole accounts feature stays
  dormant and the app behaves exactly as it does today (local-only). So this can ship dark and
  light up the moment the project is provisioned — no big-bang cutover, no risk to current state.
- **Security:** Row-Level Security (`schema.sql`) means the anon key can only ever read/write the
  signed-in user's own row. Keys: the Supabase **anon** key is public-by-design (safe in the
  browser); the **service-role** key is never shipped.

---

## What I build (code)

1. `src/lib/supabase.js` — client from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`; returns
   `null` when unconfigured (→ graceful degrade).
2. Auth: session listener + `signInWithGoogle()` / `signInWithApple()` / `signOut()`; expose
   `user` in the store (transient, not persisted).
3. Sync engine: on auth change run `chooseSource` → pull (hydrate store) or push (upload);
   subscribe to store changes → debounced upload; track `lastModified`.
4. UI: an **Account** section in Settings — "Sign in with Google" / "Sign in with Apple", signed-in
   email + "Sign out", and a quiet sync status. Calm + ND-friendly, no nags.
5. Tests: `sync.test.mjs` (done — push/pull decision) + a guard test that the app boots with no
   Supabase env. Smoke covers the unconfigured path (CI has no creds).

**Already in this PR:** `src/store/sync.js` (+ tests) and `supabase/schema.sql`. The rest lands in
the implementation PR, verified against the live project.

---

## What Alex provisions (the part only you can do) — checklist

Do these and the feature lights up. Google first (works on web today); Apple is more involved and
can follow.

- [ ] **Create the Supabase project** (supabase.com → New project). Note the **Project URL** and the
      **anon public** key (Settings → API).
- [ ] **Run `supabase/schema.sql`** in the project (Dashboard → SQL Editor → paste → Run).
- [ ] **Enable Google OAuth** (Dashboard → Authentication → Providers → Google):
      - In Google Cloud Console: create an OAuth 2.0 Client ID (Web), set the authorized redirect
        URI to the one Supabase shows (`https://<project>.supabase.co/auth/v1/callback`).
      - Paste the Google Client ID + secret into Supabase. Add the production + preview app URLs to
        Supabase Auth → URL Configuration (redirect allow-list).
- [ ] **Set Vercel env vars** (Project → Settings → Environment Variables), then redeploy:
      - `VITE_SUPABASE_URL` = project URL
      - `VITE_SUPABASE_ANON_KEY` = anon public key
      - (also add them to `.env.local` for local dev)
- [ ] **Apple sign-in (later):** needs an Apple Developer Program account ($99/yr) + a Services ID +
      key; configure under Authentication → Providers → Apple. Worth doing before App Store
      submission (Apple often requires "Sign in with Apple" if other social logins are offered).

> Heads-up: managed auth means storing user emails (standard, but it's now real user PII) — fold a
> short privacy note into Settings. And cross-device sync is last-write-wins, so editing on two
> devices while offline can let the later save win; fine for solo use, worth knowing.

---

## Open follow-ups (post-MVP)
- Conflict UX if last-write-wins ever bites (show "newer progress found on another device").
- Tie into the **Onboarding** flow (Phase 5): display name on top of the OAuth identity, the
  "why/reminder" fields, one-language lock.
- Account deletion / export (privacy hygiene).
