import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { useStore } from '../../src/store';

export default function Profile() {
  const { profile, budget, reset } = useStore();

  return (
    <Screen>
      <Text style={{ ...type.title, color: colors.text }}>Profile</Text>

      {profile && budget && (
        <Card style={{ gap: 4 }}>
          <Text style={{ ...type.heading, color: colors.text }}>Your plan</Text>
          <Text style={{ ...type.body, color: colors.text }}>
            {profile.sex} · {profile.age}y · {profile.heightCm}cm · {profile.weightKg}kg
          </Text>
          <Text style={{ ...type.body, color: colors.text }}>
            {profile.activity.replace('_', ' ')} · {profile.goal} · {profile.dietary.replace('_', ' ')}
          </Text>
          <Text style={{ ...type.bodyBold, color: colors.brand, marginTop: spacing.sm }}>
            {budget.kcal} kcal/day · {budget.macros.proteinG}g P · {budget.macros.carbsG}g C · {budget.macros.fatG}g F
          </Text>
        </Card>
      )}

      <Card tone="alt" style={{ gap: spacing.sm }}>
        <Text style={{ ...type.heading, color: colors.text }}>Coming next</Text>
        <Text style={{ ...type.body, color: colors.textMuted }}>
          Camera + AI recognition, Supabase sync, health integrations. All P1 — the deterministic core ships first.
        </Text>
      </Card>

      <View style={{ flex: 1 }} />

      <Button
        label="Reset (start over)"
        variant="ghost"
        onPress={() =>
          Alert.alert('Reset everything?', 'This wipes your profile and all logs on this device.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reset',
              style: 'destructive',
              onPress: () => { reset(); router.replace('/onboarding/welcome'); },
            },
          ])
        }
      />
    </Screen>
  );
}

const _s = StyleSheet.create({});
