// Vercel serverless function — read the usage rollup.
// GET /api/stats?key=<STATS_TOKEN> → { total_users, sessions, onboarded_users,
//   meals_logged, scans, active_7d, active_24h }
//
// Guarded by a shared token so the numbers aren't public. Configure:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (same as /api/track)
//   STATS_TOKEN                               (any random string you choose)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STATS_TOKEN = process.env.STATS_TOKEN;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });

  if (!SUPABASE_URL || !SERVICE_KEY || !STATS_TOKEN) {
    return res.status(503).json({ error: 'not_configured', need: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'STATS_TOKEN'] });
  }
  const key = req.query?.key ?? (req.headers?.['x-stats-token']);
  if (key !== STATS_TOKEN) return res.status(401).json({ error: 'unauthorized' });

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/usage_summary?select=*`, {
      headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}` },
    });
    if (!r.ok) return res.status(502).json({ error: 'query_failed', status: r.status });
    const rows = await r.json();
    return res.status(200).json(Array.isArray(rows) ? (rows[0] ?? {}) : rows);
  } catch (e: any) {
    return res.status(500).json({ error: 'server_error', detail: String(e?.message ?? e) });
  }
}
