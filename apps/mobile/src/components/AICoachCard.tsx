import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Icon } from './Icon';

interface Props {
  headline: string;
  body: string;
  tag?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

// A pulsing concentric orb — a calm, sophisticated "AI is thinking" avatar.
function Orb() {
  return (
    <View style={styles.orbWrap}>
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.5, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ type: 'timing', duration: 2600, loop: true, delay: i * 700 }}
          style={[styles.orbRing]}
        />
      ))}
      <View style={styles.orbCore}>
        <Icon name="sparkles" size={16} color="#fff" strokeWidth={2.2} />
      </View>
    </View>
  );
}

// Sophisticated AI assistant card — deep glass gradient, subtle grain of light,
// an orb avatar, and refined typography.
export function AICoachCard({ headline, body, tag = 'AI Nutritionist', ctaLabel, onCta }: Props) {
  return (
    <View style={[styles.wrap, shadow.brandGlow]}>
      <LinearGradient
        colors={['#25406E', '#3E64A0', '#5A8AF0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* soft light bloom, top-right */}
      <View style={styles.bloom} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Orb />
        <View style={{ flex: 1 }}>
          <Text style={styles.tag}>{tag.toUpperCase()}</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.online}>Analysing your day</Text>
          </View>
        </View>
      </View>

      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.body}>{body}</Text>

      {ctaLabel && (
        <MotiView
          from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={{ alignSelf: 'flex-start', marginTop: spacing.xs }}
        >
          <View style={styles.ctaWrap}>
            <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFillObject} />
            <Text style={styles.ctaText} onPress={onCta}>{ctaLabel}</Text>
            <Icon name="arrowR" size={15} color="#fff" strokeWidth={2.4} />
          </View>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xxl,
    padding: spacing.xl,
    overflow: 'hidden',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  bloom: {
    position: 'absolute', top: -60, right: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(143,192,255,0.5)',
    // soft blur via shadow
    shadowColor: '#8FC0FF', shadowOpacity: 0.9, shadowRadius: 60, shadowOffset: { width: 0, height: 0 },
    opacity: 0.5,
  },
  orbWrap: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  orbRing: {
    position: 'absolute', width: 46, height: 46, borderRadius: 23,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)',
  },
  orbCore: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  tag: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, color: '#fff' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7CFFC4' },
  online: { ...t.caption, color: 'rgba(255,255,255,0.72)' },
  headline: { ...t.h2, color: '#fff', marginTop: spacing.xs },
  body: { ...t.body, color: 'rgba(255,255,255,0.82)' },
  ctaWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 11, paddingHorizontal: 18, borderRadius: radii.pill, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  ctaText: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
});
