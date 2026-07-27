import { describe, it, expect } from 'vitest';
import { getDish, estimateMeal, findDishByName } from './dishes';

describe('dish reference', () => {
  it('has stable ids', () => {
    expect(getDish('paneer_butter')?.name).toMatch(/paneer/i);
    expect(getDish('roti')?.category).toBe('grain');
  });

  it('finds by name loosely', () => {
    expect(findDishByName('Paneer Butter Masala')?.id).toBe('paneer_butter');
    expect(findDishByName('roti')?.id).toBe('roti');
  });
});

describe('estimateMeal', () => {
  it('2 rotis (medium each) + paneer butter (medium) + salad → plausible kcal range', () => {
    const meal = estimateMeal([
      { dishId: 'roti', portion: 'medium', confidence: 0.9 },
      { dishId: 'roti', portion: 'medium', confidence: 0.9 },
      { dishId: 'paneer_butter', portion: 'medium', confidence: 0.85 },
      { dishId: 'kachumber', portion: 'small', confidence: 0.8 },
    ]);
    // Rough: 2 rotis @ 45g × 2.97 ≈ 267 + paneer 150g × 2.65 ≈ 397 + salad 60g × 0.30 ≈ 18 ≈ 682 kcal
    expect(meal.kcal.mid).toBeGreaterThan(600);
    expect(meal.kcal.mid).toBeLessThan(800);
    expect(meal.kcal.low).toBeLessThan(meal.kcal.mid);
    expect(meal.kcal.high).toBeGreaterThan(meal.kcal.mid);
  });

  it('confidence propagates to overallConfidence', () => {
    const meal = estimateMeal([
      { dishId: 'roti', portion: 'medium', confidence: 0.9 },
      { dishId: 'paneer_butter', portion: 'medium', confidence: 0.6 },
    ]);
    expect(meal.overallConfidence).toBeCloseTo(0.75, 2);
  });

  it('ignores unknown dish ids gracefully', () => {
    const meal = estimateMeal([{ dishId: 'no_such_dish', portion: 'medium', confidence: 1 }]);
    expect(meal.kcal.mid).toBe(0);
  });
});
