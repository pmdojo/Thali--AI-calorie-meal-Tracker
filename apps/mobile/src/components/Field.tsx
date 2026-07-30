import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';

interface FieldProps extends TextInputProps {
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
}

export function Field({ label, suffix, icon, style, ...rest }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <MotiView
        animate={{
          borderColor: focused ? colors.brand : colors.border,
          shadowOpacity: focused ? 0.15 : 0,
        }}
        transition={{ type: 'timing', duration: 180 }}
        style={[styles.inputWrap, focused && shadow.brandGlow, style]}
      >
        {icon}
        <TextInput
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...t.captionBold, color: colors.textMuted, letterSpacing: 0.2 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...t.bodyLg,
    color: colors.text,
    paddingVertical: 0,
  },
  suffix: { ...t.captionBold, color: colors.textMuted },
});

export function Choice({
  label, selected, onPress, icon,
}: { label: string; selected: boolean; onPress: () => void; icon?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress}>
      <MotiView
        animate={{ scale: selected ? 1.02 : 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 300 }}
        style={[
          chipStyles.chip,
          selected && chipStyles.selected,
        ]}
      >
        {icon}
        <Text style={[t.bodyBold, { color: selected ? '#fff' : colors.text }]}>{label}</Text>
      </MotiView>
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    ...shadow.brandGlow,
  },
});

// Big card-style picker for option lists in onboarding
export function OptionCard({
  title, subtitle, selected, onPress, icon,
}: { title: string; subtitle?: string; selected: boolean; onPress: () => void; icon?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress}>
      <MotiView
        animate={{ scale: selected ? 1.01 : 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={[
          cardStyles.wrap,
          selected && cardStyles.wrapOn,
          selected ? shadow.brandGlow : shadow.card,
        ]}
      >
        {icon && (
          <View style={[cardStyles.icon, selected && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            {icon}
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[t.bodyBold, { color: selected ? '#fff' : colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[t.caption, { color: selected ? 'rgba(255,255,255,0.85)' : colors.textMuted }]}>{subtitle}</Text>
          )}
        </View>
        <View style={[cardStyles.dot, selected && cardStyles.dotOn]}>
          {selected && <View style={cardStyles.dotInner} />}
        </View>
      </MotiView>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  wrapOn: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  icon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  dotOn: { borderColor: '#fff', backgroundColor: '#fff' },
  dotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
});
