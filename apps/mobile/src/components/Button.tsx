import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radii, spacing, type } from '@thali/ui-tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      <Text style={[styles.label, variantStyles[variant].label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.bodyBold,
  },
});

const variantStyles: Record<Variant, { container: ViewStyle; label: { color: string } }> = {
  primary:   { container: { backgroundColor: colors.brand }, label: { color: '#fff' } },
  secondary: { container: { backgroundColor: colors.accentSoft }, label: { color: colors.accent } },
  ghost:     { container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }, label: { color: colors.text } },
  danger:    { container: { backgroundColor: colors.danger }, label: { color: '#fff' } },
};
