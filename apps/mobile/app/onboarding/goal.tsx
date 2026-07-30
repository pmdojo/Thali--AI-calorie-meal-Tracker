import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { spacing } from '@thali/ui-tokens';
import type { Goal } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Field, OptionCard } from '../../src/components/Field';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { StepHeader } from '../../src/components/StepHeader';
import { useOnboardingDraft } from '../../src/onboardingDraft';

const OPTIONS: Array<{ id: Goal; title: string; sub: string; icon: import('../../src/components/Icon').IconName }> = [
  { id: 'lose',     title: 'Lose weight',   sub: 'Slow, sustainable — around 0.5% / week', icon: 'arrowDown' },
  { id: 'maintain', title: 'Maintain',      sub: 'Same weight, week after week',           icon: 'target' },
  { id: 'gain',     title: 'Gain muscle',   sub: 'Modest surplus with a protein floor',     icon: 'arrowUp' },
];

export default function GoalScreen() {
  const draft = useOnboardingDraft();
  const [goal, setGoal] = useState<Goal | undefined>(draft.goal);
  const [target, setTarget] = useState(draft.targetWeightKg?.toString() ?? '');
  const needsTarget = goal === 'lose' || goal === 'gain';
  const canNext = !!goal && (!needsTarget || !!target);

  return (
    <Screen bg="parchment" footer={
      <Button
        label="Continue"
        disabled={!canNext}
        trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
        onPress={() => {
          useOnboardingDraft.setState({ goal, targetWeightKg: needsTarget ? Number(target) : undefined });
          router.push('/onboarding/diet');
        }}
      />
    }>
      <StepHeader
        step={3} total={5}
        title="What's the goal?"
        subtitle="Thali sets a sustainable rate — no crash diets."
      />

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            title={o.title}
            subtitle={o.sub}
            selected={goal === o.id}
            onPress={() => setGoal(o.id)}
            icon={<Icon name={o.icon} size={20} color={goal === o.id ? '#fff' : '#5B3FE0'} strokeWidth={2} />}
          />
        ))}
      </View>

      {needsTarget && (
        <Field
          label="Target weight"
          value={target}
          onChangeText={setTarget}
          keyboardType="decimal-pad"
          suffix="kg"
        />
      )}
    </Screen>
  );
}
