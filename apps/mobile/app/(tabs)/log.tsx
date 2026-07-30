import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { colors, gradients, spacing, type as t } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card, HeroCard } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { Pill } from '../../src/components/Pill';
import { Screen } from '../../src/components/Screen';
import { isRecognitionEnabled } from '../../src/supabase';

export default function Log() {
  const live = isRecognitionEnabled();
  return (
    <Screen bg="parchment">
      <View style={{ gap: 4 }}>
        <Text style={[t.captionBold, { color: colors.textMuted }]}>Log a meal</Text>
        <Text style={[t.h1, { color: colors.text }]}>What did you just eat?</Text>
      </View>

      <HeroCard
        gradient={gradients.brand}
        style={{ gap: spacing.md }}
      >
        <Pill label={live ? 'AI vision' : 'Demo mode'} icon="sparkles" tone="brand" />
        <Text style={[t.h2, { color: '#fff' }]}>Snap the plate.</Text>
        <Text style={{ ...t.body, color: 'rgba(255,255,255,0.85)' }}>
          Thali reads mixed home-cooked plates like dal-sabzi-roti thalis — the meals Cal AI misjudges.
          Ranges + confidence, not fake precision.
        </Text>
        <View style={{ height: spacing.sm }} />
        <Button
          label="Open camera"
          variant="glass"
          size="md"
          full={false}
          icon={<Icon name="camera" size={16} color={colors.text} />}
          onPress={() => router.push('/add/camera')}
        />
      </HeroCard>

      <Card tone="lavender" padding="lg" style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="wand" size={18} color={colors.brand} />
          </View>
          <Text style={[t.h3, { color: colors.text }]}>Add manually</Text>
        </View>
        <Text style={[t.body, { color: colors.textMuted }]}>
          Pick from the ~35-dish reference table with portion sliders. Runs the same pre-log flag as the camera flow.
        </Text>
        <Button
          label="Browse dishes"
          variant="ghost"
          size="md"
          full={false}
          trailing={<Icon name="arrowR" size={16} color={colors.text} />}
          onPress={() => router.push('/add/manual')}
        />
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <QuickAction icon="clock" label="Recent" onPress={() => router.push('/(tabs)/history')} />
        <QuickAction icon="bookmark" label="Favorites" />
      </View>
    </Screen>
  );
}

function QuickAction({ icon, label, onPress }: { icon: import('../../src/components/Icon').IconName; label: string; onPress?: () => void }) {
  return (
    <Card onPress={onPress} interactive padding="lg" style={{ flex: 1, alignItems: 'center', gap: 6 }}>
      <View style={{
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} color={colors.text} />
      </View>
      <Text style={[t.bodyBold, { color: colors.text }]}>{label}</Text>
    </Card>
  );
}
