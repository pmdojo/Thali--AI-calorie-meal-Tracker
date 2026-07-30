import { router } from 'expo-router';
import { MotiView } from 'moti';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { ThaliMascot } from '../../src/components/Thali';

const LINES = [
  '👋  Hi! I’m Thali.',
  'I’ll build your nutrition plan — calibrated for how you actually eat.',
  'Dal, sabzi, roti, rice… not just plated Western meals. Ready?',
];

export default function Welcome() {
  return (
    <Screen bg="sunrise" padding="hero">
      <View style={{ flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.huge }}>
        {/* Mascot */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <ThaliMascot size={92} />
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <Text style={[t.tiny, { color: colors.brand, letterSpacing: 3, marginTop: spacing.md }]}>YOUR NUTRITION COACH</Text>
          </MotiView>
        </View>

        {/* Chat bubbles, staggered */}
        <View style={{ gap: spacing.md }}>
          {LINES.map((line, i) => (
            <MotiView
              key={i}
              from={{ opacity: 0, translateY: 14, scale: 0.96 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 18, stiffness: 220, delay: 350 + i * 550 }}
              style={[styles.bubble, i === 0 && styles.first]}
            >
              <Text style={[i === 0 ? t.h2 : t.bodyLg, { color: colors.text }]}>{line}</Text>
            </MotiView>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 350 + LINES.length * 550 }}
          style={{ gap: spacing.sm, paddingBottom: spacing.xl }}
        >
          <Button
            label="Let’s build it"
            trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
            onPress={() => router.push('/onboarding/goal')}
          />
          <Text style={styles.footnote}>Takes about a minute. No sign-up, no cost.</Text>
        </MotiView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderTopLeftRadius: radii.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadow.card,
  },
  first: {
    backgroundColor: colors.brandTint,
  },
  footnote: { ...t.caption, color: colors.textMuted, textAlign: 'center' },
});
