import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { spacing } from '@thali/ui-tokens';
import type { Goal } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Field, OptionCard } from '../../src/components/Field';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { ThaliPrompt } from '../../src/components/Thali';
import { useOnboardingDraft } from '../../src/onboardingDraft';

const OPTIONS: Array<{ id: Goal; title: string; sub: string; emoji: string }> = [
  { id: 'lose',     title: 'Lose fat',     sub: 'Slow and sustainable — ~0.5% / week', emoji: '🔥' },
  { id: 'gain',     title: 'Build muscle', sub: 'Modest surplus with a protein floor',  emoji: '💪' },
  { id: 'maintain', title: 'Maintain',     sub: 'Hold steady, eat with awareness',      emoji: '⚖️' },
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
          router.push('/onboarding/basics');
        }}
      />
    }>
      <ThaliPrompt step={1} total={6} message="First — what's your goal?" />

      <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            title={o.title}
            subtitle={o.sub}
            selected={goal === o.id}
            onPress={() => setGoal(o.id)}
            icon={<Text style={{ fontSize: 20 }}>{o.emoji}</Text>}
          />
        ))}
      </View>

      {needsTarget && (
        <Field label="Target weight" value={target} onChangeText={setTarget} keyboardType="decimal-pad" suffix="kg" />
      )}
    </Screen>
  );
}
