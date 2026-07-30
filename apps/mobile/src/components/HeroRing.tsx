import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLG, Stop } from 'react-native-svg';
import { colors, gradients, type as t } from '@thali/ui-tokens';

interface Props {
  progress: number;        // 0..1+
  size?: number;
  strokeWidth?: number;
  consumed: number;
  remaining: number;
  budget: number;
}

// Big animated calorie ring. Multi-stop gradient stroke, ambient glow
// underneath, and a soft "breathe" pulse on the center numerals.
export function HeroRing({ progress, size = 220, strokeWidth = 20, consumed, remaining, budget }: Props) {
  const clamped = Math.max(0, Math.min(1.05, progress));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - Math.min(1, clamped));
  const isOver = progress > 1;
  const strokeColorA = isOver ? '#DC5350' : '#7A5AF8';
  const strokeColorB = isOver ? '#F26B3A' : '#F26B3A';

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Ambient glow */}
      <MotiView
        from={{ opacity: 0.4, scale: 0.95 }}
        animate={{ opacity: 0.75, scale: 1.02 }}
        transition={{ type: 'timing', duration: 2600, loop: true, repeatReverse: true }}
        style={[styles.glow, { width: size * 0.88, height: size * 0.88, borderRadius: size, backgroundColor: isOver ? '#F26B3A' : '#B291FF' }]}
      />

      <Svg width={size} height={size}>
        <Defs>
          <SvgLG id="ringStroke" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={strokeColorA} />
            <Stop offset="100%" stopColor={strokeColorB} />
          </SvgLG>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(122,90,248,0.10)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringStroke)"
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <MotiView
        from={{ opacity: 0, translateY: 6 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 560 }}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ ...t.tiny, color: colors.textMuted, textTransform: 'uppercase' }}>
            {isOver ? 'Over by' : 'Remaining'}
          </Text>
          <Text style={{ ...t.numericLg, color: isOver ? colors.danger : colors.text }}>
            {Math.abs(Math.round(remaining))}
          </Text>
          <Text style={{ ...t.caption, color: colors.textMuted }}>
            of {budget.toLocaleString()} kcal
          </Text>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    opacity: 0.5,
    // shadow-like blur via native shadow (works on iOS + web)
    shadowColor: '#7A5AF8',
    shadowOpacity: 0.5,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
});
