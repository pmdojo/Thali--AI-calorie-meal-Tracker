import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, shadow, spacing } from '@thali/ui-tokens';

export function Card({ children, style, tone = 'surface' }: { children: React.ReactNode; style?: ViewStyle; tone?: 'surface' | 'alt' }) {
  return (
    <View style={[styles.card, tone === 'alt' && styles.alt, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  alt: {
    backgroundColor: colors.surfaceAlt,
  },
});
