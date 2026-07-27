import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import { computeDailyBudget, type UserProfile } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { useStore } from '../../src/store';
import { useOnboardingDraft } from '../../src/onboardingDraft';

export default function Review() {
  const draft = useOnboardingDraft();

  const profile: UserProfile | null = useMemo(() => {
    const { age, sex, heightCm, weightKg, activity, goal, dietary, targetWeightKg, allergies } = draft;
    if (!age || !sex || !heightCm || !weightKg || !activity || !goal || !dietary) return null;
    return { age, sex, heightCm, weightKg, activity, goal, dietary, targetWeightKg, allergies };
  }, [draft]);

  const budget = profile ? computeDailyBudget(profile) : null;

  return (
    <Screen>
      <Text style={styles.title}>Your daily plan</Text>
      <Text style={styles.sub}>Based on Mifflin-St Jeor + your activity level. You can adjust anytime in Profile.</Text>

      {budget && (
        <Card tone="alt" style={{ alignItems: 'center', gap: spacing.xs }}>
          <Text style={{ ...type.caption, color: colors.textMuted }}>Daily budget</Text>
          <Text style={{ ...type.display, color: colors.brand }}>{budget.kcal} kcal</Text>
          <Text style={{ ...type.caption, color: colors.textMuted }}>
            BMR {budget.bmr} · TDEE {budget.tdee}
          </Text>
        </Card>
      )}

      {budget && (
        <Card style={{ gap: spacing.sm }}>
          <Text style={{ ...type.heading, color: colors.text }}>Macros</Text>
          <Text style={{ ...type.body, color: colors.text }}>
            Protein <Text style={styles.b}>{budget.macros.proteinG}g</Text> · Carbs{' '}
            <Text style={styles.b}>{budget.macros.carbsG}g</Text> · Fat{' '}
            <Text style={styles.b}>{budget.macros.fatG}g</Text>
          </Text>
          {budget.weeklyRateKgPerWeek !== 0 && (
            <Text style={{ ...type.caption, color: colors.textMuted }}>
              At this pace, ≈ {Math.abs(budget.weeklyRateKgPerWeek)} kg/week{' '}
              {budget.weeklyRateKgPerWeek < 0 ? 'lost' : 'gained'}.
            </Text>
          )}
        </Card>
      )}

      <View style={{ flex: 1 }} />

      <Button
        label="Start tracking"
        disabled={!profile}
        onPress={() => {
          if (!profile) return;
          useStore.getState().setProfile(profile);
          useOnboardingDraft.getState().reset();
          router.replace('/(tabs)');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...type.title, color: colors.text },
  sub: { ...type.body, color: colors.textMuted },
  b: { fontWeight: '700' },
});
