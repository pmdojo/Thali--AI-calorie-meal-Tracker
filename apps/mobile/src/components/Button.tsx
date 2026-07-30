import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing } from '@thali/ui-tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: ViewStyle;
  full?: boolean;
}

const SIZE = {
  sm: { pv: spacing.sm,  ph: spacing.lg,  font: 14, radius: radii.pill },
  md: { pv: spacing.md,  ph: spacing.xl,  font: 15, radius: radii.pill },
  lg: { pv: spacing.lg,  ph: spacing.xl,  font: 16, radius: radii.pill },
} as const;

export function Button({
  label, onPress, disabled, variant = 'primary', size = 'lg',
  icon, trailing, style, full = true,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const s = SIZE[size];
  const isGradient = variant === 'primary' || variant === 'danger';

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, justifyContent: 'center' }}>
      {icon}
      <Text style={{
        fontSize: s.font,
        fontWeight: '600',
        letterSpacing: -0.1,
        color: isGradient ? '#fff' : colors.text,
      }}>{label}</Text>
      {trailing}
    </View>
  );

  const shell: ViewStyle = {
    paddingVertical: s.pv,
    paddingHorizontal: s.ph,
    borderRadius: s.radius,
    alignSelf: full ? 'stretch' : 'flex-start',
    overflow: 'hidden',
    opacity: disabled ? 0.5 : 1,
    ...(variant === 'primary' ? shadow.brandGlow : variant === 'danger' ? shadow.accentGlow : shadow.none),
  };

  const bg =
    variant === 'secondary' ? colors.surface :
    variant === 'ghost'     ? 'transparent'  :
    variant === 'glass'     ? colors.glassStrong :
    'transparent';

  const border =
    variant === 'ghost'     ? { borderWidth: 1, borderColor: colors.borderStrong } :
    variant === 'secondary' ? { borderWidth: 1, borderColor: colors.border } :
    variant === 'glass'     ? { borderWidth: 1, borderColor: colors.glassBorder } :
    {};

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <MotiView
        animate={{ scale: pressed && !disabled ? 0.97 : 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        style={[shell, { backgroundColor: bg, ...border }, style]}
      >
        {isGradient && (
          <LinearGradient
            colors={variant === 'danger' ? gradients.peach : gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {content}
      </MotiView>
    </Pressable>
  );
}
