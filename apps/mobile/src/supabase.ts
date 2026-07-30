// Recognition client.
//
// - Web (the Vercel deployment): POSTs the photo to the co-hosted
//   /api/analyze-meal serverless function, which calls Gemini vision.
//   If no key is configured server-side, that endpoint returns a clearly
//   labelled sample plate (mock:true) so the flow still works.
// - Native (Expo Go / device): calls the Supabase Edge Function when
//   EXPO_PUBLIC_SUPABASE_URL + ANON_KEY are set; otherwise the local mock.
//
// The model only ever returns { name, portion, confidence } — every calorie,
// macro, and fiber number is computed client-side against the dish table.

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { findDishByName, type MealComponent, type Portion } from '@thali/shared';

const WEB = Platform.OS === 'web';

const url  = (Constants.expoConfig?.extra?.supabaseUrl as string | undefined)
  ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined)
  ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// On web the recognition backend is the co-hosted /api/analyze-meal function,
// so the flow is "enabled" — whether a real key is present is decided
// server-side and reflected in the response's `mock` flag.
export const isRecognitionEnabled = (): boolean => WEB || Boolean(url && anon);

export interface RecognizedComponent {
  name: string;
  portion: Portion;
  confidence: number;
  gramsEstimate?: number;
}
export interface RecognitionResponse {
  components: RecognizedComponent[];
  notes?: string;
}

export async function analyzeMealImage(
  imageBase64: string,
  mimeType = 'image/jpeg',
): Promise<RecognitionResponse & { mock: boolean; provider?: string; needsKey?: boolean }> {
  // ── Web: co-hosted Gemini endpoint ──────────────────────────────────────
  if (WEB) {
    try {
      const res = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType }),
      });
      if (res.ok) {
        const p = await res.json();
        return {
          components: Array.isArray(p.components) ? p.components : [],
          notes: p.notes,
          mock: Boolean(p.mock),
          provider: p.provider,
          needsKey: Boolean(p.needsKey),
        };
      }
    } catch {
      // network error → fall through to local mock
    }
    const mocked = await mockRecognition();
    return { ...mocked, mock: true };
  }

  // ── Native: Supabase Edge Function or local mock ────────────────────────
  if (!(url && anon)) {
    const mocked = await mockRecognition();
    return { ...mocked, mock: true };
  }
  const res = await fetch(`${url}/functions/v1/analyze-meal`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${anon}`,
      'apikey': anon,
    },
    body: JSON.stringify({ imageBase64, mimeType }),
  });
  if (!res.ok) throw new Error(`analyze_failed_${res.status}`);
  const payload = (await res.json()) as RecognitionResponse;
  return { ...payload, mock: false };
}

// Map recognised names → dish IDs via the reference table. Unmatched names are
// returned separately so the UI can surface them for manual correction.
export function resolveComponents(
  recognition: RecognitionResponse,
): { components: MealComponent[]; unresolved: string[] } {
  const components: MealComponent[] = [];
  const unresolved: string[] = [];
  for (const c of recognition.components) {
    const dish = findDishByName(c.name);
    if (!dish) { unresolved.push(c.name); continue; }
    components.push({
      dishId: dish.id,
      portion: c.portion,
      confidence: c.confidence,
      gramsOverride: c.gramsEstimate,
    });
  }
  return { components, unresolved };
}

// Local fallback plate — only used if the endpoint is unreachable. Clearly
// surfaced as mock in the UI.
async function mockRecognition(): Promise<RecognitionResponse> {
  await new Promise((r) => setTimeout(r, 700));
  return {
    components: [
      { name: 'Paneer butter masala', portion: 'medium', confidence: 0.82 },
      { name: 'Roti', portion: 'medium', confidence: 0.9 },
      { name: 'Roti', portion: 'medium', confidence: 0.88 },
      { name: 'Kachumber salad', portion: 'small', confidence: 0.7 },
    ],
    notes: 'Offline sample plate.',
  };
}
