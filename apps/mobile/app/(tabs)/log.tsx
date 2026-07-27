import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { isRecognitionEnabled } from '../../src/supabase';

export default function Log() {
  const live = isRecognitionEnabled();
  return (
    <Screen>
      <Text style={{ ...type.title, color: colors.text }}>Log a meal</Text>
      <Text style={{ ...type.body, color: colors.textMuted }}>
        Snap the plate and let Thali identify it, or add manually against the dish library.
      </Text>

      <Card style={{ gap: spacing.sm }}>
        <Text style={{ ...type.heading, color: colors.text }}>📸 Photo</Text>
        <Text style={{ ...type.body, color: colors.textMuted }}>
          {live
            ? 'Camera + Claude vision are live. Recognition returns dish identity + portion — nutrition math happens client-side against the dish library.'
            : 'Mock mode: no Supabase / Anthropic keys set, so recognition returns a plausible sample plate. The rest of the flow (flag, swap, ledger) runs for real.'}
        </Text>
        <Button label="Open camera" onPress={() => router.push('/add/camera')} />
      </Card>

      <Card tone="alt" style={{ gap: spacing.sm }}>
        <Text style={{ ...type.heading, color: colors.text }}>✍️ Add manually</Text>
        <Text style={{ ...type.body, color: colors.textMuted }}>
          Pick dishes from the library and set portions. Triggers the same pre-log flag as the photo flow.
        </Text>
        <Button label="Add manually" variant="ghost" onPress={() => router.push('/add/manual')} />
      </Card>

      <View style={{ flex: 1 }} />
    </Screen>
  );
}
