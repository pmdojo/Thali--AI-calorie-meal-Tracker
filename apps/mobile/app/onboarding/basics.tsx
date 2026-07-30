import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { colors, spacing, type as t } from '@thali/ui-tokens';
import type { Sex } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Choice, Field } from '../../src/components/Field';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { ThaliPrompt } from '../../src/components/Thali';
import { useOnboardingDraft } from '../../src/onboardingDraft';

export default function Basics() {
  const draft = useOnboardingDraft();
  const [age, setAge] = useState(draft.age?.toString() ?? '');
  const [heightCm, setHeightCm] = useState(draft.heightCm?.toString() ?? '');
  const [weightKg, setWeightKg] = useState(draft.weightKg?.toString() ?? '');
  const [sex, setSex] = useState<Sex | undefined>(draft.sex);

  const canNext = age && heightCm && weightKg && sex;

  return (
    <Screen bg="parchment" footer={
      <Button
        label="Continue"
        disabled={!canNext}
        trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
        onPress={() => {
          useOnboardingDraft.setState({ age: Number(age), heightCm: Number(heightCm), weightKg: Number(weightKg), sex });
          router.push('/onboarding/activity');
        }}
      />
    }>
      <ThaliPrompt step={2} total={6} message="Tell me a bit about you — this sets your calorie budget." />

      <View style={{ gap: 6, marginTop: spacing.xs }}>
        <Text style={[t.captionBold, { color: colors.textMuted }]}>Sex</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Choice label="Female" selected={sex === 'female'} onPress={() => setSex('female')} />
          <Choice label="Male"   selected={sex === 'male'}   onPress={() => setSex('male')} />
        </View>
      </View>

      <View style={{ gap: spacing.md }}>
        <Field label="Age" value={age} onChangeText={setAge} keyboardType="numeric" suffix="years" />
        <Field label="Height" value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" suffix="cm" />
        <Field label="Weight" value={weightKg} onChangeText={setWeightKg} keyboardType="decimal-pad" suffix="kg" />
      </View>
    </Screen>
  );
}
