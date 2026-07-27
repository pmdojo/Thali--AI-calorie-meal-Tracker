import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import type { Sex } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Choice, Field } from '../../src/components/Field';
import { Screen } from '../../src/components/Screen';
import { useOnboardingDraft } from '../../src/onboardingDraft';

export default function Basics() {
  const draft = useOnboardingDraft();
  const [age, setAge] = useState(draft.age?.toString() ?? '');
  const [heightCm, setHeightCm] = useState(draft.heightCm?.toString() ?? '');
  const [weightKg, setWeightKg] = useState(draft.weightKg?.toString() ?? '');
  const [sex, setSex] = useState<Sex | undefined>(draft.sex);

  const canNext = age && heightCm && weightKg && sex;

  return (
    <Screen>
      <Text style={styles.title}>The basics</Text>
      <Text style={styles.sub}>These four numbers set your daily calorie budget. You can change them any time.</Text>

      <View style={{ gap: spacing.md }}>
        <Text style={styles.label}>Sex</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Choice label="Female" selected={sex === 'female'} onPress={() => setSex('female')} />
          <Choice label="Male" selected={sex === 'male'} onPress={() => setSex('male')} />
        </View>

        <Field label="Age (years)" value={age} onChangeText={setAge} keyboardType="numeric" />
        <Field label="Height (cm)" value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" />
        <Field label="Weight (kg)" value={weightKg} onChangeText={setWeightKg} keyboardType="decimal-pad" />
      </View>

      <View style={{ flex: 1 }} />

      <Button
        label="Continue"
        disabled={!canNext}
        onPress={() => {
          useOnboardingDraft.setState({
            age: Number(age),
            heightCm: Number(heightCm),
            weightKg: Number(weightKg),
            sex,
          });
          router.push('/onboarding/activity');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...type.title, color: colors.text },
  sub: { ...type.body, color: colors.textMuted },
  label: { ...type.caption, color: colors.textMuted },
});
