import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radii, spacing, type } from '@thali/ui-tokens';

export function Field({ label, ...rest }: { label: string } & TextInputProps) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...type.caption, color: colors.textMuted },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...type.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export function Choice({
  label,
  selected,
  onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Text
      onPress={onPress}
      style={[
        chipStyles.chip,
        selected && chipStyles.selected,
      ]}
    >
      {label}
    </Text>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    ...type.body,
    color: colors.text,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  selected: {
    backgroundColor: colors.brand,
    color: '#fff',
    borderColor: colors.brand,
  },
});
