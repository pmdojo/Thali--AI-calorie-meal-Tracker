import React from 'react';
import Svg, { Circle } from 'react-native-svg';

// A compact circular progress ring for the macro stat cards.
export function ProgressRing({
  progress, size = 62, thickness = 9, color, track = 'rgba(0,0,0,0.06)',
}: {
  progress: number;   // 0..1
  size?: number;
  thickness?: number;
  color: string;
  track?: string;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));
  const dash = p * c;
  const cx = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cx} r={r} stroke={track} strokeWidth={thickness} fill="none" />
      <Circle
        cx={cx} cy={cx} r={r}
        stroke={color} strokeWidth={thickness} fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
      />
    </Svg>
  );
}
