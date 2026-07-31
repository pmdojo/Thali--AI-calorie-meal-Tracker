import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLG, Stop } from 'react-native-svg';

// Bold 3D-style donut (reference layout, blue palette). A dark ring sits
// slightly behind + below the coloured ring to fake extruded depth.
export function DonutChart({
  consumed, budget, size = 240,
}: { consumed: number; budget: number; size?: number }) {
  const fraction = budget > 0 ? Math.max(0, Math.min(1, consumed / budget)) : 0;
  const stroke = 46;
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
              <Stop offset="0%" stopColor="#8FC0FF" />
              <Stop offset="55%" stopColor="#6EA8FF" />
              <Stop offset="100%" stopColor="#5A8AF0" />
            </SvgLG>
          </Defs>

          {/* extruded depth — dark ring behind + below */}
          <Circle cx={cx} cy={cy + 12} r={r} stroke="#2B4A78" strokeWidth={stroke} fill="none" opacity={0.35} />
          <Circle cx={cx} cy={cy + 6} r={r} stroke="#3E64A0" strokeWidth={stroke} fill="none" opacity={0.5} />

          {/* remaining track */}
          <Circle cx={cx} cy={cy} r={r} stroke="#DCEAFB" strokeWidth={stroke} fill="none" />

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
    </View>
  );
}
