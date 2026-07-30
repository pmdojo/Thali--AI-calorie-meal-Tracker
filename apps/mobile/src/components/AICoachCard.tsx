import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Icon } from './Icon';
import { Button } from './Button';

interface Props {
  headline: string;
  body: string;
  tag?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

// The AI Coach card — a gradient, animated hero surface with a subtle
// aurora shimmer that reads as "AI is thinking about you".
export function AICoachCard({ headline, body, tag = 'AI Coach', ctaLabel, onCta }: Props) {
  return (
    <View style={[styles.wrap, shadow.brandGlow]}>
      <LinearGradient
        colors={['#1D1A3D', '#3F2F7A', '#7A5AF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Aurora sheen */}
      <MotiView
        from={{ translateX: -120, opacity: 0.35 }}
        animate={{ translateX: 220, opacity: 0.55 }}
        transition={{ type: 'timing', duration: 3800, loop: true, repeatReverse: true }}
        style={styles.aurora}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </MotiView>

      <View style={{ gap: spacing.md }}>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Icon name="sparkles" size={12} color="#fff" strokeWidth={2.4} />
            <Text style={styles.tagLabel}>{tag}</Text>
          </View>
        </View>

        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.body}>{body}</Text>

        {ctaLabel && (
          <View style={{ alignItems: 'flex-start', marginTop: spacing.xs }}>
            <Button
              label={ctaLabel}
              onPress={onCta}
              variant="glass"
              size="sm"
              full={false}
              trailing={<Icon name="arrowR" size={16} color={colors.text} />}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xxl,
    padding: spacing.xl,
    overflow: 'hidden',
    minHeight: 160,
  },
  aurora: {
    position: 'absolute',
    top: -40, bottom: -40, left: 0,
    width: 180,
    transform: [{ rotate: '18deg' }],
  },
  tagRow: { flexDirection: 'row' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  tagLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  headline: { ...t.h2, color: '#fff' },
  body:     { ...t.body, color: 'rgba(255,255,255,0.82)' },
});
