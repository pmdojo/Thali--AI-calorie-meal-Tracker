import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type as t } from '@thali/ui-tokens';
import { Icon } from './Icon';

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[t.h3, { color: colors.text }]}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} style={styles.actionRow}>
          <Text style={[t.captionBold, { color: colors.brand }]}>{action}</Text>
          <Icon name="chevronR" size={14} color={colors.brand} strokeWidth={2.2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
