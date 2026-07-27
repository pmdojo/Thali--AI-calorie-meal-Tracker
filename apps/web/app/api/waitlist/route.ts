import { NextResponse } from 'next/server';

// POST /api/waitlist  { email, source? }
//
// Writes to the public.waitlist table via Supabase REST when env is configured.
// Falls back to a no-op OK in local dev so the form is testable without secrets.

export const runtime = 'edge';

const URL_KEY  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(req: Request) {
  let body: { email?: string; source?: string };
  try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'invalid_email' }, 400);
  }

  if (!URL_KEY || !ANON_KEY) {
    // Local dev: pretend it worked. Real deploy sets both env vars.
    console.log('[waitlist:dev]', email);
    return json({ ok: true, mode: 'dev-noop' });
  }

  const res = await fetch(`${URL_KEY}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'apikey': ANON_KEY,
      'authorization': `Bearer ${ANON_KEY}`,
      'prefer': 'return=minimal',
    },
    body: JSON.stringify({ email, source: body.source ?? 'landing' }),
  });

  if (!res.ok) {
    // 409 = duplicate; treat as success.
    if (res.status === 409) return json({ ok: true, mode: 'existing' });
    const detail = await res.text();
    return json({ error: 'supabase_error', detail }, 502);
  }

  return json({ ok: true, mode: 'inserted' });
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}
