import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type } from '@thali/ui-tokens';

interface Macro { label: string; value: number; goal?: number; color: string; }

export function MacroChips({ items }: { items: Macro[] }) {
  return (
    <View style={styles.row}>
      {items.map((m) => (
        <View key={m.label} style={styles.chip}>
          <View style={[styles.dot, { backgroundColor: m.color }]} />
          <View>
            <Text style={styles.label}>{m.label}</Text>
            <Text style={styles.value}>
              {Math.round(m.value)}g{m.goal ? ` / ${m.goal}g` : ''}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { ...type.caption, color: colors.textMuted },
  value: { ...type.bodyBold, color: colors.text },
});
