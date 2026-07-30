import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, spacing } from '@thali/ui-tokens';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  bg?: 'parchment' | 'sunrise' | 'flat';
  padding?: 'default' | 'none' | 'tight' | 'hero';
  footer?: React.ReactNode;
}

const PADDING: Record<NonNullable<ScreenProps['padding']>, number> = {
  none: 0,
  tight: spacing.md,
  default: spacing.xl,
  hero: 0,
};

export function Screen({
  children,
  scroll = true,
  edges = ['top', 'left', 'right'],
  bg = 'parchment',
  padding = 'default',
  footer,
}: ScreenProps) {
  const pad = PADDING[padding];
  const bgNode = bg === 'flat'
    ? <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.bg }]} />
    : <LinearGradient
        colors={bg === 'sunrise' ? gradients.sunrise : gradients.parchment}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />;

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
      {bgNode}
      <SafeAreaView edges={edges} style={{ flex: 1 }}>
        {content}
      </SafeAreaView>
      {footer && (
        <View pointerEvents="box-none" style={styles.footer}>
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});
