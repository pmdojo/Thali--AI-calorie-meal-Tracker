import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, gradients, radii, shadow, spacing } from '@thali/ui-tokens';

export type CardTone = 'surface' | 'glass' | 'glassStrong' | 'lavender' | 'peach' | 'mint' | 'sky';

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
  glass:       colors.glass,
  glassStrong: colors.glassStrong,
  lavender:    colors.surfaceAlt,
  peach:       colors.surfaceWarm,
  mint:        colors.surfaceMint,
  sky:         colors.surfaceSky,
};

export function Card({
  children, style, tone = 'surface', padding = 'md', gradient,
  onPress, interactive, radius = 'xxl', elevation = 'card',
}: CardProps) {
  const [pressed, setPressed] = useState(false);
  const isGlass = tone === 'glass' || tone === 'glassStrong';

  const Body = (
    <MotiView
      animate={{
        scale: pressed && (onPress || interactive) ? 0.985 : 1,
        translateY: pressed && (onPress || interactive) ? 1 : 0,
      }}
      transition={{ type: 'spring', damping: 22, stiffness: 380 }}
      style={[elevation !== 'none' ? shadow[elevation] : undefined, style]}
    >
      <View style={[styles.clip, { borderRadius: radii[radius] }]}>
        {isGlass && <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />}
        {gradient && (
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
        )}
        <View
          style={{
            backgroundColor: gradient ? 'transparent' : TONE_BG[tone],
            padding: PADDING[padding],
            borderWidth: 1,
            borderColor: isGlass ? colors.glassBorder : 'rgba(255,255,255,0.6)',
            borderRadius: radii[radius],
          }}
        >
          {children}
        </View>
      </View>
    </MotiView>
  );

  if (!onPress) return Body;
  return (
    <Pressable onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
      {Body}
    </Pressable>
  );
}

export function HeroCard({ children, gradient = gradients.brand, style, ...rest }: Omit<CardProps, 'gradient'> & { gradient?: [string, string] }) {
  return (
    <Card gradient={gradient} elevation="brandGlow" padding="lg" radius="xxl" style={style} {...rest}>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
});
