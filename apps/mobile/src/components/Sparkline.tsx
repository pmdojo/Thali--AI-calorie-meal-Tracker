import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLG, Path, Stop, Circle, Line } from 'react-native-svg';
import { colors, spacing, type as t } from '@thali/ui-tokens';

interface Props {
  data: number[];             // values (kcal per day)
  goal: number;               // budget line
  labels?: string[];          // e.g. ['M','T','W','T','F','S','S']
  height?: number;
  width?: number;
}

// Smooth Catmull-Rom → cubic bezier path for the area/line
function smoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return '';
  const p = points;
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function Sparkline({ data, goal, labels, height = 130, width = 300 }: Props) {
  const pad = { l: 8, r: 8, t: 12, b: 20 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const maxV = Math.max(goal * 1.15, ...data);
  const minV = 0;
  const range = maxV - minV || 1;
  const points = data.map((v, i) => ({
    x: pad.l + (i * w) / Math.max(1, data.length - 1),
    y: pad.t + h - ((v - minV) / range) * h,
  }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${pad.t + h} L ${points[0].x} ${pad.t + h} Z`;
  const goalY = pad.t + h - ((goal - minV) / range) * h;

  return (
    <View style={{ width, gap: spacing.sm }}>
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
      >
        <Svg width={width} height={height}>
          <Defs>
            <SvgLG id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#7A5AF8" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#7A5AF8" stopOpacity="0" />
            </SvgLG>
            <SvgLG id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#7A5AF8" />
              <Stop offset="100%" stopColor="#F26B3A" />
            </SvgLG>
          </Defs>

          {/* Goal line */}
          <Line
            x1={pad.l} y1={goalY}
            x2={pad.l + w} y2={goalY}
            stroke="rgba(27,24,48,0.15)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />

          {/* Area fill */}
          <Path d={areaPath} fill="url(#areaFill)" />

          {/* Line */}
          <Path d={linePath} fill="none" stroke="url(#lineStroke)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {points.map((p, i) => (
            <Circle
              key={i}
              cx={p.x} cy={p.y}
              r={i === points.length - 1 ? 5 : 3.5}
              fill="#fff"
              stroke={i === points.length - 1 ? '#F26B3A' : '#7A5AF8'}
              strokeWidth={2}
            />
          ))}
        </Svg>
      </MotiView>

      {labels && (
        <View style={styles.labels}>
          {labels.map((l, i) => (
            <Text
              key={i}
              style={[
                t.tiny,
                { color: i === labels.length - 1 ? colors.text : colors.textFaint, width: w / labels.length, textAlign: 'center' },
              ]}
            >
              {l}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  labels: { flexDirection: 'row', paddingHorizontal: 8 },
});
