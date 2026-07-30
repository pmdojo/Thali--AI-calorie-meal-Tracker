import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { computeDailyBudget, type DietaryPreference, type UserProfile } from '@thali/shared';
import { colors, gradients, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { Pill } from '../../src/components/Pill';
import { Screen } from '../../src/components/Screen';
import { ThaliPrompt } from '../../src/components/Thali';
import { VisualThali } from '../../src/components/VisualThali';
import { useOnboardingDraft } from '../../src/onboardingDraft';
import { useStore } from '../../src/store';

const NON_VEG = ['fish', 'chicken', 'egg'];

export default function Review() {
  const draft = useOnboardingDraft();

  const profile: UserProfile | null = useMemo(() => {
    const { age, sex, heightCm, weightKg, activity, goal, targetWeightKg, usualFoods, conditions } = draft;
    if (!age || !sex || !heightCm || !weightKg || !activity || !goal) return null;
    const dietary: DietaryPreference = (usualFoods ?? []).some((f) => NON_VEG.includes(f))
      ? 'non_vegetarian'
      : 'vegetarian';
    return { age, sex, heightCm, weightKg, activity, goal, targetWeightKg, dietary, usualFoods, conditions };
  }, [draft]);

  const budget = profile ? computeDailyBudget(profile) : null;

  return (
    <Screen bg="parchment" footer={
      <Button
        label="Start tracking"
        disabled={!profile}
        icon={<Icon name="sparkles" size={18} color="#fff" strokeWidth={2.4} />}
        onPress={() => {
          if (!profile) return;
          useStore.getState().setProfile(profile);
          useOnboardingDraft.getState().reset();
          router.replace('/(tabs)');
        }}
      />
    }>
      <ThaliPrompt step={6} total={6} message="Done! Here's the plan I built for you." />

      {/* Visual thali */}
      <View style={{ alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.lg }}>
        <VisualThali size={280} caption="Your balanced thali" />
      </View>

      {/* Budget hero */}
      {budget && (
        <MotiView
          from={{ opacity: 0, translateY: 12, scale: 0.96 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220, delay: 300 }}
        >
          <View style={styles.hero}>
            <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
            <Text style={styles.heroLabel}>Daily budget</Text>
            <Text style={styles.heroKcal}>{budget.kcal}<Text style={styles.heroUnit}> kcal</Text></Text>
            <Text style={styles.heroFoot}>BMR {budget.bmr} · TDEE {budget.tdee}</Text>
          </View>
        </MotiView>
      )}

      {/* Macros */}
      {budget && (
        <Card padding="lg" elevation="card" style={{ gap: spacing.md }}>
          <Text style={[t.h3, { color: colors.text }]}>Macros</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <MacroBlock label="Protein" value={budget.macros.proteinG} color={colors.protein} />
            <MacroBlock label="Carbs"   value={budget.macros.carbsG}   color={colors.carbs} />
            <MacroBlock label="Fat"     value={budget.macros.fatG}     color={colors.fat} />
          </View>
          {budget.weeklyRateKgPerWeek !== 0 && (
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 4 }}>
              <Pill
                label={`${Math.abs(budget.weeklyRateKgPerWeek)} kg / week`}
                icon={budget.weeklyRateKgPerWeek < 0 ? 'arrowDown' : 'arrowUp'}
                tone={budget.weeklyRateKgPerWeek < 0 ? 'success' : 'accent'}
              />
              <Pill label="Sustainable" icon="check" tone="brand" />
            </View>
          )}
        </Card>
      )}

      {/* Personalisation summary */}
      {profile && (
        <Card tone="lavender" padding="lg" style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="sparkles" size={16} color={colors.brand} />
            <Text style={[t.captionBold, { color: colors.text }]}>Tuned to you</Text>
          </View>
          <Text style={[t.caption, { color: colors.textMuted }]}>
            {profile.dietary === 'non_vegetarian' ? 'Non-veg friendly' : 'Vegetarian'} · calibrated for {(profile.usualFoods ?? []).length || 'your'} everyday foods
            {profile.conditions && profile.conditions.length > 0
              ? ` · mindful of ${profile.conditions.join(', ').replace(/_/g, ' ')}`
              : ''}.
          </Text>
        </Card>
      )}
    </Screen>
  );
}

function MacroBlock({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
        <Text style={[t.tiny, { color: colors.textMuted, textTransform: 'uppercase' }]}>{label}</Text>
      </View>
      <Text style={[t.h2, { color: colors.text, marginTop: 2 }]}>{value}<Text style={[t.captionBold, { color: colors.textMuted }]}>g</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadow.brandGlow,
  },
  heroLabel: { color: 'rgba(255,255,255,0.85)', ...t.tiny, textTransform: 'uppercase' },
  heroKcal:  { color: '#fff', fontSize: 64, fontWeight: '800', letterSpacing: -2.5, marginTop: 4 },
  heroUnit:  { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  heroFoot:  { color: 'rgba(255,255,255,0.75)', ...t.caption, marginTop: 4 },
});
