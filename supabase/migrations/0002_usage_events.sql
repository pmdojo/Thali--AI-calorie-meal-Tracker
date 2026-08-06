-- Thali — anonymous usage telemetry
-- Run with: supabase db push   (or paste into the Supabase SQL editor)
--
-- No auth / login required. The app generates a random anonymous device id
-- (stored on-device) and the co-hosted /api/track function inserts events
-- with the SERVICE ROLE key. RLS is on with NO anon policies, so the public
-- anon key can neither read nor write this table — only the server can.

create table if not exists public.usage_events (
  id          bigint generated always as identity primary key,
  device_id   text        not null,
  event       text        not null,
  props       jsonb       not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists usage_events_event_time_idx on public.usage_events (event, created_at desc);
create index if not exists usage_events_device_idx      on public.usage_events (device_id);

alter table public.usage_events enable row level security;
-- (intentionally no policies — only the service role bypasses RLS)

-- Quick-glance rollup for the dashboard / stats endpoint.
create or replace view public.usage_summary as
select
  count(distinct device_id)                                                        as total_users,
  count(*) filter (where event = 'session')                                        as sessions,
  count(distinct device_id) filter (where event = 'onboarding_complete')           as onboarded_users,
  count(*) filter (where event = 'meal_logged')                                     as meals_logged,
  count(*) filter (where event = 'scan_used')                                       as scans,
  count(distinct device_id) filter (where created_at > now() - interval '7 days')   as active_7d,
  count(distinct device_id) filter (where created_at > now() - interval '24 hours') as active_24h
from public.usage_events;
