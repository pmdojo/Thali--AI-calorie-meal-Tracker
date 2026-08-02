import React from 'react';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

export type FoodKind = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Minimal, elegant single-ingredient illustrations in the blue palette —
// a refined alternative to emoji, cohesive with the UI.
export function FoodArt({ kind, size = 28 }: { kind: FoodKind; size?: number }) {
  const id = `fa-${kind}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#E6C98A" />
          <Stop offset="100%" stopColor="#A97F32" />
        </LinearGradient>
      </Defs>

      {kind === 'breakfast' && (
        <>
          {/* porridge bowl + steam */}
          <Path d="M9 25 h30 a15 15 0 0 1 -30 0 z" fill={`url(#${id})`} />
          <Ellipse cx="24" cy="25" rx="15" ry="3.4" fill="#F3E9D5" />
          <Path d="M19 13 q3.5 -3.5 0 -7" stroke="#C69A4B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <Path d="M28 13 q3.5 -3.5 0 -7" stroke="#C69A4B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}

      {kind === 'lunch' && (
        <>
          {/* leaf */}
          <Path d="M24 7 C37 12 37 33 24 41 C11 33 11 12 24 7 Z" fill={`url(#${id})`} />
          <Path d="M24 10 V38" stroke="#F3E9D5" strokeWidth="2" strokeLinecap="round" />
          <Path d="M24 20 L31 15 M24 27 L17 22" stroke="#F3E9D5" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}

      {kind === 'dinner' && (
        <>
          {/* plate */}
          <Circle cx="24" cy="24" r="16" fill={`url(#${id})`} />
          <Circle cx="24" cy="24" r="9.5" fill="#F3E9D5" />
          <Circle cx="24" cy="24" r="4" fill={`url(#${id})`} />
        </>
      )}

      {kind === 'snack' && (
        <>
          {/* cookie / nut */}
          <Path d="M24 9 C34 9 39 20 34 30 C31 38 17 38 14 30 C9 20 14 9 24 9 Z" fill={`url(#${id})`} />
          <Circle cx="20" cy="22" r="1.8" fill="#F3E9D5" />
          <Circle cx="28" cy="26" r="1.8" fill="#F3E9D5" />
          <Circle cx="24" cy="18" r="1.8" fill="#F3E9D5" />
          <Circle cx="27" cy="20" r="1.4" fill="#F3E9D5" />
        </>
      )}
    </Svg>
  );
}
