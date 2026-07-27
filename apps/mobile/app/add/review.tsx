import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type } from '@thali/ui-tokens';
import {
  estimateMeal,
  evaluateFlag,
  suggestAlternative,
  type MealComponent,
} from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { remainingKcalToday, useStore, type MealType } from '../../src/store';

export default function Review() {
  const params = useLocalSearchParams<{ mealType: MealType; payload: string }>();
  const budget = useStore((s) => s.budget);
  const logs   = useStore((s) => s.logs);
  const addMeal = useStore((s) => s.addMeal);
  const remaining = remainingKcalToday(budget, logs);

  const [components, setComponents] = useState<MealComponent[]>(() => {
    try { return JSON.parse(params.payload ?? '[]'); } catch { return []; }
  });

  const estimate = useMemo(() => estimateMeal(components), [components]);
  const flag = useMemo(() => evaluateFlag(estimate, remaining), [estimate, remaining]);
  const alt = useMemo(
    () => (flag.flagged ? suggestAlternative(components, estimate.kcal.mid) : null),
    [flag.flagged, components, estimate.kcal.mid],
  );

  const [flagOpen, setFlagOpen] = useState(flag.flagged);

  const commit = (which: 'original' | 'alternative') => {
    const finalComponents = which === 'alternative' && alt ? alt.components : components;
    addMeal({
      mealType: (params.mealType as MealType) ?? 'snack',
      components: finalComponents,
      source: 'manual',
    });
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <Text style={{ ...type.title, color: colors.text }}>Ready to log?</Text>

      <Card style={{ gap: spacing.sm }}>
        <Text style={{ ...type.heading, color: colors.text }}>Estimate</Text>
        <Text style={{ ...type.display, color: colors.brand }}>
          {estimate.kcal.low}–{estimate.kcal.high}
          <Text style={{ ...type.body, color: colors.textMuted }}>  kcal</Text>
        </Text>
        <Text style={{ ...type.caption, color: colors.textMuted }}>
          Ranges, not point estimates. Wider band = lower confidence.
        </Text>
        <Text style={{ ...type.body, color: colors.text, marginTop: spacing.sm }}>
          P {estimate.protein.mid}g · C {estimate.carbs.mid}g · F {estimate.fat.mid}g
        </Text>
      </Card>

      <Card tone="alt">
        <Text style={{ ...type.caption, color: colors.textMuted }}>Against today's budget</Text>
        <Text style={{ ...type.heading, color: colors.text }}>
          {estimate.kcal.mid} of {remaining} kcal remaining
        </Text>
        <Text style={{ ...type.caption, color: colors.textMuted, marginTop: 4 }}>
          {Math.round(flag.budgetShare * 100)}% of what's left today
        </Text>
      </Card>

      <View style={{ flex: 1 }} />

      <Button label="Log this meal" onPress={() => (flag.flagged ? setFlagOpen(true) : commit('original'))} />
      <Button label="Back to edit" variant="ghost" onPress={() => router.back()} />

      <FlagModal
        open={flagOpen}
        onClose={() => setFlagOpen(false)}
        reasons={flag.reasons}
        currentKcalMid={estimate.kcal.mid}
        remaining={remaining}
        alt={alt}
        onLogAnyway={() => { setFlagOpen(false); commit('original'); }}
        onSwap={() => { setFlagOpen(false); commit('alternative'); }}
      />
    </Screen>
  );
}

function FlagModal({
  open, onClose, reasons, currentKcalMid, remaining, alt, onLogAnyway, onSwap,
}: {
  open: boolean;
  onClose: () => void;
  reasons: string[];
  currentKcalMid: number;
  remaining: number;
  alt: ReturnType<typeof suggestAlternative>;
  onLogAnyway: () => void;
  onSwap: () => void;
}) {
  const reasonCopy = reasons.includes('exceeds_budget_share')
    ? `This meal is ~${Math.round((currentKcalMid / remaining) * 100)}% of what's left in your day.`
    : reasons.includes('low_confidence')
      ? "We're not fully sure on portion sizes here."
      : 'The estimate has a wide range.';

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={{ ...type.heading, color: colors.text }}>Heads up 👀</Text>
          <Text style={{ ...type.body, color: colors.text }}>{reasonCopy}</Text>

          {alt ? (
            <View style={styles.altBox}>
              <Text style={{ ...type.caption, color: colors.textMuted }}>One swap</Text>
              <Text style={{ ...type.bodyBold, color: colors.text }}>{alt.description}</Text>
              <Text style={{ ...type.caption, color: colors.textMuted }}>{alt.reason}</Text>
              <Text style={{ ...type.bodyBold, color: colors.success, marginTop: 6 }}>
                Saves ≈ {alt.savedKcal} kcal
              </Text>
            </View>
          ) : (
            <Text style={{ ...type.caption, color: colors.textMuted }}>
              No lighter swap in the library for this plate.
            </Text>
          )}

          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            {alt && <Button label={`Swap → ${alt.description}`} onPress={onSwap} />}
            <Button label="Log anyway" variant="ghost" onPress={onLogAnyway} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  altBox: {
    backgroundColor: colors.surfaceAlt,
    padding: spacing.md,
    borderRadius: radii.md,
    gap: 4,
  },
});
