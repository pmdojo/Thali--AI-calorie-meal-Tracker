import { router } from 'expo-router';
import { View } from 'react-native';
import { spacing } from '@thali/ui-tokens';
import type { ActivityLevel } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Icon } from '../../src/components/Icon';
import { OptionCard } from '../../src/components/Field';
import { Screen } from '../../src/components/Screen';
import { StepHeader } from '../../src/components/StepHeader';
import { useOnboardingDraft } from '../../src/onboardingDraft';

const OPTIONS: Array<{ id: ActivityLevel; label: string; sub: string; icon: import('../../src/components/Icon').IconName }> = [
  { id: 'sedentary',   label: 'Sedentary',        sub: 'Desk job · little exercise',   icon: 'moon' },
  { id: 'light',       label: 'Lightly active',   sub: '1–3 workouts a week',           icon: 'sun' },
  { id: 'moderate',    label: 'Moderately active', sub: '3–5 workouts a week',           icon: 'activity' },
  { id: 'active',      label: 'Very active',      sub: '6–7 workouts a week',           icon: 'flame' },
  { id: 'very_active', label: 'Athlete',          sub: 'Twice-a-day training',          icon: 'award' },
];

export default function Activity() {
  const activity = useOnboardingDraft((s) => s.activity);
  return (
    <Screen bg="parchment" footer={
      <Button
        label="Continue"
        disabled={!activity}
        trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
        onPress={() => router.push('/onboarding/goal')}
      />
    }>
      <StepHeader
        step={2} total={5}
        title="How active are you?"
        subtitle="Includes workouts and everyday movement."
      />

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            title={o.label}
            subtitle={o.sub}
            selected={activity === o.id}
            onPress={() => useOnboardingDraft.setState({ activity: o.id })}
            icon={<Icon name={o.icon} size={20} color={activity === o.id ? '#fff' : '#5B3FE0'} strokeWidth={2} />}
          />
        ))}
      </View>
    </Screen>
  );
}
