import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import type { DietaryPreference } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Choice, Field } from '../../src/components/Field';
import { Screen } from '../../src/components/Screen';
import { useOnboardingDraft } from '../../src/onboardingDraft';

const OPTIONS: Array<{ id: DietaryPreference; label: string }> = [
  { id: 'vegetarian',     label: 'Vegetarian' },
  { id: 'vegan',          label: 'Vegan' },
  { id: 'eggetarian',     label: 'Eggetarian' },
  { id: 'non_vegetarian', label: 'Non-vegetarian' },
];

export default function Diet() {
  const draft = useOnboardingDraft();
  const [dietary, setDietary] = useState<DietaryPreference | undefined>(draft.dietary);
  const [allergies, setAllergies] = useState<string>(draft.allergies?.join(', ') ?? '');

  return (
    <Screen>
      <Text style={styles.title}>Any dietary preference?</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {OPTIONS.map((o) => (
          <Choice key={o.id} label={o.label} selected={dietary === o.id} onPress={() => setDietary(o.id)} />
        ))}
      </View>

      <Field
        label="Allergies (comma-separated, optional)"
        value={allergies}
        onChangeText={setAllergies}
        placeholder="e.g. peanuts, shellfish"
      />

      <View style={{ flex: 1 }} />
      <Button
        label="Continue"
        disabled={!dietary}
        onPress={() => {
          useOnboardingDraft.setState({
            dietary,
            allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
          });
          router.push('/onboarding/review');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...type.title, color: colors.text },
});
