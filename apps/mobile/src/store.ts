import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  computeDailyBudget,
  estimateMeal,
  type DailyBudget,
  type MealComponent,
  type MealEstimate,
  type UserProfile,
} from '@thali/shared';
import { track } from './telemetry';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealLog {
  id: string;
  loggedAt: string; // ISO
  mealType: MealType;
  components: MealComponent[];
  estimate: MealEstimate;
  note?: string;
  source: 'manual' | 'photo';
}

interface State {
  profile: UserProfile | null;
  budget: DailyBudget | null;
  onboardingDone: boolean;
  logs: MealLog[];

  setProfile: (p: UserProfile) => void;
  addMeal: (input: Omit<MealLog, 'id' | 'loggedAt' | 'estimate'> & { loggedAt?: string }) => MealLog;
  deleteMeal: (id: string) => void;
  reset: () => void;
}

const todayKey = (d = new Date()): string => d.toISOString().slice(0, 10);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: null,
      budget: null,
      onboardingDone: false,
      logs: [],

      setProfile: (p) => {
        const first = !get().onboardingDone;
        set({ profile: p, budget: computeDailyBudget(p), onboardingDone: true });
        if (first) track('onboarding_complete', { goal: p.goal });
      },

      addMeal: (input) => {
        const estimate = estimateMeal(input.components);
        const meal: MealLog = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          loggedAt: input.loggedAt ?? new Date().toISOString(),
          mealType: input.mealType,
          components: input.components,
          estimate,
          note: input.note,
          source: input.source,
        };
        set({ logs: [meal, ...get().logs] });
        track('meal_logged', {
          mealType: meal.mealType,
          source: meal.source,
          components: meal.components.length,
          kcalMid: meal.estimate.kcal.mid,
        });
        return meal;
      },

      deleteMeal: (id) => set({ logs: get().logs.filter((m) => m.id !== id) }),

      reset: () => set({ profile: null, budget: null, onboardingDone: false, logs: [] }),
    }),
    {
      name: 'thali-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// ── selectors ──────────────────────────────────────────────────────────────

export function todaysLogs(logs: MealLog[], d = new Date()): MealLog[] {
  const key = todayKey(d);
  return logs.filter((m) => m.loggedAt.startsWith(key));
}

export function todaysKcal(logs: MealLog[], d = new Date()): number {
  return todaysLogs(logs, d).reduce((s, m) => s + m.estimate.kcal.mid, 0);
}

export function todaysMacros(logs: MealLog[], d = new Date()): { protein: number; carbs: number; fat: number } {
  return todaysLogs(logs, d).reduce(
    (a, m) => ({
      protein: a.protein + m.estimate.protein.mid,
      carbs: a.carbs + m.estimate.carbs.mid,
      fat: a.fat + m.estimate.fat.mid,
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );
}

export function remainingKcalToday(budget: DailyBudget | null, logs: MealLog[]): number {
  if (!budget) return 0;
  return Math.max(0, budget.kcal - todaysKcal(logs));
}

// Smart-streak phrasing: "6 of the last 7 days"
export function streakSummary(logs: MealLog[], days = 7): { logged: number; total: number } {
  const now = new Date();
  let logged = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    if (todaysLogs(logs, d).length > 0) logged++;
  }
  return { logged, total: days };
}

export function dailyStatusForRange(
  logs: MealLog[],
  budget: DailyBudget | null,
  days = 7,
): Array<{ date: string; kcal: number; status: 'none' | 'under' | 'ok' | 'slightly_over' | 'over' }> {
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayLogs = todaysLogs(logs, d);
    const kcal = dayLogs.reduce((s, m) => s + m.estimate.kcal.mid, 0);
    let status: 'none' | 'under' | 'ok' | 'slightly_over' | 'over' = 'none';
    if (dayLogs.length === 0) status = 'none';
    else if (!budget) status = 'ok';
    else if (kcal > budget.kcal * 1.15) status = 'over';
    else if (kcal > budget.kcal * 1.02) status = 'slightly_over';
    else if (kcal < budget.kcal * 0.7) status = 'under';
    else status = 'ok';
    out.push({ date: todayKey(d), kcal, status });
  }
  return out;
}
