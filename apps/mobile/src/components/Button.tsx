import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, gradients, radii, shadow, spacing } from '@thali/ui-tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass' | 'ink';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  trailingCircle?: React.ReactNode;  // circular accent on the right (kawaii CTA)
  style?: ViewStyle;
  full?: boolean;
}

const SIZE = {
  sm: { minH: 40, ph: spacing.lg, font: 14 },
  md: { minH: 50, ph: spacing.xl, font: 15 },
  lg: { minH: 58, ph: spacing.xl, font: 16 },  // 58px per brief
} as const;

export function Button({
  label, onPress, disabled, variant = 'primary', size = 'lg',
  icon, trailing, trailingCircle, style, full = true,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const s = SIZE[size];
  const gradientFill = variant === 'primary' || variant === 'danger' || variant === 'ink';
  const onColor = variant === 'primary' || variant === 'danger' || variant === 'ink' ? '#fff' : colors.text;

  const shell: ViewStyle = {
    minHeight: s.minH,
    paddingHorizontal: trailingCircle ? spacing.sm : s.ph,
    paddingLeft: trailingCircle ? spacing.xl : s.ph,
    borderRadius: radii.pill,
    alignSelf: full ? 'stretch' : 'flex-start',
    overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', justifyContent: trailingCircle ? 'space-between' : 'center',
    gap: spacing.sm,
    opacity: disabled ? 0.5 : 1,
    ...(variant === 'primary' ? shadow.brandGlow : variant === 'danger' ? shadow.accentGlow : variant === 'ink' ? shadow.floating : shadow.none),
  };

  const bg =
    variant === 'secondary' ? colors.surface :
    variant === 'ghost'     ? 'transparent'  :
    variant === 'glass'     ? colors.glassStrong :
    'transparent';

  const border =
    variant === 'ghost'     ? { borderWidth: 1.5, borderColor: colors.borderStrong } :
    variant === 'secondary' ? { borderWidth: 1, borderColor: colors.border } :
    variant === 'glass'     ? { borderWidth: 1, borderColor: colors.glassBorder } :
    {};

  return (
    <Pressable onPress={disabled ? undefined : onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
      <MotiView
        animate={{ scale: pressed && !disabled ? 0.97 : 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 400 }}
        style={[shell, { backgroundColor: bg, ...border }, style]}
      >
        {gradientFill && (
          <LinearGradient
            colors={variant === 'ink' ? gradients.ink : variant === 'danger' ? gradients.peach : gradients.brand}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {icon}
          <Text style={{ fontFamily: fonts.semibold, fontSize: s.font, color: onColor, letterSpacing: -0.1 }}>{label}</Text>
          {trailing}
        </View>
        {trailingCircle}
      </MotiView>
    </Pressable>
  );
}
