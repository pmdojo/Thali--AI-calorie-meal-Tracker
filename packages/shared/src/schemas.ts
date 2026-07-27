import { z } from 'zod';

// Structured output emitted by the Claude vision call. Deliberately narrow:
// the model identifies dishes + portion; the *nutrition math* happens on our side
// against the dish reference table so accuracy is a data problem, not a prompt problem.
export const RecognizedComponent = z.object({
  name: z.string().min(1),
  matchedDishId: z.string().optional(),
  portion: z.enum(['small', 'medium', 'large']),
  gramsEstimate: z.number().positive().optional(),
  confidence: z.number().min(0).max(1),
});
export type RecognizedComponent = z.infer<typeof RecognizedComponent>;

export const RecognitionResponse = z.object({
  components: z.array(RecognizedComponent).min(1),
  notes: z.string().optional(),
});
export type RecognitionResponse = z.infer<typeof RecognitionResponse>;
