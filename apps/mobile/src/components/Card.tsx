import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing } from '@thali/ui-tokens';

export type CardTone = 'surface' | 'lavender' | 'peach' | 'mint' | 'sky' | 'glass' | 'glassStrong';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  tone?: CardTone;
  padding?: keyof typeof PADDING;
  gradient?: [string, string];
  onPress?: () => void;
  interactive?: boolean;
  radius?: keyof typeof radii;
  elevation?: 'card' | 'cardHover' | 'floating' | 'brandGlow' | 'accentGlow' | 'none';
}

const PADDING = { none: 0, sm: spacing.md, md: spacing.lg, lg: spacing.xl, xl: spacing.xxl } as const;

const TONE_BG: Record<CardTone, string> = {
  surface:     colors.surface,
  lavender:    colors.surfaceAlt,
  peach:       colors.surfaceWarm,
  mint:        colors.surfaceMint,
  sky:         colors.surfaceSky,
  glass:       colors.glass,
  glassStrong: colors.glassStrong,
};

export function Card({
  children,
  style,
  tone = 'surface',
  padding = 'md',
  gradient,
  onPress,
  interactive,
  radius = 'xl',
  elevation = 'card',
}: CardProps) {
  const [pressed, setPressed] = useState(false);

  const baseStyle: ViewStyle = {
    borderRadius: radii[radius],
    padding: PADDING[padding],
    borderWidth: tone === 'glass' || tone === 'glassStrong' ? 1 : 0,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    ...(elevation !== 'none' ? shadow[elevation] : {}),
    backgroundColor: gradient ? 'transparent' : TONE_BG[tone],
  };

  const Body = (
    <MotiView
      animate={{ scale: pressed && (onPress || interactive) ? 0.985 : 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 400 }}
      style={[baseStyle, style]}
    >
      {gradient && (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {children}
    </MotiView>
  );

  if (!onPress) return Body;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {Body}
    </Pressable>
  );
}

// Preset for very common case: gradient hero card
export function HeroCard({ children, gradient = gradients.brand, style, ...rest }: Omit<CardProps, 'gradient'> & { gradient?: [string, string] }) {
  return (
    <Card gradient={gradient} elevation="brandGlow" padding="lg" radius="xxl" style={style} {...rest}>
      {children}
    </Card>
  );
}
