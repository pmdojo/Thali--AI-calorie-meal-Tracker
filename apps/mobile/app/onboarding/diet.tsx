import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { spacing } from '@thali/ui-tokens';
import type { DietaryPreference } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Field, OptionCard } from '../../src/components/Field';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { StepHeader } from '../../src/components/StepHeader';
import { useOnboardingDraft } from '../../src/onboardingDraft';

const OPTIONS: Array<{ id: DietaryPreference; label: string; sub: string; icon: import('../../src/components/Icon').IconName }> = [
  { id: 'vegetarian',     label: 'Vegetarian',     sub: 'Dairy is in',                  icon: 'leaf' },
  { id: 'vegan',          label: 'Vegan',          sub: 'No dairy, no eggs',            icon: 'leaf' },
  { id: 'eggetarian',     label: 'Eggetarian',     sub: 'Eggs and dairy are in',        icon: 'leaf' },
  { id: 'non_vegetarian', label: 'Non-vegetarian', sub: 'Everything is on the table',   icon: 'utensils' },
];

export default function Diet() {
  const draft = useOnboardingDraft();
  const [dietary, setDietary] = useState<DietaryPreference | undefined>(draft.dietary);
  const [allergies, setAllergies] = useState<string>(draft.allergies?.join(', ') ?? '');

  return (
    <Screen bg="parchment" footer={
      <Button
        label="Continue"
        disabled={!dietary}
        trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
        onPress={() => {
          useOnboardingDraft.setState({
            dietary,
            allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
          });
          router.push('/onboarding/review');
        }}
      />
    }>
      <StepHeader
        step={4} total={5}
        title="What do you eat?"
        subtitle="We'll only suggest swaps you'd actually consider."
      />

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            title={o.label}
            subtitle={o.sub}
            selected={dietary === o.id}
            onPress={() => setDietary(o.id)}
            icon={<Icon name={o.icon} size={20} color={dietary === o.id ? '#fff' : '#5B3FE0'} strokeWidth={2} />}
          />
        ))}
      </View>

      <Field
        label="Allergies (optional)"
        value={allergies}
        onChangeText={setAllergies}
        placeholder="peanuts, shellfish…"
      />
    </Screen>
  );
}
