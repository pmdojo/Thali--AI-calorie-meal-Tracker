// Vercel serverless function — co-hosted with the Thali web app.
// POST { imageBase64, mimeType } → { components:[{name,portion,gramsEstimate,confidence}], notes, mock, provider }
//
// The vision model ONLY identifies dish + portion. Calorie/macro/fiber math
// happens client-side against the reference table (packages/shared) — the model
// is never trusted with nutrition numbers. This keeps accuracy a data problem.
//
// Configure ONE key in the Vercel project's Environment Variables:
//   GEMINI_API_KEY     — free tier at https://aistudio.google.com/apikey  (preferred)
//   ANTHROPIC_API_KEY  — https://console.anthropic.com  (fallback)
// With neither set, the endpoint returns a clearly-labelled sample plate
// (mock:true, needsKey:true) so the flow still works in the free demo.

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
// `gemini-flash-latest` auto-resolves to the current free-tier flash model,
// so this doesn't go stale as Google retires older versions.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

// Canonical dish names the client can resolve. Steering the model toward these
// dramatically improves the match rate against the reference table.
const DISH_NAMES = [
  'Roti', 'Chapati with ghee', 'Plain paratha', 'Aloo paratha', 'Naan',
  'White rice', 'Basmati rice', 'Jeera rice', 'Vegetable biryani', 'Chicken biryani',
  'Dal tadka', 'Dal makhani', 'Chana masala', 'Rajma', 'Sambar',
  'Paneer butter masala', 'Paneer bhurji', 'Palak paneer', 'Chicken curry',
  'Butter chicken', 'Egg bhurji', 'Aloo gobi', 'Bhindi masala', 'Baingan bharta',
  'Mixed vegetable sabzi', 'Kachumber salad', 'Cucumber raita', 'Plain curd',
  'Samosa', 'Onion pakora', 'Idli', 'Plain dosa', 'Masala dosa', 'Upma', 'Poha',
  'Gulab jamun',
];

const SYSTEM = `You are a nutrition-vision model calibrated for mixed home-cooked Indian meals (thali plates, tiffins, dal-sabzi-roti combos).
Given a photo of a plate, identify each distinct food component you can see.
For each component:
- Return a short name. STRONGLY PREFER matching to the closest name from this list when the food is one of them: ${DISH_NAMES.join(', ')}. Only invent a new short name if nothing in the list fits.
- Choose a portion size — small, medium, or large — relative to typical Indian serving norms (roti small ~30g / medium ~45g / large ~60g; rice small ~100g / medium ~150g / large ~220g; a gravy dish small ~100g / medium ~150g / large ~200g).
- Optionally give gramsEstimate if you are unusually confident about the weight.
- Give an honest confidence in [0,1]: dim lighting, occlusion, unusual bowls, or a dish you're unsure of → lower it.
Never output calorie or macro numbers — those are computed downstream. Only identify dishes and portions. If the image is clearly not food, return an empty components array.`;

const SAMPLE = {
  components: [
    { name: 'Paneer butter masala', portion: 'medium', confidence: 0.82 },
    { name: 'Roti', portion: 'medium', confidence: 0.9 },
    { name: 'Roti', portion: 'medium', confidence: 0.88 },
    { name: 'Kachumber salad', portion: 'small', confidence: 0.7 },
  ],
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    // ?models=1 → list which Gemini models this key can call generateContent on.
    if (req.query?.models && GEMINI_KEY) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}&pageSize=100`);
        const j = await r.json();
        const usable = (j.models || [])
          .filter((m: any) => (m.supportedGenerationMethods || []).includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));
        return res.status(200).json({ usable });
      } catch (e: any) {
        return res.status(200).json({ error: String(e?.message || e) });
      }
    }
    return res.status(200).json({
      configured: Boolean(GEMINI_KEY || ANTHROPIC_KEY),
      provider: GEMINI_KEY ? 'gemini' : ANTHROPIC_KEY ? 'anthropic' : null,
      model: GEMINI_MODEL,
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  const imageBase64: string | undefined = body?.imageBase64;
  const mimeType: string = body?.mimeType || 'image/jpeg';
  if (!imageBase64) return res.status(400).json({ error: 'imageBase64 required' });

  // No key → labelled sample so the demo still works.
  if (!GEMINI_KEY && !ANTHROPIC_KEY) {
    return res.status(200).json({
      ...SAMPLE,
      mock: true,
      needsKey: true,
      notes: 'Demo mode — add a free GEMINI_API_KEY in Vercel to analyse real photos.',
    });
  }

  try {
    const result = GEMINI_KEY
      ? await callGemini(imageBase64, mimeType)
      : await callAnthropic(imageBase64, mimeType);
    return res.status(200).json({ ...result, mock: false, provider: GEMINI_KEY ? 'gemini' : 'anthropic' });
  } catch (err: any) {
    // Fail soft: keep the app usable, but tell the client it wasn't real.
    return res.status(200).json({
      ...SAMPLE,
      mock: true,
      error: String(err?.message || err),
      notes: 'Recognition failed — showing a sample plate. Check the API key / quota.',
    });
  }
}

function safeParse(s: string) { try { return JSON.parse(s); } catch { return {}; } }

// ─── Gemini ────────────────────────────────────────────────────────────────
async function callGemini(imageBase64: string, mimeType: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  const resBody = {
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{
      role: 'user',
      parts: [
        { text: 'Identify the Indian dishes on this plate.' },
        { inline_data: { mime_type: mimeType, data: imageBase64 } },
      ],
    }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          components: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                portion: { type: 'string', enum: ['small', 'medium', 'large'] },
                gramsEstimate: { type: 'number' },
                confidence: { type: 'number' },
              },
              required: ['name', 'portion', 'confidence'],
            },
          },
          notes: { type: 'string' },
        },
        required: ['components'],
      },
    },
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(resBody),
  });
  if (!r.ok) throw new Error(`gemini_${r.status}: ${(await r.text()).slice(0, 300)}`);
  const json = await r.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('gemini_empty');
  const parsed = JSON.parse(text);
  return { components: normalize(parsed.components), notes: parsed.notes };
}

// ─── Anthropic (fallback) ────────────────────────────────────────────────────
async function callAnthropic(imageBase64: string, mimeType: string) {
  const TOOL = {
    name: 'emit_recognition',
    description: 'Emit identified plate components.',
    input_schema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              portion: { type: 'string', enum: ['small', 'medium', 'large'] },
              gramsEstimate: { type: 'number' },
              confidence: { type: 'number' },
            },
            required: ['name', 'portion', 'confidence'],
          },
        },
        notes: { type: 'string' },
      },
      required: ['components'],
    },
  };
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY as string,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: 'emit_recognition' },
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
          { type: 'text', text: 'Identify the Indian dishes on this plate.' },
        ],
      }],
    }),
  });
  if (!r.ok) throw new Error(`anthropic_${r.status}: ${(await r.text()).slice(0, 300)}`);
  const json = await r.json();
  const toolUse = json?.content?.find((b: any) => b.type === 'tool_use');
  if (!toolUse?.input?.components) throw new Error('anthropic_no_tool_use');
  return { components: normalize(toolUse.input.components), notes: toolUse.input.notes };
}

function normalize(components: any[]): any[] {
  if (!Array.isArray(components)) return [];
  return components
    .filter((c) => c && typeof c.name === 'string')
    .map((c) => ({
      name: c.name,
      portion: ['small', 'medium', 'large'].includes(c.portion) ? c.portion : 'medium',
      gramsEstimate: typeof c.gramsEstimate === 'number' ? c.gramsEstimate : undefined,
      confidence: typeof c.confidence === 'number' ? Math.max(0, Math.min(1, c.confidence)) : 0.6,
    }));
}
