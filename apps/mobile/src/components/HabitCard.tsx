import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Icon, IconName } from './Icon';

interface Props {
  title: string;
  subtitle?: string;
  icon: IconName;
  tint?: 'mint' | 'sky' | 'peach' | 'lavender' | 'gold';
  count?: string;
  streak?: number;
  onPress?: () => void;
}

const TINT: Record<NonNullable<Props['tint']>, { bg: string; fg: string; ring: string }> = {
  mint:     { bg: colors.surfaceMint, fg: '#1E9E72', ring: '#B7E6D3' },
  sky:      { bg: colors.surfaceSky,  fg: '#2E8CC0', ring: '#AFE0F7' },
  peach:    { bg: colors.surfaceWarm, fg: '#2E8CC0', ring: '#C4EEFF' },
  lavender: { bg: colors.surfaceAlt,  fg: '#5B6BE0', ring: '#C7CFFF' },
  gold:     { bg: '#E4F1FF',          fg: '#3B7FCB', ring: '#B4D6F7' },
};

export function HabitCard({ title, subtitle, icon, tint = 'mint', count, streak, onPress }: Props) {
  const [pressed, setPressed] = useState(false);
  const T = TINT[tint];
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ flex: 1 }}
    >
      <MotiView
        animate={{ scale: pressed ? 0.98 : 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        style={[styles.wrap, { backgroundColor: T.bg }, shadow.card]}
      >
        <View style={[styles.icon, { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: T.ring }]}>
          <Icon name={icon} size={18} color={T.fg} />
        </View>
        <View style={{ gap: 2, flex: 1 }}>
          <Text style={[t.bodyBold, { color: colors.text }]} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={[t.caption, { color: colors.textMuted }]} numberOfLines={1}>{subtitle}</Text>}
        </View>
        {count && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[t.bodyBold, { color: T.fg }]}>{count}</Text>
            {typeof streak === 'number' && (
              <Text style={[t.tiny, { color: colors.textMuted }]}>{streak}d streak</Text>
            )}
          </View>
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl,
  },
  icon: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
});
