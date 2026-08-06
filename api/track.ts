// Vercel serverless function — anonymous usage telemetry.
// POST { deviceId, event, props? } → inserts one row into public.usage_events.
//
// The Supabase SERVICE ROLE key is used server-side only (never shipped to the
// client), so the table stays private behind RLS. If the env isn't configured
// the endpoint is a graceful no-op, so the app keeps working with no keys.
//
// Configure in the Vercel project's Environment Variables:
//   SUPABASE_URL                — https://<ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   — Project Settings → API → service_role secret

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only these event names are accepted (keeps the table clean, blocks spam noise).
const ALLOWED = new Set(['session', 'onboarding_complete', 'meal_logged', 'scan_used']);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body ?? {});
  const deviceId = typeof body.deviceId === 'string' ? body.deviceId.slice(0, 64) : '';
  const event = typeof body.event === 'string' ? body.event : '';
  const props = body.props && typeof body.props === 'object' ? body.props : {};

  if (!deviceId || !ALLOWED.has(event)) {
    return res.status(400).json({ error: 'bad_request' });
  }

  // No keys configured → succeed silently so the client never errors.
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(200).json({ ok: true, stored: false });
  }

  try {
    const base = SUPABASE_URL.replace(/\/+$/, '');
    const r = await fetch(`${base}/rest/v1/usage_events`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: SERVICE_KEY,
        authorization: `Bearer ${SERVICE_KEY}`,
        prefer: 'return=minimal',
      },
      body: JSON.stringify({ device_id: deviceId, event, props }),
    });
    if (r.ok) return res.status(200).json({ ok: true, stored: true });
    // TEMP diagnostic (no secrets) — remove after setup is verified.
    const detail = (await r.text()).slice(0, 300);
    return res.status(200).json({ ok: false, stored: false, upstream: r.status, detail });
  } catch (e: any) {
    return res.status(200).json({ ok: true, stored: false, err: String(e?.message ?? e).slice(0, 200) });
  }
}

function safeParse(s: string) { try { return JSON.parse(s); } catch { return {}; } }
