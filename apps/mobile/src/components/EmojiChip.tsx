import { MotiView } from 'moti';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Icon } from './Icon';

// Multi-select chip — for "what's on your plate" and "conditions". Pass an
// `icon` (e.g. a ClayFood illustration) to override the emoji glyph.
export function EmojiChip({
  emoji, icon, label, selected, onPress,
}: { emoji?: string; icon?: React.ReactNode; label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <MotiView
        animate={{ scale: selected ? 1.03 : 1 }}
        transition={{ type: 'spring', damping: 17, stiffness: 320 }}
        style={[
          styles.chip,
          selected ? styles.on : styles.off,
          selected ? shadow.brandGlow : shadow.card,
        ]}
      >
        {icon ? icon : emoji ? <Text style={{ fontSize: 18 }}>{emoji}</Text> : null}
        <Text style={[t.bodyBold, { color: selected ? '#fff' : colors.text }]}>{label}</Text>
        {selected && (
          <View style={styles.check}>
            <Icon name="check" size={12} color={colors.brand} strokeWidth={3} />
          </View>
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  off: { backgroundColor: colors.surface, borderColor: colors.border },
  on:  { backgroundColor: colors.brand, borderColor: colors.brand, paddingRight: spacing.md },
  check: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
});
