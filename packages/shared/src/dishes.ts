import type { DishRef, EstimatedRange, MealComponent, MealEstimate, Portion } from './types';
import dishData from '../data/dishes.v1.json';

const DISHES: DishRef[] = (dishData.dishes as unknown as DishRef[]);
const BY_ID = new Map(DISHES.map((d) => [d.id, d]));

export function allDishes(): DishRef[] {
  return DISHES;
}

export function getDish(id: string): DishRef | undefined {
  return BY_ID.get(id);
}

export function findDishByName(name: string): DishRef | undefined {
  const n = name.toLowerCase();
  return DISHES.find((d) => d.name.toLowerCase() === n)
    ?? DISHES.find((d) => d.name.toLowerCase().includes(n))
    ?? DISHES.find((d) => n.includes(d.name.toLowerCase()));
}

export function gramsFor(dish: DishRef, portion: Portion, override?: number): number {
  return override ?? dish.portionGrams[portion];
}

// ±15% band applied to point estimates — the honesty commitment from the PRD.
function bandFromPoint(point: number, spread = 0.15): EstimatedRange {
  return {
    low: Math.round(point * (1 - spread)),
    mid: Math.round(point),
    high: Math.round(point * (1 + spread)),
  };
}

function addRange(a: EstimatedRange, b: EstimatedRange): EstimatedRange {
  return { low: a.low + b.low, mid: a.mid + b.mid, high: a.high + b.high };
}

export function estimateMeal(components: MealComponent[]): MealEstimate {
  let kcal: EstimatedRange = { low: 0, mid: 0, high: 0 };
  let protein: EstimatedRange = { low: 0, mid: 0, high: 0 };
  let carbs: EstimatedRange = { low: 0, mid: 0, high: 0 };
  let fat: EstimatedRange = { low: 0, mid: 0, high: 0 };
  const confidences: number[] = [];

  for (const c of components) {
    const dish = getDish(c.dishId);
    if (!dish) continue;
    const g = gramsFor(dish, c.portion, c.gramsOverride);
    const factor = g / 100;
    const spread = 0.15 + (1 - c.confidence) * 0.15; // lower confidence → wider band
    kcal    = addRange(kcal,    bandFromPoint(dish.kcalPer100g   * factor, spread));
    protein = addRange(protein, bandFromPoint(dish.proteinPer100g * factor, spread));
    carbs   = addRange(carbs,   bandFromPoint(dish.carbsPer100g   * factor, spread));
    fat     = addRange(fat,     bandFromPoint(dish.fatPer100g     * factor, spread));
    confidences.push(c.confidence);
  }

  const overallConfidence = confidences.length === 0
    ? 0
    : confidences.reduce((s, v) => s + v, 0) / confidences.length;

  return { components, kcal, protein, carbs, fat, overallConfidence };
}
