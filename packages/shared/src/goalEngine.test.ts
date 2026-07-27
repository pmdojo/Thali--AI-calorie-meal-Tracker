import { describe, it, expect } from 'vitest';
import { bmr, tdee, computeDailyBudget, macroSplit } from './goalEngine';

describe('bmr — Mifflin-St Jeor', () => {
  it('male 30y 80kg 180cm ≈ 1780', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(bmr('male', 80, 180, 30)).toBeCloseTo(1780, 0);
  });

  it('female 28y 60kg 165cm ≈ 1345.25', () => {
    // 10*60 + 6.25*165 - 5*28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25
    expect(bmr('female', 60, 165, 28)).toBeCloseTo(1330.25, 2);
  });
});

describe('tdee — activity multiplier', () => {
  it('sedentary male 30y 80kg 180cm ≈ 2136', () => {
    expect(tdee('male', 80, 180, 30, 'sedentary')).toBeCloseTo(1780 * 1.2, 0);
  });

  it('moderate female 28y 60kg 165cm applies 1.55', () => {
    expect(tdee('female', 60, 165, 28, 'moderate')).toBeCloseTo(1330.25 * 1.55, 2);
  });
});

describe('computeDailyBudget', () => {
  it('maintain returns tdee', () => {
    const b = computeDailyBudget({
      age: 30, sex: 'male', heightCm: 180, weightKg: 80, activity: 'moderate', goal: 'maintain', dietary: 'vegetarian',
    });
    expect(b.kcal).toBe(b.tdee);
  });

  it('lose applies negative delta at ~0.5%/week rate', () => {
    const b = computeDailyBudget({
      age: 30, sex: 'male', heightCm: 180, weightKg: 80, activity: 'moderate', goal: 'lose', dietary: 'vegetarian',
    });
    // 0.5% of 80kg = 0.4kg/week → daily delta ≈ 440 kcal
    expect(b.tdee - b.kcal).toBeCloseTo(440, 0);
    expect(b.weeklyRateKgPerWeek).toBe(-0.4);
  });

  it('gain applies positive delta', () => {
    const b = computeDailyBudget({
      age: 25, sex: 'female', heightCm: 165, weightKg: 55, activity: 'active', goal: 'gain', dietary: 'eggetarian',
    });
    expect(b.kcal - b.tdee).toBeGreaterThan(200);
    expect(b.weeklyRateKgPerWeek).toBeGreaterThan(0);
  });
});

describe('macroSplit', () => {
  it('enforces 1.6 g/kg protein floor on lose', () => {
    const s = macroSplit(1600, 80, 'lose');
    expect(s.proteinG).toBeGreaterThanOrEqual(Math.round(80 * 1.6));
  });

  it('kcal from macros ≈ target kcal', () => {
    const kcal = 2200;
    const s = macroSplit(kcal, 70, 'maintain');
    const derived = s.proteinG * 4 + s.carbsG * 4 + s.fatG * 9;
    expect(Math.abs(derived - kcal)).toBeLessThan(15);
  });
});
