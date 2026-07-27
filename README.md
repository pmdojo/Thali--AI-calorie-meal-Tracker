# Thali

**AI nutrition coach calibrated for mixed home-cooked Indian meals.**

Generalist food-AI apps are trained on plated Western photography. Thali is calibrated on thali-style plates, dal-sabzi combos, and tiffin-delivered meals — and closes the gap none of them address: turning a calorie estimate into a **goal-relative decision**.

## The wedge

1. **Calibrated for Indian food** — ~100-dish reference table with per-portion gram weights, not a global database that guesses.
2. **Ranges, not fake precision** — every estimate ships with a confidence band. Point estimates on photo-estimated home-cooked food are a claim the underlying science can't support.
3. **One better choice, not a lecture** — if a meal exceeds 40% of the remaining daily budget, we surface *one* concrete swap before you log, not five buttons and a chart.

## Repo layout

```
apps/
  mobile/     # Expo (React Native, iOS-first) — the product
  web/        # Next.js landing page + waitlist
packages/
  shared/     # goal engine, dish reference, alt suggestions, Zod schemas
  ui-tokens/  # colors, spacing, type — shared between mobile & web
supabase/     # SQL migrations, Edge Functions
```

## Getting started

```bash
npm install
cp .env.example .env             # fill in Supabase + Anthropic keys
npm test                         # runs shared-package unit tests

npm run mobile                   # Expo dev server (i for iOS Simulator)
npm run web                      # Next.js landing at http://localhost:3000
```

The mobile app is **fully usable without any API keys** for the deterministic path (onboarding, goal engine, manual meal logging, ledger, weekly view). The camera-recognition flow requires Supabase + Anthropic keys.

## Status

Early scaffold — MVP in progress.
