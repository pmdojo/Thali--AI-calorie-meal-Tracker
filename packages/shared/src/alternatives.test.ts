import { describe, it, expect } from 'vitest';
import { estimateMeal } from './dishes';
import { suggestAlternative } from './alternatives';

describe('suggestAlternative', () => {
  it('swaps paneer butter → paneer bhurji and saves calories', () => {
    const components = [
      { dishId: 'roti', portion: 'medium', confidence: 0.9 } as const,
      { dishId: 'roti', portion: 'medium', confidence: 0.9 } as const,
      { dishId: 'paneer_butter', portion: 'large', confidence: 0.85 } as const,
    ];
    const est = estimateMeal(components);
    const alt = suggestAlternative(components, est.kcal.mid);
    expect(alt).not.toBeNull();
    expect(alt!.description).toMatch(/paneer bhurji/i);
    expect(alt!.savedKcal).toBeGreaterThan(60);
    expect(alt!.estimate.kcal.mid).toBeLessThan(est.kcal.mid);
  });

  it('falls back to portion downshift when no rule fires', () => {
    const components = [
      { dishId: 'jeera_rice', portion: 'large', confidence: 0.9 } as const,
    ];
    const est = estimateMeal(components);
    const alt = suggestAlternative(components, est.kcal.mid);
    expect(alt).not.toBeNull();
    expect(alt!.description).toMatch(/smaller portion/i);
  });

  it('returns null when nothing meaningful can be saved', () => {
    const components = [{ dishId: 'kachumber', portion: 'small', confidence: 0.9 } as const];
    const est = estimateMeal(components);
    const alt = suggestAlternative(components, est.kcal.mid);
    expect(alt).toBeNull();
  });
});
