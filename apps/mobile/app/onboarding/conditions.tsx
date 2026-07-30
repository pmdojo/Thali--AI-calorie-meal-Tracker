import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { colors, spacing, type as t } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmojiChip } from '../../src/components/EmojiChip';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { ThaliPrompt } from '../../src/components/Thali';
import { useOnboardingDraft } from '../../src/onboardingDraft';

const CONDITIONS = [
  { id: 'pcos',     emoji: '🩺', label: 'PCOS' },
  { id: 'diabetes', emoji: '🩸', label: 'Diabetes' },
  { id: 'high_bp',  emoji: '❤️', label: 'High BP' },
  { id: 'thyroid',  emoji: '🦋', label: 'Thyroid' },
  { id: 'cholesterol', emoji: '🫀', label: 'Cholesterol' },
];

export default function Conditions() {
  const draft = useOnboardingDraft();
  const [picked, setPicked] = useState<string[]>(draft.conditions ?? []);
  const [none, setNone] = useState<boolean>(draft.conditions?.length === 0 && draft.conditions !== undefined);

  const toggle = (id: string) => {
    setNone(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };
  const pickNone = () => { setNone(true); setPicked([]); };

  const canNext = none || picked.length > 0;

  return (
    <Screen bg="parchment" footer={
      <Button
        label="Continue"
        disabled={!canNext}
        trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
        onPress={() => {
          useOnboardingDraft.setState({ conditions: picked });
          router.push('/onboarding/review');
        }}
      />
    }>
      <ThaliPrompt step={5} total={6} message="Anything I should keep in mind? This stays private." />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs }}>
        {CONDITIONS.map((c) => (
          <EmojiChip
            key={c.id}
            emoji={c.emoji}
            label={c.label}
            selected={picked.includes(c.id)}
            onPress={() => toggle(c.id)}
          />
        ))}
        <EmojiChip label="None of these" selected={none} onPress={pickNone} />
      </View>

      <Card tone="lavender" padding="lg" style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', marginTop: spacing.sm }}>
        <Icon name="info" size={16} color={colors.brand} />
        <Text style={[t.caption, { color: colors.textMuted, flex: 1 }]}>
          Thali isn't medical advice. We use this only to gently flavour suggestions — e.g. steering toward lower-GI swaps if you note diabetes.
        </Text>
      </Card>
    </Screen>
  );
}
