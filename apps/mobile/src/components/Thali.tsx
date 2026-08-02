import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { ClayFood } from './ClayFood';

// Thali's face — a gradient disc with a friendly bowl mascot that gently bobs.
export function ThaliMascot({ size = 56 }: { size?: number }) {
  return (
    <MotiView
      from={{ translateY: 0 }}
      animate={{ translateY: -3 }}
      transition={{ type: 'timing', duration: 1800, loop: true, repeatReverse: true }}
      style={[
        { width: size, height: size, borderRadius: size / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
        shadow.brandGlow,
      ]}
    >
      <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
      <View style={{ zIndex: 1 }}>
        <ClayFood id="thali" size={size * 1.02} />
      </View>
    </MotiView>
  );
}

// A chat-style prompt header: progress dots + Thali avatar + a speech bubble
// that slides in. Used at the top of every onboarding step so the whole flow
// feels like a conversation.
export function ThaliPrompt({
  message, step, total, delay = 0,
}: { message: string; step?: number; total?: number; delay?: number }) {
  return (
    <View style={{ gap: spacing.lg }}>
      {typeof step === 'number' && typeof total === 'number' && (
        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <MotiView
              key={i}
              animate={{
                width: i === step - 1 ? 26 : 8,
                backgroundColor: i < step ? colors.brand : colors.surfaceAlt,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              style={styles.dot}
            />
          ))}
        </View>
      )}

      <View style={styles.row}>
        <ThaliMascot size={48} />
        <MotiView
          from={{ opacity: 0, translateY: 8, scale: 0.96 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220, delay }}
          style={styles.bubble}
        >
          <View style={styles.tail} />
          <Text style={[t.h3, { color: colors.text }]}>{message}</Text>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  bubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderTopLeftRadius: radii.xs,
    padding: spacing.lg,
    ...shadow.card,
  },
  tail: {
    position: 'absolute',
    left: -6, top: 14,
    width: 14, height: 14,
    backgroundColor: colors.surface,
    transform: [{ rotate: '45deg' }],
  },
});
