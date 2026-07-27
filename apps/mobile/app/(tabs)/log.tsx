import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';

export default function Log() {
  return (
    <Screen>
      <Text style={{ ...type.title, color: colors.text }}>Log a meal</Text>
      <Text style={{ ...type.body, color: colors.textMuted }}>
        Take a photo and let Thali identify the plate, or add it manually against the dish library.
      </Text>

      <Card tone="alt" style={{ gap: spacing.sm }}>
        <Text style={{ ...type.heading, color: colors.text }}>📸 Photo (coming next)</Text>
        <Text style={{ ...type.body, color: colors.textMuted }}>
          Camera + AI recognition are wired behind a feature flag — enable once your Supabase project + Anthropic key are set.
        </Text>
        <Button
          label="Try camera"
          variant="ghost"
          onPress={() => Alert.alert('Not yet', 'Camera flow is P1. For v1, use “Add manually” — the flag/alternative UX runs there too.')}
        />
      </Card>

      <Card style={{ gap: spacing.sm }}>
        <Text style={{ ...type.heading, color: colors.text }}>✍️ Add manually</Text>
        <Text style={{ ...type.body, color: colors.textMuted }}>
          Pick dishes from the ~30-dish library and set portions. The pre-log flag will trigger the same way as the photo flow.
        </Text>
        <Button label="Add manually" onPress={() => router.push('/add/manual')} />
      </Card>

      <View style={{ flex: 1 }} />
    </Screen>
  );
}

const _s = StyleSheet.create({});
