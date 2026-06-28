-- Lingua — accounts + progress sync schema (Supabase / Postgres)
-- Run this once in the Supabase project: Dashboard → SQL Editor → paste → Run.
-- It is idempotent (safe to re-run).
--
-- Design: one row per user holding the whole persisted store blob as JSONB
-- (mirrors the localStorage "lingua-v1" partialize slice). Last-write-wins by
-- updated_at; the client decides push-vs-pull (see src/store/sync.js).
-- Row-Level Security guarantees a signed-in user can ONLY read/write their own
-- row — there is no way to reach another user's progress, even with the anon key.

create table if not exists public.progress (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  data        jsonb       not null default '{}'::jsonb,  -- the persisted store blob
  version     integer     not null default 1,            -- PERSIST_VERSION at write time
  updated_at  timestamptz not null default now()
);

-- Keep updated_at honest on every write (so the client's last-write-wins is real).
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists progress_touch_updated_at on public.progress;
create trigger progress_touch_updated_at
  before update on public.progress
  for each row execute function public.touch_updated_at();

-- Row-Level Security: a user sees and edits only their own row.
alter table public.progress enable row level security;

drop policy if exists "own progress: select" on public.progress;
create policy "own progress: select" on public.progress
  for select using (auth.uid() = user_id);

drop policy if exists "own progress: insert" on public.progress;
create policy "own progress: insert" on public.progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "own progress: update" on public.progress;
create policy "own progress: update" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
