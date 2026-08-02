import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { ClayFood, type ClayId } from './ClayFood';

export interface ThaliSegment {
  id: string;
  emoji?: string;
  clay?: ClayId;      // clay-3D illustration (preferred over emoji)
  label: string;
  bg: string;
  ring: string;
  dim?: boolean;
}

// All-warm katori tints (cream → peach → apricot) so the wheel matches the
// terracotta app palette — no stray blue / purple / green backgrounds.
const DEFAULT_SEGMENTS: ThaliSegment[] = [
  { id: 'rice',   clay: 'rice',   label: 'Rice',   bg: '#FBEEDA', ring: '#EFC98A' },
  { id: 'sabzi',  clay: 'sabzi',  label: 'Sabzi',  bg: '#FBE7D2', ring: '#F1C39A' },
  { id: 'roti',   clay: 'roti',   label: 'Roti',   bg: '#FCEBDA', ring: '#F3C6A0' },
  { id: 'dal',    clay: 'dal',    label: 'Dal',    bg: '#FCEFD8', ring: '#F0CD90' },
  { id: 'curd',   clay: 'curd',   label: 'Curd',   bg: '#FAF1E6', ring: '#EACBA6' },
  { id: 'extras', clay: 'extras', label: 'Extras', bg: '#FBEBD3', ring: '#EFC486' },
];

// A stylised segmented thali: a steel plate with katoris (little bowls)
// arranged in a ring, each animating in with a stagger. Delightful, warm,
// and unmistakably Indian — the visual anchor for the plan screen.
export function VisualThali({
  size = 300,
  segments = DEFAULT_SEGMENTS,
  caption = 'Your balanced thali',
}: {
  size?: number;
  segments?: ThaliSegment[];
  caption?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const ringR = size * 0.31;      // distance of katoris from center
  const katori = size * 0.22;     // katori diameter

  return (
    <View style={{ alignItems: 'center', gap: spacing.sm }}>
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Steel plate */}
      <View style={[styles.plate, { width: size * 0.94, height: size * 0.94, borderRadius: size }]}>
        <LinearGradient
          colors={['#FFFFFF', '#F1ECE2']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.plateRim, { borderRadius: size }]} />
      </View>

      {/* Center label */}
      <MotiView
        from={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 16, stiffness: 200, delay: 120 }}
        style={[styles.center, { width: katori * 1.15, height: katori * 1.15, borderRadius: katori }]}
      >
        <ClayFood id="thali" size={katori * 1.12} />
      </MotiView>

      {/* Katoris in a ring */}
      {segments.map((s, i) => {
        const angle = (-90 + i * (360 / segments.length)) * (Math.PI / 180);
        const x = cx + ringR * Math.cos(angle);
        const y = cy + ringR * Math.sin(angle);
        return (
          <MotiView
            key={s.id}
            from={{ opacity: 0, scale: 0.4, translateY: 6 }}
            animate={{ opacity: s.dim ? 0.35 : 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 220, delay: 200 + i * 80 }}
            style={[
              styles.katoriWrap,
              { left: x - katori / 2, top: y - katori / 2, width: katori },
            ]}
          >
            <View style={[styles.katori, { width: katori, height: katori, borderRadius: katori / 2, backgroundColor: s.bg, borderColor: s.ring, overflow: 'hidden' }]}>
              {s.clay
                ? <ClayFood id={s.clay} size={katori * 1.04} />
                : <Text style={{ fontSize: katori * 0.44 }}>{s.emoji}</Text>}
            </View>
            <Text style={[styles.katoriLabel, { color: colors.textSoft }]}>{s.label}</Text>
          </MotiView>
        );
      })}
    </View>

      {caption ? <Text style={[t.caption, { color: colors.textMuted }]}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    position: 'absolute',
    overflow: 'hidden',
    ...shadow.floating,
  },
  plateRim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 6,
    borderColor: 'rgba(27,24,48,0.05)',
  },
  center: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
    ...shadow.card,
  },
  katoriWrap: { position: 'absolute', alignItems: 'center', gap: 3 },
  katori: {
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5,
    ...shadow.card,
  },
  katoriLabel: { ...t.tiny, fontWeight: '700' },
  captionWrap: { position: 'absolute', bottom: -6 },
});
