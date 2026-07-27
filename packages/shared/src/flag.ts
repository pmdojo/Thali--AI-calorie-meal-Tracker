import type { MealEstimate } from './types';

export interface FlagDecision {
  flagged: boolean;
  reasons: Array<'exceeds_budget_share' | 'low_confidence' | 'wide_range'>;
  budgetShare: number;
}

export interface FlagConfig {
  budgetShareThreshold: number; // default 0.40 (40 % of remaining budget)
  confidenceThreshold: number;  // default 0.70
  rangeSpreadThreshold: number; // default 0.30 (kcal range span / mid)
}

export const DEFAULT_FLAG_CONFIG: FlagConfig = {
  budgetShareThreshold: 0.40,
  confidenceThreshold: 0.70,
  rangeSpreadThreshold: 0.30,
};

export function evaluateFlag(estimate: MealEstimate, remainingKcal: number, config: FlagConfig = DEFAULT_FLAG_CONFIG): FlagDecision {
  const reasons: FlagDecision['reasons'] = [];
  const budgetShare = remainingKcal > 0 ? estimate.kcal.mid / remainingKcal : Infinity;
  if (budgetShare >= config.budgetShareThreshold) reasons.push('exceeds_budget_share');
  if (estimate.overallConfidence > 0 && estimate.overallConfidence < config.confidenceThreshold) reasons.push('low_confidence');
  const spread = estimate.kcal.mid > 0 ? (estimate.kcal.high - estimate.kcal.low) / estimate.kcal.mid : 0;
  if (spread >= config.rangeSpreadThreshold) reasons.push('wide_range');
  return { flagged: reasons.length > 0, reasons, budgetShare };
}
