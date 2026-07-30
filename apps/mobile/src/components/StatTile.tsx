import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Icon, IconName } from './Icon';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon: IconName;
  tint?: 'lavender' | 'peach' | 'mint' | 'sky' | 'gold';
  delta?: string;
  progress?: number;   // 0..1 optional progress bar under the value
  style?: ViewStyle;
}

const TINT: Record<NonNullable<Props['tint']>, { grad: [string, string]; ring: string; fg: string; }> = {
  lavender: { grad: ['#F5F1FB', '#EFEAFD'], ring: '#C7BAFC', fg: '#5B3FE0' },
  peach:    { grad: ['#FDECDE', '#FBCFB5'], ring: '#FBCFB5', fg: '#D95721' },
  mint:     { grad: ['#EAF7EF', '#D0EEDD'], ring: '#B7E1C7', fg: '#217E5C' },
  sky:      { grad: ['#E9F1FB', '#D3E3F6'], ring: '#B9D2ED', fg: '#2E6EB2' },
  gold:     { grad: ['#FBF1DD', '#F2D8A5'], ring: '#EACA85', fg: '#B37E29' },
};

export function StatTile({
  label, value, unit, icon, tint = 'lavender', delta, progress, style,
}: Props) {
  const T = TINT[tint];
  return (
    <View style={[styles.wrap, shadow.card, style]}>
      <LinearGradient colors={T.grad} style={StyleSheet.absoluteFillObject} />
      <View style={{ gap: spacing.sm }}>
        <View style={styles.iconRow}>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: T.ring }]}>
            <Icon name={icon} size={16} color={T.fg} />
          </View>
          <Text style={[t.label, { color: colors.textMuted }]}>{label}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
          <Text style={[t.h1, { color: colors.text }]}>{value}</Text>
          {unit && <Text style={[t.captionBold, { color: colors.textMuted }]}>{unit}</Text>}
        </View>

        {typeof progress === 'number' && (
          <View style={styles.trackWrap}>
            <View style={styles.track} />
            <MotiView
              from={{ width: '0%' }}
              animate={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              transition={{ type: 'spring', damping: 22, stiffness: 160 }}
              style={[styles.fill, { backgroundColor: T.fg }]}
            />
          </View>
        )}

        {delta && (
          <Text style={[t.caption, { color: T.fg }]}>{delta}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    minHeight: 132,
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  trackWrap: { height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.5)' },
  track: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(27,24,48,0.06)' },
  fill: { height: '100%', borderRadius: 3 },
});
