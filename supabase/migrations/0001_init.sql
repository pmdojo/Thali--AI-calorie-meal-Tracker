-- Thali — initial schema
-- Run with: supabase db push  (after `supabase link`)
-- Or paste into the SQL editor in the Supabase dashboard.

-- ─── extensions ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  age             integer      not null check (age between 10 and 120),
  sex             text         not null check (sex in ('male', 'female')),
  height_cm       numeric      not null check (height_cm between 80 and 260),
  weight_kg       numeric      not null check (weight_kg between 25 and 350),
  activity        text         not null check (activity in ('sedentary','light','moderate','active','very_active')),
  goal            text         not null check (goal in ('lose','maintain','gain')),
  target_weight_kg numeric,
  dietary         text         not null check (dietary in ('vegetarian','vegan','eggetarian','non_vegetarian')),
  allergies       text[]       default '{}',
  daily_kcal      integer      not null,
  macro_split     jsonb        not null,           -- {proteinG, carbsG, fatG}
  created_at      timestamptz  not null default now(),
  updated_at      timestamptz  not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are self-only"
  on public.profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── dish_reference (versioned; seeded from packages/shared/data) ──────────
create table if not exists public.dish_reference (
  id                text        primary key,
  name              text        not null,
  category          text        not null,
  vegetarian        boolean     not null default true,
  portion_grams     jsonb       not null,          -- {small, medium, large}
  kcal_per_100g     numeric     not null,
  protein_per_100g  numeric     not null,
  carbs_per_100g    numeric     not null,
  fat_per_100g      numeric     not null,
  version           integer     not null default 1,
  updated_at        timestamptz not null default now()
);

alter table public.dish_reference enable row level security;

-- readable by every authenticated user; writes only via service role
create policy "dish_reference public read"
  on public.dish_reference for select
  using (auth.role() = 'authenticated');

-- ─── meal_logs ─────────────────────────────────────────────────────────────
create table if not exists public.meal_logs (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users(id) on delete cascade,
  image_path         text,                            -- storage: meal-images/<user_id>/<id>.jpg
  components         jsonb       not null,            -- [{dishId, portion, gramsOverride?, confidence}]
  estimated_kcal_low  integer    not null,
  estimated_kcal_mid  integer    not null,
  estimated_kcal_high integer    not null,
  estimated_macros    jsonb      not null,            -- {protein: {low,mid,high}, carbs: …, fat: …}
  overall_confidence  numeric    not null,
  meal_type           text       not null check (meal_type in ('breakfast','lunch','dinner','snack')),
  source              text       not null check (source in ('manual','photo')),
  was_flagged         boolean    not null default false,
  took_alternative    boolean    not null default false,
  was_corrected       boolean    not null default false,
  corrected_kcal      integer,
  note                text,
  logged_at           timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists meal_logs_user_time_idx
  on public.meal_logs (user_id, logged_at desc);

alter table public.meal_logs enable row level security;

create policy "meal_logs are self-only"
  on public.meal_logs for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── waitlist (public form) ────────────────────────────────────────────────
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       citext unique not null,
  source      text,                                   -- utm_source or 'landing'
  created_at  timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- anyone can insert (email capture); nobody can read via anon key
create policy "waitlist inserts are public"
  on public.waitlist for insert
  with check (true);

-- ─── storage bucket (per-user prefix RLS) ──────────────────────────────────
insert into storage.buckets (id, name, public)
values ('meal-images', 'meal-images', false)
on conflict (id) do nothing;

create policy "meal-images: read own"
  on storage.objects for select
  using (bucket_id = 'meal-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "meal-images: insert own"
  on storage.objects for insert
  with check (bucket_id = 'meal-images' and (storage.foldername(name))[1] = auth.uid()::text);
