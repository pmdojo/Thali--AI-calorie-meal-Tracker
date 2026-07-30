import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing } from '@thali/ui-tokens';
import { Icon, IconName } from './Icon';

interface Props {
  icon?: IconName;
  label?: string;
  onPress?: () => void;
  bottom?: number;
  right?: number;
  variant?: 'brand' | 'peach';
}

export function FAB({ icon = 'scan', label = 'Scan meal', onPress, bottom = 96, right = spacing.xl, variant = 'brand' }: Props) {
  const [pressed, setPressed] = useState(false);
  const grad = variant === 'peach' ? gradients.peach : gradients.brand;

  return (
    <View style={[styles.wrap, { bottom, right }]} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.6, translateY: 20 }}
          animate={{ opacity: 1, scale: pressed ? 0.95 : 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
          style={[styles.pill, shadow.brandGlow]}
        >
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Icon name={icon} size={22} color="#fff" strokeWidth={2.2} />
          {label && <Text style={styles.label}>{label}</Text>}
        </MotiView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    zIndex: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.1,
  },
});
