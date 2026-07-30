import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Icon } from './Icon';

interface Props {
  count: number;
  label?: string;
}

export function StreakBadge({ count, label = 'day streak' }: Props) {
  return (
    <View style={[styles.wrap, shadow.card]}>
      <LinearGradient
        colors={gradients.peach}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <MotiView
        from={{ scale: 0.8, rotate: '-8deg' }}
        animate={{ scale: 1, rotate: '0deg' }}
        transition={{ type: 'spring', damping: 12, stiffness: 220 }}
      >
        <Icon name="flame" size={16} color="#fff" strokeWidth={2.4} />
      </MotiView>
      <Text style={styles.number}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  number: { color: '#fff', fontSize: 15, fontWeight: '800', marginLeft: 4 },
  label:  { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600' },
});
