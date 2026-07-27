# Thali — Supabase

## Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Copy the project URL + anon key + service role key into `../.env` (see `../.env.example`).
3. Install the Supabase CLI: `brew install supabase/tap/supabase`.
4. From the repo root:

```bash
supabase link --project-ref <your-project-ref>
supabase db push                                  # applies migrations/0001_init.sql
psql "$SUPABASE_DB_URL" -f supabase/seed/dish_reference_v1.sql   # seeds ~30 dishes
supabase functions deploy analyze-meal            # deploys the Claude vision edge fn
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

## Schema

- `profiles` — one row per authenticated user; RLS: self-only.
- `dish_reference` — versioned dish table (seeded from `packages/shared/data/dishes.v1.json`); RLS: authenticated read.
- `meal_logs` — one row per logged meal; RLS: self-only. Includes `was_flagged`, `took_alternative`, and `was_corrected` so the calibration feedback loop from the PRD is a query away.
- `waitlist` — public insert-only email capture from the landing page.
- Storage bucket `meal-images/` with per-user path prefix RLS.

## Edge Function: `analyze-meal`

Takes `{ imageBase64, mimeType }`, calls the Claude vision API with a **tool-use schema** (never free-text), returns validated `{ components: [{name, portion, confidence, ...}], notes }`.

Nutrition math happens **client-side** against `dish_reference`. The LLM is never trusted with kcal numbers directly — this is the honesty commitment from the PRD.
