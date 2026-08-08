-- Applications table for the /apply funnel (P2.2).
-- Inserts happen ONLY server-side via /api/apply using the service role key.
-- RLS is enabled with no policies: anon and authenticated roles can neither
-- read nor write; the service role bypasses RLS by design.

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  site text,
  stake text,
  volume_bucket text,
  db_summary text,
  no_database boolean not null default false,
  bankroll text,
  staked_until text,
  study_process text,
  goal_12mo text,
  biggest_obstacle text,
  investment_viable text,
  cfp_interest text,
  name text,
  email text,
  discord text,
  status text not null default 'new',
  intent text not null default 'program',   -- 'program' | 'audit' (?intent=audit from /audit)
  source_utm jsonb
);

alter table public.applications enable row level security;

-- Intentionally no RLS policies: nothing is exposed to anon/authenticated.

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);

create index if not exists applications_status_idx
  on public.applications (status);
