import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLG, Path, Stop } from 'react-native-svg';
import { colors, type as t } from '@thali/ui-tokens';

// Coral horseshoe calorie gauge (270° arc, open at the bottom) — matches the
// "Calories Left" card in the reference. Center shows the remaining number.
interface Props {
  value: number;          // number shown in the center (e.g. kcal left)
  unit?: string;
  fraction: number;       // 0..1 — how full the arc is
  size?: number;
  min?: number;
  max?: number;
}

const START = -135;
const SWEEP = 270;

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
}
function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function SemiGauge({ value, unit = 'Kcal', fraction, size = 260, min = 0, max = 100 }: Props) {
  const clamped = Math.max(0, Math.min(1, fraction));
  const stroke = 22;
  const cx = size / 2;
  const r = (size - stroke) / 2 - 4;
  const cy = r + stroke / 2 + 6;
  const height = cy + r * Math.cos((135 * Math.PI) / 180) * -1 + stroke / 2 + 22;

  const progEnd = START + SWEEP * clamped;
  const badge = polar(cx, cy, r, progEnd);
  const pct = Math.round(clamped * 100);

  const end0 = polar(cx, cy, r, START);
  const end100 = polar(cx, cy, r, START + SWEEP);

  return (
    <View style={{ width: size, height }}>
      <Svg width={size} height={height}>
        <Defs>
          <SvgLG id="gaugeFill" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#F9A03F" />
            <Stop offset="55%" stopColor="#F26B3A" />
            <Stop offset="100%" stopColor="#E8452B" />
          </SvgLG>
        </Defs>
        {/* Track */}
        <Path d={arc(cx, cy, r, START, START + SWEEP)} stroke="#F1ECE2" strokeWidth={stroke} strokeLinecap="round" fill="none" />
        {/* Progress */}
        <Path d={arc(cx, cy, r, START, progEnd)} stroke="url(#gaugeFill)" strokeWidth={stroke} strokeLinecap="round" fill="none" />
      </Svg>

      {/* % badge riding the arc tip */}
      <MotiView
        from={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 220, delay: 300 }}
        style={[styles.badge, { left: badge.x - 20, top: badge.y - 14 }]}
      >
        <Text style={styles.badgeText}>{pct}%</Text>
      </MotiView>

      {/* Center readout */}
      <View style={[styles.center, { width: size, top: cy - 44 }]}>
        <View style={styles.flame}><Text style={{ fontSize: 18 }}>🔥</Text></View>
        <Text style={styles.value}>{Math.round(value).toLocaleString()}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      {/* Min / max labels */}
      <Text style={[styles.axis, { left: end0.x - 10, top: end0.y + 8 }]}>{min}</Text>
      <Text style={[styles.axis, { left: end100.x - 12, top: end100.y + 8 }]}>{max}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    minWidth: 40,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    ...{ shadowColor: '#1B1830', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  },
  badgeText: { fontSize: 12, fontWeight: '800', color: colors.accent },
  center: { position: 'absolute', alignItems: 'center' },
  flame: { marginBottom: 2 },
  value: { fontSize: 46, fontWeight: '800', color: colors.text, letterSpacing: -1.5, lineHeight: 50 },
  unit: { ...t.caption, color: colors.textMuted, marginTop: -2 },
  axis: { position: 'absolute', ...t.tiny, color: colors.textFaint, fontWeight: '700' },
});
