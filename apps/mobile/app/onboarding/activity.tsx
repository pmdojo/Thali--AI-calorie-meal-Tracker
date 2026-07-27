import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import type { ActivityLevel } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { useOnboardingDraft } from '../../src/onboardingDraft';
import { Card } from '../../src/components/Card';

const OPTIONS: Array<{ id: ActivityLevel; label: string; sub: string }> = [
  { id: 'sedentary',   label: 'Sedentary',        sub: 'Desk job, little exercise' },
  { id: 'light',       label: 'Lightly active',   sub: '1–3 workouts / week' },
  { id: 'moderate',    label: 'Moderately active', sub: '3–5 workouts / week' },
  { id: 'active',      label: 'Very active',      sub: '6–7 workouts / week' },
  { id: 'very_active', label: 'Athlete',          sub: 'Twice-a-day training' },
];

export default function Activity() {
  const activity = useOnboardingDraft((s) => s.activity);
  return (
    <Screen>
      <Text style={styles.title}>How active are you?</Text>
      <Text style={styles.sub}>Includes both workouts and general movement.</Text>

      <View style={{ gap: spacing.sm }}>
        {OPTIONS.map((o) => (
          <Card
            key={o.id}
            tone={activity === o.id ? 'alt' : 'surface'}
            style={{
              borderWidth: activity === o.id ? 2 : 0,
              borderColor: colors.brand,
            }}
          >
            <Text
              onPress={() => useOnboardingDraft.setState({ activity: o.id })}
              style={{ ...type.bodyBold, color: colors.text }}
            >
              {o.label}
            </Text>
            <Text style={{ ...type.caption, color: colors.textMuted }}>{o.sub}</Text>
          </Card>
        ))}
      </View>

      <View style={{ flex: 1 }} />
      <Button label="Continue" disabled={!activity} onPress={() => router.push('/onboarding/goal')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...type.title, color: colors.text },
  sub: { ...type.body, color: colors.textMuted },
});
