import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Icon, IconName } from './Icon';

interface Props {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: string[];
  kcalLow: number;
  kcalHigh: number;
  confidence: number;
  time?: string;
  wasSwapped?: boolean;
  index?: number;
}

const META: Record<Props['mealType'], { label: string; icon: IconName; grad: string }> = {
  breakfast: { label: 'Breakfast', icon: 'sunrise', grad: '#E4F6FF' },
  lunch:     { label: 'Lunch',     icon: 'sun',     grad: '#E7F0FF' },
  dinner:    { label: 'Dinner',    icon: 'moon',    grad: '#EDEBFF' },
  snack:     { label: 'Snack',     icon: 'cookie',  grad: '#E6F7F1' },
};

export function MealRow({ mealType, items, kcalLow, kcalHigh, confidence, time, wasSwapped, index = 0 }: Props) {
  const meta = META[mealType];
  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 380, delay: 60 * index }}
      style={[styles.wrap, shadow.card]}
    >
      <View style={[styles.icon, { backgroundColor: meta.grad }]}>
        <Icon name={meta.icon} size={20} color={colors.text} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={styles.headRow}>
          <Text style={[t.bodyBold, { color: colors.text }]}>{meta.label}</Text>
          {wasSwapped && (
            <View style={styles.swapPill}>
              <Icon name="swap" size={10} color={colors.brandDeep} strokeWidth={2.4} />
              <Text style={styles.swapLabel}>Swapped</Text>
            </View>
          )}
        </View>
        <Text style={[t.caption, { color: colors.textMuted }]} numberOfLines={1}>
          {items.map(cleanup).join(' · ')}
        </Text>
        {time && <Text style={[t.tiny, { color: colors.textFaint, marginTop: 2 }]}>{time}</Text>}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[t.bodyBold, { color: colors.text }]}>{kcalLow}–{kcalHigh}</Text>
        <Text style={[t.tiny, { color: colors.textMuted }]}>kcal · {Math.round(confidence * 100)}%</Text>
      </View>
    </MotiView>
  );
}

function cleanup(s: string) {
  return s.replace(/_/g, ' ');
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
  },
  icon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  swapPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: radii.pill,
    backgroundColor: colors.brandTint,
  },
  swapLabel: {
    fontSize: 10, fontWeight: '700', color: colors.brandDeep, letterSpacing: 0.4, textTransform: 'uppercase',
  },
});
