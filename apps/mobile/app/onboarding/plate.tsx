import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { spacing } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { ClayFood, type ClayId } from '../../src/components/ClayFood';
import { EmojiChip } from '../../src/components/EmojiChip';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { ThaliPrompt } from '../../src/components/Thali';
import { VisualThali } from '../../src/components/VisualThali';
import { useOnboardingDraft } from '../../src/onboardingDraft';

const FOODS: { id: ClayId; label: string }[] = [
  { id: 'dal',     label: 'Dal' },
  { id: 'sabzi',   label: 'Sabzi' },
  { id: 'rice',    label: 'Rice' },
  { id: 'roti',    label: 'Roti' },
  { id: 'curd',    label: 'Curd' },
  { id: 'paneer',  label: 'Paneer' },
  { id: 'egg',     label: 'Egg' },
  { id: 'fish',    label: 'Fish' },
  { id: 'chicken', label: 'Chicken' },
];

export default function Plate() {
  const draft = useOnboardingDraft();
  const [picked, setPicked] = useState<string[]>(draft.usualFoods ?? []);
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // Dim the visual thali segments the user hasn't picked (once they've picked anything).
  const has = (id: string) => picked.length === 0 || picked.includes(id);
  const segments = [
    { id: 'rice',   clay: 'rice' as const,   label: 'Rice',   bg: '#FBF1DD', ring: '#EACA85', dim: !has('rice') },
    { id: 'sabzi',  clay: 'sabzi' as const,  label: 'Sabzi',  bg: '#EAF7EF', ring: '#B7E1C7', dim: !has('sabzi') },
    { id: 'roti',   clay: 'roti' as const,   label: 'Roti',   bg: '#FDECDE', ring: '#FBCFB5', dim: !has('roti') },
    { id: 'dal',    clay: 'dal' as const,    label: 'Dal',    bg: '#F5F1FB', ring: '#C7BAFC', dim: !has('dal') },
    { id: 'curd',   clay: 'curd' as const,   label: 'Curd',   bg: '#E9F1FB', ring: '#B9D2ED', dim: !has('curd') },
    { id: 'extras', clay: 'extras' as const, label: 'Extras', bg: '#FBF1DD', ring: '#EACA85', dim: false },
  ];

  return (
    <Screen bg="parchment" footer={
      <Button
        label={picked.length ? 'Continue' : 'Pick a few first'}
        disabled={picked.length === 0}
        trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
        onPress={() => {
          useOnboardingDraft.setState({ usualFoods: picked });
          router.push('/onboarding/conditions');
        }}
      />
    }>
      <ThaliPrompt step={4} total={6} message="What's usually on your plate? Tap all that apply." />

      <View style={{ alignItems: 'center', marginVertical: spacing.sm }}>
        <VisualThali size={230} segments={segments} caption={picked.length ? `${picked.length} on your plate` : 'Tap below to build it'} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' }}>
        {FOODS.map((f) => (
          <EmojiChip
            key={f.id}
            icon={<ClayFood id={f.id} size={22} />}
            label={f.label}
            selected={picked.includes(f.id)}
            onPress={() => toggle(f.id)}
          />
        ))}
      </View>
    </Screen>
  );
}
