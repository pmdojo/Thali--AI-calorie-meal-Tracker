// Supabase Edge Function — Deno runtime.
// POST { imageBase64: string, mimeType?: string } → RecognitionResponse.
//
// The LLM emits *dish identity + portion* only. Calorie math is server-side
// against dish_reference so accuracy claims stay defensible.
//
// Env required in the Edge Function config:
//   ANTHROPIC_API_KEY
//   ANTHROPIC_MODEL   (default: claude-sonnet-5)
//
// Deploy:
//   supabase functions deploy analyze-meal --no-verify-jwt=false

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const ANTHROPIC_MODEL = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-5';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

interface Component {
  name: string;
  matchedDishId?: string;
  portion: 'small' | 'medium' | 'large';
  gramsEstimate?: number;
  confidence: number;
}

interface RecognitionResponse {
  components: Component[];
  notes?: string;
}

const SYSTEM = `You are a nutrition-vision model calibrated for mixed home-cooked Indian meals.
Given a photo of a plate, identify each distinct component. For each:
- Return a short, canonical name (e.g. "roti", "dal tadka", "paneer butter masala").
- Choose portion size — small, medium, or large — relative to typical Indian serving norms:
  - roti/chapati small ~30g, medium ~45g, large ~60g
  - rice small ~100g, medium ~150g, large ~220g
  - gravy dish (dal, paneer, curry) small ~100g, medium ~150g, large ~200g
- Optionally provide gramsEstimate if you have unusual confidence.
- Emit a confidence in [0, 1]. Be honest: dim lighting, occluded plate, unusual bowls → lower confidence.

You must respond ONLY by calling the emit_recognition tool. Never emit calorie numbers — those are computed downstream from the dish reference table.`;

const TOOL = {
  name: 'emit_recognition',
  description: 'Emit the identified plate components.',
  input_schema: {
    type: 'object',
    properties: {
      components: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            portion: { type: 'string', enum: ['small', 'medium', 'large'] },
            gramsEstimate: { type: 'number' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
          },
          required: ['name', 'portion', 'confidence'],
        },
      },
      notes: { type: 'string' },
    },
    required: ['components'],
  },
} as const;

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  if (!ANTHROPIC_API_KEY) return json({ error: 'ANTHROPIC_API_KEY not configured' }, 500);

  let body: { imageBase64?: string; mimeType?: string };
  try { body = await req.json(); } catch { return json({ error: 'invalid json' }, 400); }
  const { imageBase64, mimeType = 'image/jpeg' } = body;
  if (!imageBase64) return json({ error: 'imageBase64 required' }, 400);

  const anthropicRes = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
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
          { type: 'text', text: 'What is on this plate?' },
        ],
      }],
    }),
  });

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text();
    return json({ error: 'anthropic_error', detail: errText }, 502);
  }

  const payload = await anthropicRes.json();
  const toolUse = payload?.content?.find((b: { type: string }) => b.type === 'tool_use');
  if (!toolUse?.input?.components) {
    return json({ error: 'no_tool_use', detail: payload }, 502);
  }

  // NB: on the mobile client, run the payload through the Zod schema in
  // @thali/shared before touching state — trust the boundary, not the model.
  const response: RecognitionResponse = toolUse.input;
  return json(response, 200);
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
