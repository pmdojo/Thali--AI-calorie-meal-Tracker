// Anonymous usage telemetry — counts users and key actions, nothing personal.
//
// - A random device id is generated once and persisted on-device.
// - Events POST (fire-and-forget) to the co-hosted /api/track function, which
//   inserts into Supabase with a server-side service key. No login, no PII —
//   just { deviceId, event, props }.
// - Any failure is swallowed: telemetry must never break the app.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const DEVICE_KEY = 'thali-device-id-v1';
// On web the API is same-origin. On native, point at the deployed app.
const TRACK_URL =
  Platform.OS === 'web' ? '/api/track' : 'https://thali-ai.vercel.app/api/track';

export type UsageEvent = 'session' | 'onboarding_complete' | 'meal_logged' | 'scan_used';

let cachedId: string | null = null;
let sessionSent = false;

function randomId(): string {
  // 16 random bytes, hex — no dependency needed.
  let s = '';
  for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

async function getDeviceId(): Promise<string> {
  if (cachedId) return cachedId;
  try {
    const existing = await AsyncStorage.getItem(DEVICE_KEY);
    if (existing) return (cachedId = existing);
    const fresh = randomId();
    await AsyncStorage.setItem(DEVICE_KEY, fresh);
    return (cachedId = fresh);
  } catch {
    // Storage unavailable — still return an id so events group per-launch.
    return (cachedId = randomId());
  }
}

export function track(event: UsageEvent, props: Record<string, unknown> = {}): void {
  // Deliberately not awaited by callers — fire and forget.
  void (async () => {
    try {
      const deviceId = await getDeviceId();
      await fetch(TRACK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ deviceId, event, props: { platform: Platform.OS, ...props } }),
      });
    } catch {
      /* never surface telemetry errors */
    }
  })();
}

// Once per app launch.
export function trackSession(): void {
  if (sessionSent) return;
  sessionSent = true;
  track('session');
}
