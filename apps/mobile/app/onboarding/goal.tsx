import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import type { Goal } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Choice, Field } from '../../src/components/Field';
import { Screen } from '../../src/components/Screen';
import { useOnboardingDraft } from '../../src/onboardingDraft';

export default function GoalScreen() {
  const draft = useOnboardingDraft();
  const [goal, setGoal] = useState<Goal | undefined>(draft.goal);
  const [target, setTarget] = useState(draft.targetWeightKg?.toString() ?? '');
  const needsTarget = goal === 'lose' || goal === 'gain';
  const canNext = !!goal && (!needsTarget || !!target);

  return (
    <Screen>
      <Text style={styles.title}>What's the goal?</Text>
      <Text style={styles.sub}>We'll set a sustainable rate: about 0.5% of your bodyweight per week.</Text>

      <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
        <Choice label="Lose weight" selected={goal === 'lose'} onPress={() => setGoal('lose')} />
        <Choice label="Maintain" selected={goal === 'maintain'} onPress={() => setGoal('maintain')} />
        <Choice label="Gain muscle" selected={goal === 'gain'} onPress={() => setGoal('gain')} />
      </View>

      {needsTarget && (
        <Field label="Target weight (kg)" value={target} onChangeText={setTarget} keyboardType="decimal-pad" />
      )}

      <View style={{ flex: 1 }} />
      <Button
        label="Continue"
        disabled={!canNext}
        onPress={() => {
          useOnboardingDraft.setState({
            goal,
            targetWeightKg: needsTarget ? Number(target) : undefined,
          });
          router.push('/onboarding/diet');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...type.title, color: colors.text },
  sub: { ...type.body, color: colors.textMuted },
});
