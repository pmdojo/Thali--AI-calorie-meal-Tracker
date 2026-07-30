import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radii, shadow, type as t } from '@thali/ui-tokens';
import { Icon, IconName } from './Icon';

type Tone = 'carbs' | 'protein' | 'fat';

const TONE: Record<Tone, { grad: [string, string]; icon: IconName }> = {
  carbs:   { grad: ['#8B72FF', '#6A4BF0'], icon: 'zap' },
  protein: { grad: ['#4FA3F0', '#2E7BD6'], icon: 'activity' },
  fat:     { grad: ['#F7A24B', '#F26B3A'], icon: 'droplets' },
};

export function MacroPill({
  tone, label, value, goal, index = 0,
}: { tone: Tone; label: string; value: number; goal: number; index?: number }) {
  const T = TONE[tone];
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 380, delay: 120 + index * 80 }}
      style={[styles.wrap, shadow.card]}
    >
      <LinearGradient colors={T.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
      <View style={styles.iconBadge}>
        <Icon name={T.icon} size={12} color="#fff" strokeWidth={2.6} />
      </View>
      <Text style={styles.value}>
        {Math.round(value)}<Text style={styles.goal}>/{goal}</Text>
      </Text>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <MotiView
          from={{ width: '0%' }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 160, delay: 300 + index * 80 }}
          style={styles.fill}
        />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    borderRadius: radii.lg,
    padding: 12,
    overflow: 'hidden',
    minHeight: 88,
    justifyContent: 'flex-end',
    gap: 3,
  },
  iconBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  value: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  goal: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.75)' },
  label: { ...t.caption, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  track: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.28)', overflow: 'hidden', marginTop: 4 },
  fill: { height: '100%', borderRadius: 3, backgroundColor: '#fff' },
});
