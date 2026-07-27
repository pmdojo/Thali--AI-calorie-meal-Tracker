import { getDish, estimateMeal } from './dishes';
import type { MealComponent, MealEstimate, Portion } from './types';
import altData from '../data/alternatives.v1.json';

interface AltRule { matchDishId: string; swapToDishId: string; reason: string; }

const RULES: AltRule[] = altData.rules;
const DOWNSHIFT: Record<Portion, Portion> = altData.portionDownshift as Record<Portion, Portion>;

export interface Alternative {
  components: MealComponent[];
  estimate: MealEstimate;
  savedKcal: number;
  description: string;
  reason: string;
}

// Strategy: for the heaviest component (largest kcal contribution), try a rule swap;
// if no rule fires, downshift its portion one step. Return the first alternative that
// meaningfully saves calories (≥60 kcal), else null.
export function suggestAlternative(components: MealComponent[], currentKcalMid: number): Alternative | null {
  if (components.length === 0) return null;

  const heaviest = [...components]
    .map((c, i) => {
      const single = estimateMeal([c]);
      return { c, i, kcal: single.kcal.mid };
    })
    .sort((a, b) => b.kcal - a.kcal)[0]!;

  const rule = RULES.find((r) => r.matchDishId === heaviest.c.dishId);

  if (rule) {
    const swapped = replaceAt(components, heaviest.i, { ...heaviest.c, dishId: rule.swapToDishId });
    const est = estimateMeal(swapped);
    const saved = currentKcalMid - est.kcal.mid;
    if (saved >= 60) {
      const to = getDish(rule.swapToDishId);
      const from = getDish(heaviest.c.dishId);
      return {
        components: swapped,
        estimate: est,
        savedKcal: Math.round(saved),
        description: from && to ? `${from.name} → ${to.name}` : rule.reason,
        reason: rule.reason,
      };
    }
  }

  // fallback: portion downshift
  const nextPortion = DOWNSHIFT[heaviest.c.portion];
  if (nextPortion !== heaviest.c.portion) {
    const downshifted = replaceAt(components, heaviest.i, { ...heaviest.c, portion: nextPortion });
    const est = estimateMeal(downshifted);
    const saved = currentKcalMid - est.kcal.mid;
    if (saved >= 60) {
      const from = getDish(heaviest.c.dishId);
      return {
        components: downshifted,
        estimate: est,
        savedKcal: Math.round(saved),
        description: from ? `${from.name}: smaller portion` : 'Smaller portion',
        reason: 'Same dish, one portion size smaller.',
      };
    }
  }

  return null;
}

function replaceAt<T>(arr: T[], i: number, v: T): T[] {
  const out = arr.slice();
  out[i] = v;
  return out;
}
