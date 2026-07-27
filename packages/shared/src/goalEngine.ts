import type {
  ActivityLevel,
  DailyBudget,
  Goal,
  MacroSplit,
  Sex,
  UserProfile,
} from './types';

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Mifflin-St Jeor
export function bmr(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function tdee(sex: Sex, weightKg: number, heightCm: number, age: number, activity: ActivityLevel): number {
  return bmr(sex, weightKg, heightCm, age) * ACTIVITY_MULTIPLIER[activity];
}

// Sustainable rate: 0.5% bodyweight/week for lose/gain by default.
// 1 kg fat ≈ 7700 kcal → daily delta = (rateKg * 7700) / 7.
function dailyDeltaKcal(goal: Goal, weightKg: number): { delta: number; rateKgPerWeek: number } {
  if (goal === 'maintain') return { delta: 0, rateKgPerWeek: 0 };
  const rateKgPerWeek = weightKg * 0.005; // 0.5%/week
  const delta = (rateKgPerWeek * 7700) / 7;
  return {
    delta: goal === 'lose' ? -delta : delta,
    rateKgPerWeek: goal === 'lose' ? -rateKgPerWeek : rateKgPerWeek,
  };
}

// Balanced macro split by default: 30 % protein, 40 % carbs, 30 % fat.
// Protein floor of 1.6 g / kg for lose/gain to preserve lean mass.
export function macroSplit(kcal: number, weightKg: number, goal: Goal): MacroSplit {
  const proteinFloorG = goal === 'maintain' ? 1.2 * weightKg : 1.6 * weightKg;
  const proteinFromPct = (kcal * 0.3) / 4;
  const proteinG = Math.max(proteinFloorG, proteinFromPct);
  const fatG = (kcal * 0.3) / 9;
  const remainingKcal = kcal - proteinG * 4 - fatG * 9;
  const carbsG = Math.max(0, remainingKcal / 4);
  return {
    proteinG: Math.round(proteinG),
    carbsG: Math.round(carbsG),
    fatG: Math.round(fatG),
  };
}

export function computeDailyBudget(profile: UserProfile): DailyBudget {
  const b = bmr(profile.sex, profile.weightKg, profile.heightCm, profile.age);
  const t = tdee(profile.sex, profile.weightKg, profile.heightCm, profile.age, profile.activity);
  const { delta, rateKgPerWeek } = dailyDeltaKcal(profile.goal, profile.weightKg);
  const kcal = Math.round(t + delta);
  return {
    kcal,
    tdee: Math.round(t),
    bmr: Math.round(b),
    weeklyRateKgPerWeek: Number(rateKgPerWeek.toFixed(2)),
    macros: macroSplit(kcal, profile.weightKg, profile.goal),
  };
}
