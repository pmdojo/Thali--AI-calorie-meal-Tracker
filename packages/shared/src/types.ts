export type Sex = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type Goal = 'lose' | 'maintain' | 'gain';

export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'eggetarian'
  | 'non_vegetarian';

export interface UserProfile {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
  goal: Goal;
  targetWeightKg?: number;
  dietary: DietaryPreference;
  allergies?: string[];
  usualFoods?: string[];   // ids of what's usually on the plate (dal, sabzi, rice, roti, fish, chicken…)
  conditions?: string[];   // ids of medical conditions (pcos, diabetes, high_bp…)
}

export interface MacroSplit {
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface DailyBudget {
  kcal: number;
  macros: MacroSplit;
  tdee: number;
  bmr: number;
  weeklyRateKgPerWeek: number;
}

export type Portion = 'small' | 'medium' | 'large';

export interface DishRef {
  id: string;
  name: string;
  category:
    | 'grain'
    | 'legume'
    | 'sabzi'
    | 'protein'
    | 'rice'
    | 'snack'
    | 'sweet'
    | 'drink'
    | 'salad';
  vegetarian: boolean;
  portionGrams: Record<Portion, number>;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
}

export interface MealComponent {
  dishId: string;
  portion: Portion;
  gramsOverride?: number;
  confidence: number;
}

export interface EstimatedRange {
  low: number;
  mid: number;
  high: number;
}

export interface MealEstimate {
  components: MealComponent[];
  kcal: EstimatedRange;
  protein: EstimatedRange;
  carbs: EstimatedRange;
  fat: EstimatedRange;
  fiber: EstimatedRange;
  overallConfidence: number;
}
