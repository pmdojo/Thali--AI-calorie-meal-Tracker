import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, spacing } from '@thali/ui-tokens';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  bg?: 'parchment' | 'sunrise' | 'flat';
  bgColor?: string;   // solid override (skips gradient + blobs)
  padding?: 'default' | 'none' | 'tight' | 'hero';
  footer?: React.ReactNode;
}

const PADDING: Record<NonNullable<ScreenProps['padding']>, number> = {
  none: 0, tight: spacing.md, default: spacing.xl, hero: 0,
};

// Soft pastel blobs float behind the content so the frosted glass cards
// have something colourful to blur.
function Blobs() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <MotiView
        from={{ translateY: 0, translateX: 0 }} animate={{ translateY: 18, translateX: 10 }}
        transition={{ type: 'timing', duration: 7000, loop: true, repeatReverse: true }}
        style={[styles.blob, { top: -40, right: -30, backgroundColor: '#E6C98A' }]}
      />
      <MotiView
        from={{ translateY: 0 }} animate={{ translateY: -22 }}
        transition={{ type: 'timing', duration: 8000, loop: true, repeatReverse: true }}
        style={[styles.blob, { top: 220, left: -60, backgroundColor: '#D8C3A0' }]}
      />
      <MotiView
        from={{ translateX: 0 }} animate={{ translateX: 16 }}
        transition={{ type: 'timing', duration: 9000, loop: true, repeatReverse: true }}
        style={[styles.blob, { bottom: 40, right: -50, backgroundColor: '#CFC1AC' }]}
      />
    </View>
  );
}

export function Screen({
  children, scroll = true, edges = ['top', 'left', 'right'],
  bg = 'parchment', bgColor, padding = 'default', footer,
}: ScreenProps) {
  const pad = PADDING[padding];

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={{ padding: pad, paddingBottom: pad + 140, gap: spacing.lg }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, padding: pad, paddingBottom: pad + 100, gap: spacing.lg }}>{children}</View>
  );

  return (
    <View style={{ flex: 1 }}>
      {bgColor
        ? <View style={[StyleSheet.absoluteFillObject, { backgroundColor: bgColor }]} />
        : bg === 'flat'
        ? <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.bg }]} />
        : <LinearGradient colors={bg === 'sunrise' ? gradients.sunrise : gradients.parchment} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />}
      {!bgColor && bg !== 'flat' && <Blobs />}
      <SafeAreaView edges={edges} style={{ flex: 1 }}>{content}</SafeAreaView>
      {footer && (
        <View pointerEvents="box-none" style={styles.footer}>{footer}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 260, height: 260, borderRadius: 130,
    opacity: 0.35,
  },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: spacing.xl, paddingBottom: spacing.xxl,
  },
});
