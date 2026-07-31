import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { fonts, gradients, radii, shadow } from '@thali/ui-tokens';

// ─── Cute mascot (a smiling bowl face) ─────────────────────────────────────
export function Mascot({ size = 72, float = true }: { size?: number; float?: boolean }) {
  const eye = size * 0.09;
  const cheek = size * 0.12;
  const body = (
    <View style={[styles.face, { width: size, height: size, borderRadius: size * 0.34 }, shadow.brandGlow]}>
      <LinearGradient colors={['#8FC0FF', '#6EA8FF']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFillObject} />
      {/* eyes */}
      <View style={[styles.row, { gap: size * 0.22, marginTop: size * 0.06 }]}>
        <View style={{ width: eye, height: eye, borderRadius: eye, backgroundColor: '#1D2A44' }} />
        <View style={{ width: eye, height: eye, borderRadius: eye, backgroundColor: '#1D2A44' }} />
      </View>
      {/* cheeks */}
      <View style={[styles.row, { gap: size * 0.34, marginTop: size * 0.02 }]}>
        <View style={{ width: cheek, height: cheek * 0.7, borderRadius: cheek, backgroundColor: 'rgba(255,150,170,0.55)' }} />
        <View style={{ width: cheek, height: cheek * 0.7, borderRadius: cheek, backgroundColor: 'rgba(255,150,170,0.55)' }} />
      </View>
      {/* smile */}
      <View style={{ width: size * 0.22, height: size * 0.11, borderBottomLeftRadius: size, borderBottomRightRadius: size, borderWidth: size * 0.03, borderColor: '#1D2A44', borderTopWidth: 0, marginTop: size * 0.03 }} />
    </View>
  );
  if (!float) return body;
  return (
    <MotiView from={{ translateY: 0 }} animate={{ translateY: -4 }} transition={{ type: 'timing', duration: 1900, loop: true, repeatReverse: true }}>
      {body}
    </MotiView>
  );
}

// ─── Pastel sticker tag (the scattered labels in the reference) ─────────────
type TagTone = 'yellow' | 'pink' | 'purple' | 'blue';
const TAG: Record<TagTone, [string, string]> = {
  yellow: gradients.tagYellow, pink: gradients.tagPink, purple: gradients.tagPurple, blue: gradients.tagBlue,
};

export function StickerTag({
  label, tone = 'blue', rotate = -6, style,
}: { label: string; tone?: TagTone; rotate?: number; style?: ViewStyle }) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.5, rotate: `${rotate - 8}deg` }}
      animate={{ opacity: 1, scale: 1, rotate: `${rotate}deg` }}
      transition={{ type: 'spring', damping: 13, stiffness: 200 }}
      style={[styles.tag, shadow.card, style]}
    >
      <LinearGradient colors={TAG[tone]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
      <Text style={styles.tagText}>{label}</Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  face: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' },
  row: { flexDirection: 'row', alignItems: 'center' },
  tag: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)',
  },
  tagText: { fontFamily: fonts.bold, fontSize: 12, color: '#3A2E5C' },
});
