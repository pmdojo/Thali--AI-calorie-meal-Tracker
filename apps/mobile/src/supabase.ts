// Feature-flagged recognition client with a dev-mode mock, so the camera
// flow is testable end-to-end even before the Supabase project + Anthropic
// key are wired. When keys are present, calls the real Edge Function.

import Constants from 'expo-constants';
import { findDishByName, type MealComponent, type Portion } from '@thali/shared';

const url  = (Constants.expoConfig?.extra?.supabaseUrl as string | undefined)
  ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined)
  ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isRecognitionEnabled = (): boolean => Boolean(url && anon);

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
): Promise<RecognitionResponse & { mock: boolean }> {
  if (!isRecognitionEnabled()) {
    const mocked = await mockRecognition();
    return { ...mocked, mock: true };
  }
  const res = await fetch(`${url}/functions/v1/analyze-meal`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${anon}`,
      'apikey': anon!,
    },
    body: JSON.stringify({ imageBase64, mimeType }),
  });
  if (!res.ok) throw new Error(`analyze_failed_${res.status}`);
  const payload = (await res.json()) as RecognitionResponse;
  return { ...payload, mock: false };
}

// Turn a RecognitionResponse into MealComponents the store/review flow
// understands. Unmatched dishes are dropped, but returned separately so the
// UI can surface them ("we couldn't match: gulab jamun") for correction.
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

// Plausible dev-mode response so the camera → review → flag loop is
// demoable without any keys. Weighted to trigger the flag reliably
// (paneer butter + rotis + rice ≈ 42-55% of a 1800-2000 kcal budget).
async function mockRecognition(): Promise<RecognitionResponse> {
  await new Promise((r) => setTimeout(r, 900));
  return {
    components: [
      { name: 'Paneer butter masala', portion: 'medium', confidence: 0.82 },
      { name: 'Roti (whole wheat)',   portion: 'medium', confidence: 0.9 },
      { name: 'Roti (whole wheat)',   portion: 'medium', confidence: 0.88 },
      { name: 'Kachumber salad',      portion: 'small',  confidence: 0.7 },
    ],
    notes: 'Mock response — set EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY to enable real recognition.',
  };
}
