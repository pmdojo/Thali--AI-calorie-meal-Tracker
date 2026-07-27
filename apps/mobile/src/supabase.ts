// Feature-flagged Supabase client. Returns null when env keys aren't set,
// which is the case in the local-only demo build. The camera + recognition
// flow checks isRecognitionEnabled() before invoking anything remote.

import Constants from 'expo-constants';

const url  = (Constants.expoConfig?.extra?.supabaseUrl as string | undefined)
  ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined)
  ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isRecognitionEnabled = (): boolean => Boolean(url && anon);

export async function analyzeMealImage(imageBase64: string, mimeType = 'image/jpeg'): Promise<{
  components: Array<{ name: string; portion: 'small' | 'medium' | 'large'; confidence: number; gramsEstimate?: number }>;
  notes?: string;
}> {
  if (!isRecognitionEnabled()) throw new Error('recognition_disabled');
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
  return res.json();
}
