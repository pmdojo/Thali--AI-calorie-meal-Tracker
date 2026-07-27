import { create } from 'zustand';
import type { ActivityLevel, DietaryPreference, Goal, Sex } from '@thali/shared';

interface Draft {
  age?: number;
  sex?: Sex;
  heightCm?: number;
  weightKg?: number;
  activity?: ActivityLevel;
  goal?: Goal;
  targetWeightKg?: number;
  dietary?: DietaryPreference;
  allergies?: string[];
  reset: () => void;
}

// In-memory only — a step's confirm writes to the persisted store.
export const useOnboardingDraft = create<Draft>((set) => ({
  reset: () => set({ age: undefined, sex: undefined, heightCm: undefined, weightKg: undefined, activity: undefined, goal: undefined, targetWeightKg: undefined, dietary: undefined, allergies: undefined }),
}));
