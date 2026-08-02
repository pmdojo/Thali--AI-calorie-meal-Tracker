import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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
  usualFoods?: string[];
  conditions?: string[];
  reset: () => void;
}

// Persisted so a page refresh mid-onboarding doesn't wipe progress and strand
// the user on the review step with a disabled "Start tracking" button. The
// final review step copies this into the main persisted store, then resets.
export const useOnboardingDraft = create<Draft>()(
  persist(
    (set) => ({
      reset: () => set({
        age: undefined, sex: undefined, heightCm: undefined, weightKg: undefined,
        activity: undefined, goal: undefined, targetWeightKg: undefined,
        dietary: undefined, allergies: undefined, usualFoods: undefined, conditions: undefined,
      }),
    }),
    {
      name: 'thali-onboarding-draft-v1',
      storage: createJSONStorage(() => AsyncStorage),
      // don't persist the reset() method
      partialize: ({ reset, ...rest }) => rest,
    },
  ),
);
