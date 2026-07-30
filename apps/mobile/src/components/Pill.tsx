import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type as t } from '@thali/ui-tokens';
import { Icon, IconName } from './Icon';

interface Props {
  label: string;
  icon?: IconName;
  tone?: 'brand' | 'accent' | 'success' | 'warning' | 'neutral';
}

const TONE = {
  brand:   { bg: colors.brandTint,    fg: colors.brandDeep },
  accent:  { bg: colors.accentTint,   fg: colors.accentDeep },
  success: { bg: colors.successSoft,  fg: '#217E5C' },
  warning: { bg: colors.warningSoft,  fg: '#8A6218' },
  neutral: { bg: colors.surfaceAlt,   fg: colors.text },
} as const;

export function Pill({ label, icon, tone = 'brand' }: Props) {
  const T = TONE[tone];
  return (
    <View style={[styles.wrap, { backgroundColor: T.bg }]}>
      {icon && <Icon name={icon} size={12} color={T.fg} strokeWidth={2.4} />}
      <Text style={[t.tiny, { color: T.fg, textTransform: 'uppercase' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
});
