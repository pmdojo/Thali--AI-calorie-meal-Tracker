import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import type { MealType } from '../store';

// Hand-built "soft-clay 3D" food illustrations — a bespoke, brand-owned
// alternative to platform emoji. Volume comes from radial gradients, gloss
// from highlight shapes, and each sits on a soft contact shadow so it reads
// as floating above the card. Vector, so it stays crisp at any size.
export function Food3D({ type, size = 56 }: { type: MealType; size?: number }) {
  const p = `f3d-${type}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {type === 'breakfast' && <EggToast p={p} />}
      {type === 'lunch' && <SaladBowl p={p} />}
      {type === 'dinner' && <RiceBowl p={p} />}
      {type === 'snack' && <Watermelon p={p} />}
    </Svg>
  );
}

// A tight soft shadow that hugs the food's base so it seats on the card edge
// rather than casting a wide detached oval.
function Shadow() {
  return <Ellipse cx="50" cy="82" rx="20" ry="4" fill="rgba(90,45,15,0.13)" />;
}

// ── Breakfast: sunny-side-up egg on a slice of toast ──────────────────────
function EggToast({ p }: { p: string }) {
  return (
    <G>
      <Defs>
        <LinearGradient id={`${p}-crust`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E7A860" />
          <Stop offset="100%" stopColor="#C97B37" />
        </LinearGradient>
        <LinearGradient id={`${p}-bread`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FBE0AE" />
          <Stop offset="100%" stopColor="#F2C888" />
        </LinearGradient>
        <RadialGradient id={`${p}-yolk`} cx="40%" cy="35%" r="70%">
          <Stop offset="0%" stopColor="#FFD86B" />
          <Stop offset="55%" stopColor="#FFB01F" />
          <Stop offset="100%" stopColor="#EF8A12" />
        </RadialGradient>
        <RadialGradient id={`${p}-white`} cx="45%" cy="35%" r="75%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#F3E9DC" />
        </RadialGradient>
      </Defs>
      <Shadow />
      {/* toast — crust body + inner bread face for thickness */}
      <Path d="M22,44 q0,-9 10,-9 h36 q10,0 10,9 v22 q0,11 -11,11 h-34 q-11,0 -11,-11 z" fill={`url(#${p}-crust)`} />
      <Path d="M27,42 q0,-6 8,-6 h30 q8,0 8,6 v20 q0,7 -7,7 h-32 q-7,0 -7,-7 z" fill={`url(#${p}-bread)`} />
      {/* egg white — soft irregular blob */}
      <Path d="M40,40 q-11,-1 -11,10 q-8,3 -3,11 q-1,9 9,8 q6,5 14,1 q10,2 10,-8 q7,-5 1,-12 q0,-10 -11,-9 q-4,-4 -9,-2 z" fill={`url(#${p}-white)`} />
      {/* yolk */}
      <Circle cx="52" cy="49" r="10" fill={`url(#${p}-yolk)`} />
      <Ellipse cx="48" cy="45" rx="3.4" ry="2.4" fill="rgba(255,255,255,0.65)" />
    </G>
  );
}

// ── Lunch: leafy salad in a ceramic bowl, veg poking above the rim ────────
function SaladBowl({ p }: { p: string }) {
  return (
    <G>
      <Defs>
        <LinearGradient id={`${p}-bowl`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FBF3E7" />
          <Stop offset="100%" stopColor="#E4D3B8" />
        </LinearGradient>
        <RadialGradient id={`${p}-leaf1`} cx="40%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#A7D96B" />
          <Stop offset="100%" stopColor="#5E9B32" />
        </RadialGradient>
        <RadialGradient id={`${p}-leaf2`} cx="40%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#8FCB57" />
          <Stop offset="100%" stopColor="#4C8528" />
        </RadialGradient>
        <RadialGradient id={`${p}-tom`} cx="38%" cy="30%" r="72%">
          <Stop offset="0%" stopColor="#F76B5A" />
          <Stop offset="100%" stopColor="#D6362B" />
        </RadialGradient>
      </Defs>
      <Shadow />
      {/* bowl cup — drawn BEHIND the greens */}
      <Path d="M22,54 a28,27 0 0 0 56,0 z" fill={`url(#${p}-bowl)`} />
      {/* dark inner back-wall of the opening, for depth */}
      <Path d="M25,54 a25,6 0 0 1 50,0 z" fill="rgba(120,90,50,0.13)" />
      {/* greens — fill the bowl opening and mound up out of it */}
      <Circle cx="35" cy="46" r="12" fill={`url(#${p}-leaf2)`} />
      <Circle cx="65" cy="45" r="13" fill={`url(#${p}-leaf1)`} />
      <Circle cx="50" cy="38" r="15" fill={`url(#${p}-leaf1)`} />
      <Circle cx="43" cy="48" r="11" fill={`url(#${p}-leaf2)`} />
      <Circle cx="58" cy="47" r="11" fill={`url(#${p}-leaf1)`} />
      <Circle cx="50" cy="50" r="12" fill={`url(#${p}-leaf2)`} />
      {/* tomato + cucumber accents */}
      <Circle cx="63" cy="49" r="6" fill={`url(#${p}-tom)`} />
      <Ellipse cx="61" cy="46.5" rx="2" ry="1.3" fill="rgba(255,255,255,0.6)" />
      <Circle cx="38" cy="50" r="5" fill="#CDE8A6" />
      <Circle cx="38" cy="50" r="2.4" fill="#A9D072" />
      {/* front rim lip — occludes the greens' base so they read as IN the bowl */}
      <Path d="M22,54 a28,9 0 0 0 56,0 z" fill={`url(#${p}-bowl)`} />
      <Path d="M23,53.5 a27,7 0 0 0 54,0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
    </G>
  );
}

// ── Dinner: steamed rice mound + a dab of curry in a warm bowl ────────────
function RiceBowl({ p }: { p: string }) {
  return (
    <G>
      <Defs>
        <LinearGradient id={`${p}-bowl`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#F0E4D0" />
          <Stop offset="100%" stopColor="#D2BE9E" />
        </LinearGradient>
        <RadialGradient id={`${p}-rice`} cx="45%" cy="30%" r="80%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#EDE6D6" />
        </RadialGradient>
        <RadialGradient id={`${p}-curry`} cx="40%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#E79A46" />
          <Stop offset="100%" stopColor="#B45E24" />
        </RadialGradient>
      </Defs>
      <Shadow />
      {/* bowl cup — drawn BEHIND the rice */}
      <Path d="M22,54 a28,27 0 0 0 56,0 z" fill={`url(#${p}-bowl)`} />
      <Path d="M25,54 a25,6 0 0 1 50,0 z" fill="rgba(120,90,50,0.12)" />
      {/* rice mound + curry, filling the bowl opening */}
      <Circle cx="41" cy="47" r="10" fill={`url(#${p}-rice)`} />
      <Circle cx="56" cy="46" r="11" fill={`url(#${p}-rice)`} />
      <Circle cx="49" cy="41" r="10" fill={`url(#${p}-rice)`} />
      <Circle cx="50" cy="50" r="12" fill={`url(#${p}-rice)`} />
      <Circle cx="62" cy="50" r="8" fill={`url(#${p}-rice)`} />
      {/* curry dab + veg specks */}
      <Circle cx="62" cy="48" r="6" fill={`url(#${p}-curry)`} />
      <Circle cx="43" cy="45" r="2.2" fill="#6FA83E" />
      <Circle cx="55" cy="53" r="2.2" fill="#E0692F" />
      {/* front rim lip — occludes the rice base so it sits IN the bowl */}
      <Path d="M22,54 a28,9 0 0 0 56,0 z" fill={`url(#${p}-bowl)`} />
      <Path d="M23,53.5 a27,7 0 0 0 54,0" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" />
    </G>
  );
}

// ── Snack: a fresh watermelon slice ───────────────────────────────────────
function Watermelon({ p }: { p: string }) {
  return (
    <G>
      <Defs>
        <LinearGradient id={`${p}-rind`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#6DBE4B" />
          <Stop offset="100%" stopColor="#3E8B2E" />
        </LinearGradient>
        <RadialGradient id={`${p}-flesh`} cx="50%" cy="20%" r="90%">
          <Stop offset="0%" stopColor="#FF8A9B" />
          <Stop offset="60%" stopColor="#F8546B" />
          <Stop offset="100%" stopColor="#E23350" />
        </RadialGradient>
      </Defs>
      <Shadow />
      {/* stacked bands: green rind → white pith → red flesh */}
      <Path d="M16,42 a34,26 0 0 0 68,0 z" fill={`url(#${p}-rind)`} />
      <Path d="M21,42 a29,22 0 0 0 58,0 z" fill="#F4F3E6" />
      <Path d="M25,42 a25,19 0 0 0 50,0 z" fill={`url(#${p}-flesh)`} />
      {/* seeds */}
      <Ellipse cx="42" cy="50" rx="1.7" ry="2.6" fill="#3A241A" transform="rotate(-14 42 50)" />
      <Ellipse cx="55" cy="53" rx="1.7" ry="2.6" fill="#3A241A" transform="rotate(10 55 53)" />
      <Ellipse cx="50" cy="47" rx="1.7" ry="2.6" fill="#3A241A" />
      <Ellipse cx="62" cy="48" rx="1.7" ry="2.6" fill="#3A241A" transform="rotate(18 62 48)" />
      <Ellipse cx="36" cy="46" rx="1.7" ry="2.6" fill="#3A241A" transform="rotate(-20 36 46)" />
      {/* gloss */}
      <Path d="M30,44 a20,15 0 0 1 8,-2" stroke="rgba(255,255,255,0.5)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </G>
  );
}
