import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { spacing } from '@thali/ui-tokens';
import type { ActivityLevel } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Icon } from '../../src/components/Icon';
import { OptionCard } from '../../src/components/Field';
import { Screen } from '../../src/components/Screen';
import { ThaliPrompt } from '../../src/components/Thali';
import { useOnboardingDraft } from '../../src/onboardingDraft';

const OPTIONS: Array<{ id: ActivityLevel; label: string; sub: string; emoji: string }> = [
  { id: 'sedentary',   label: 'Sedentary',        sub: 'Desk job · little exercise', emoji: '🪑' },
  { id: 'light',       label: 'Lightly active',   sub: '1–3 workouts a week',         emoji: '🚶' },
  { id: 'moderate',    label: 'Moderately active', sub: '3–5 workouts a week',         emoji: '🏃' },
  { id: 'active',      label: 'Very active',      sub: '6–7 workouts a week',         emoji: '🔥' },
  { id: 'very_active', label: 'Athlete',          sub: 'Twice-a-day training',        emoji: '🏆' },
];

export default function Activity() {
  const activity = useOnboardingDraft((s) => s.activity);
  return (
    <Screen bg="parchment" footer={
      <Button
        label="Continue"
        disabled={!activity}
        trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
        onPress={() => router.push('/onboarding/plate')}
      />
    }>
      <ThaliPrompt step={3} total={6} message="How active are you on a normal week?" />

      <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            title={o.label}
            subtitle={o.sub}
            selected={activity === o.id}
            onPress={() => useOnboardingDraft.setState({ activity: o.id })}
            icon={<Text style={{ fontSize: 20 }}>{o.emoji}</Text>}
          />
        ))}
      </View>
    </Screen>
  );
}
