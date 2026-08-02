import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLG, Stop } from 'react-native-svg';
import { colors, type as t } from '@thali/ui-tokens';

// Bold 3D-style calorie donut. Filled arc = consumed, light track = left.
// Centre spells out how much has been eaten and how much is left.
export function DonutChart({
  consumed, budget, size = 240,
}: { consumed: number; budget: number; size?: number }) {
  const left = Math.max(0, budget - consumed);
  const fraction = budget > 0 ? Math.max(0, Math.min(1, consumed / budget)) : 0;
  const over = consumed > budget;
  const stroke = 44;
  const r = (size - stroke) / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - fraction);

  return (
    <View style={{ width: size, height: size + 14, alignItems: 'center', justifyContent: 'center' }}>
      <MotiView
        from={{ opacity: 0, scale: 0.82, rotate: '-12deg' }}
        animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
        transition={{ type: 'spring', damping: 16, stiffness: 160 }}
      >
        <Svg width={size} height={size + 14}>
          <Defs>
            <SvgLG id="donutFill" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={over ? '#E39A57' : '#F2C79A'} />
              <Stop offset="55%" stopColor={over ? '#C1553B' : '#DD8A46'} />
              <Stop offset="100%" stopColor={over ? '#A83B28' : '#C26E2E'} />
            </SvgLG>
          </Defs>

          {/* extruded depth */}
          <Circle cx={cx} cy={cy + 12} r={r} stroke="#6B573A" strokeWidth={stroke} fill="none" opacity={0.32} />
          <Circle cx={cx} cy={cy + 6} r={r} stroke="#8A6E3A" strokeWidth={stroke} fill="none" opacity={0.5} />

          {/* left (remaining) track */}
          <Circle cx={cx} cy={cy} r={r} stroke="#F5E1C6" strokeWidth={stroke} fill="none" />

          {/* consumed arc */}
          <Circle
            cx={cx} cy={cy} r={r}
            stroke="url(#donutFill)" strokeWidth={stroke}
            strokeDasharray={c} strokeDashoffset={dashOffset}
            strokeLinecap="round" fill="none"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        </Svg>
      </MotiView>

      {/* Centre readout */}
      <MotiView
        from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 250 }}
        style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]}
      >
        <Text style={[t.tiny, { color: colors.textMuted, textTransform: 'uppercase' }]}>{over ? 'Over by' : 'Left'}</Text>
        <Text style={[t.numeric, { color: over ? colors.danger : colors.text }]}>
          {(over ? consumed - budget : left).toLocaleString()}
        </Text>
        <Text style={[t.caption, { color: colors.textMuted, marginTop: -2 }]}>kcal</Text>
        <View style={styles.eaten}>
          <View style={styles.dot} />
          <Text style={[t.captionBold, { color: colors.brandDeep }]}>{Math.round(consumed).toLocaleString()} eaten</Text>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  eaten: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6,
    backgroundColor: colors.brandTint, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand },
});
