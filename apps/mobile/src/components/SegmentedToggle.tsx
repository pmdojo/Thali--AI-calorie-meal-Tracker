import { MotiView } from 'moti';
import React from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients, radii, shadow, spacing } from '@thali/ui-tokens';

// Pill segmented control (Day / Weekly / Monthly). The active pill slides
// between segments with a spring.
export function SegmentedToggle<T extends string>({
  options, value, onChange,
}: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  const [w, setW] = React.useState(0);
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);
  const segW = w > 0 ? (w - 8) / options.length : 0;
  const idx = Math.max(0, options.indexOf(value));

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {segW > 0 && (
        <MotiView
          animate={{ translateX: 4 + idx * segW }}
          transition={{ type: 'spring', damping: 20, stiffness: 220 }}
          style={[styles.thumb, { width: segW }]}
        >
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
        </MotiView>
      )}
      {options.map((o) => {
        const active = o === value;
        return (
          <Pressable key={o} style={styles.seg} onPress={() => onChange(o)}>
            <Text style={[styles.label, { color: active ? '#fff' : colors.textMuted }]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  thumb: {
    position: 'absolute',
    top: 4, bottom: 4, left: 0,
    borderRadius: radii.pill,
    overflow: 'hidden',
    ...shadow.brandGlow,
  },
  seg: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.bold, fontSize: 15, letterSpacing: -0.2 },
});
