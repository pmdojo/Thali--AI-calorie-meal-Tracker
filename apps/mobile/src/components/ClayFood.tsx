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

// Soft-clay 3D ingredient illustrations — the same art language as Food3D,
// extended to every item the onboarding plate-picker needs. Volume from
// gradients, gloss from highlights. Vector, so they stay crisp from an 18px
// chip up to a 60px katori.
export type ClayId =
  | 'rice' | 'dal' | 'sabzi' | 'roti' | 'curd'
  | 'paneer' | 'egg' | 'fish' | 'chicken' | 'extras' | 'thali';

export function ClayFood({ id, size = 24 }: { id: ClayId; size?: number }) {
  const p = `clay-${id}`;
  const Art = ART[id] ?? ART.thali;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Art p={p} />
    </Svg>
  );
}

function Shadow({ cy = 84, rx = 22, ry = 4 }: { cy?: number; rx?: number; ry?: number }) {
  return <Ellipse cx="50" cy={cy} rx={rx} ry={ry} fill="rgba(90,45,15,0.12)" />;
}

// A warm ceramic bowl (body + rim), reused by rice / dal.
function Bowl({ p, tone = ['#F1E7D4', '#D7C4A5'] as const }: { p: string; tone?: readonly [string, string] }) {
  return (
    <G>
      <Defs>
        <LinearGradient id={`${p}-bowl`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={tone[0]} />
          <Stop offset="100%" stopColor={tone[1]} />
        </LinearGradient>
      </Defs>
      <Path d="M24,54 a26,26 0 0 0 52,0 z" fill={`url(#${p}-bowl)`} />
      <Ellipse cx="50" cy="54" rx="26" ry="6.5" fill="#F6EEDF" />
      <Ellipse cx="50" cy="54" rx="21" ry="4.6" fill="rgba(120,90,50,0.14)" />
    </G>
  );
}

const ART: Record<ClayId, (props: { p: string }) => React.JSX.Element> = {
  rice: ({ p }) => (
    <G>
      <Defs>
        <RadialGradient id={`${p}-r`} cx="45%" cy="30%" r="80%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#ECE6D6" />
        </RadialGradient>
      </Defs>
      <Shadow />
      <Path d="M24,54 a26,26 0 0 0 52,0 z" fill="#E9DCC2" />
      <Circle cx="40" cy="45" r="10" fill={`url(#${p}-r)`} />
      <Circle cx="54" cy="42" r="11" fill={`url(#${p}-r)`} />
      <Circle cx="50" cy="50" r="11" fill={`url(#${p}-r)`} />
      <Circle cx="61" cy="49" r="8" fill={`url(#${p}-r)`} />
      <Ellipse cx="50" cy="54" rx="26" ry="6.5" fill="#F3EAD9" opacity="0.9" />
    </G>
  ),

  dal: ({ p }) => (
    <G>
      <Defs>
        <RadialGradient id={`${p}-d`} cx="42%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#FFD84F" />
          <Stop offset="100%" stopColor="#EE951B" />
        </RadialGradient>
      </Defs>
      <Shadow />
      <Bowl p={p} />
      <Ellipse cx="50" cy="51" rx="20" ry="5.6" fill={`url(#${p}-d)`} />
      <Ellipse cx="44" cy="49" rx="4" ry="1.6" fill="rgba(255,255,255,0.45)" />
      {/* tempering specks + a coriander leaf */}
      <Circle cx="55" cy="51" r="1.7" fill="#8C3B1E" />
      <Circle cx="49" cy="53" r="1.5" fill="#6E2E17" />
      <Path d="M58,49 q3,-2 5,0 q-2,3 -5,0 z" fill="#4C8528" />
    </G>
  ),

  sabzi: ({ p }) => (
    <G>
      <Defs>
        <RadialGradient id={`${p}-l1`} cx="40%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#A7D96B" />
          <Stop offset="100%" stopColor="#5E9B32" />
        </RadialGradient>
        <RadialGradient id={`${p}-l2`} cx="40%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#8FCB57" />
          <Stop offset="100%" stopColor="#4C8528" />
        </RadialGradient>
      </Defs>
      <Shadow />
      <Circle cx="36" cy="52" r="13" fill={`url(#${p}-l2)`} />
      <Circle cx="64" cy="50" r="14" fill={`url(#${p}-l1)`} />
      <Circle cx="50" cy="42" r="15" fill={`url(#${p}-l1)`} />
      <Circle cx="45" cy="50" r="11" fill={`url(#${p}-l2)`} />
      <Circle cx="58" cy="48" r="10" fill={`url(#${p}-l2)`} />
      {/* carrot + tomato specks */}
      <Circle cx="60" cy="55" r="4.5" fill="#E9812F" />
      <Circle cx="40" cy="46" r="4" fill="#E5473C" />
      <Ellipse cx="48" cy="38" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
    </G>
  ),

  roti: ({ p }) => (
    <G>
      <Defs>
        <RadialGradient id={`${p}-b`} cx="40%" cy="32%" r="80%">
          <Stop offset="0%" stopColor="#FADFA2" />
          <Stop offset="100%" stopColor="#E3AF56" />
        </RadialGradient>
      </Defs>
      <Shadow cy={76} rx={28} />
      <Ellipse cx="50" cy="54" rx="35" ry="26" fill={`url(#${p}-b)`} />
      <Path d="M20,58 a34,26 0 0 0 60,0 q-30,10 -60,0 z" fill="#C79A54" opacity="0.55" />
      <Ellipse cx="43" cy="47" rx="13" ry="7" fill="rgba(255,255,255,0.28)" />
      {/* toasted spots */}
      <Ellipse cx="58" cy="50" rx="3.4" ry="2.4" fill="#B0763A" opacity="0.75" />
      <Ellipse cx="40" cy="60" rx="3" ry="2.1" fill="#B0763A" opacity="0.7" />
      <Ellipse cx="62" cy="60" rx="2.4" ry="1.8" fill="#B0763A" opacity="0.6" />
      <Ellipse cx="50" cy="45" rx="2.2" ry="1.6" fill="#B0763A" opacity="0.6" />
    </G>
  ),

  curd: ({ p }) => (
    <G>
      <Defs>
        <LinearGradient id={`${p}-g`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#EAF1F6" />
          <Stop offset="45%" stopColor="#FBFDFE" />
          <Stop offset="100%" stopColor="#D6E2EA" />
        </LinearGradient>
      </Defs>
      <Shadow cy={82} rx={18} />
      {/* tumbler */}
      <Path d="M34,32 h32 l-4,42 a12,6 0 0 1 -24,0 z" fill={`url(#${p}-g)`} />
      {/* curd fill */}
      <Path d="M37,37 h26 l-1.5,10 a11,4 0 0 1 -23,0 z" fill="#FFFFFF" />
      <Ellipse cx="50" cy="34" rx="16" ry="4" fill="#FFFFFF" />
      <Ellipse cx="50" cy="34" rx="13" ry="2.6" fill="#EFF4F1" />
      {/* glass gloss */}
      <Path d="M40,40 l-2,28" stroke="rgba(255,255,255,0.7)" strokeWidth="2.4" strokeLinecap="round" />
    </G>
  ),

  paneer: ({ p }) => (
    <G>
      <Defs>
        <LinearGradient id={`${p}-t`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFDF6" />
          <Stop offset="100%" stopColor="#F6EFDD" />
        </LinearGradient>
      </Defs>
      <Shadow rx={24} />
      {/* back small cube */}
      <G opacity="0.96">
        <Path d="M58,40 l12,-6 12,6 -12,6 z" fill="#FFFDF6" />
        <Path d="M58,40 l12,6 v13 l-12,-6 z" fill="#EFE5CC" />
        <Path d="M82,40 l-12,6 v13 l12,-6 z" fill="#E2D3B2" />
      </G>
      {/* front big cube */}
      <Path d="M30,44 l20,-10 20,10 -20,10 z" fill={`url(#${p}-t)`} />
      <Path d="M30,44 l20,10 v20 l-20,-10 z" fill="#F0E6CE" />
      <Path d="M70,44 l-20,10 v20 l20,-10 z" fill="#E3D4B4" />
      {/* soft paneer pores */}
      <Circle cx="44" cy="60" r="1.2" fill="rgba(150,120,70,0.25)" />
      <Circle cx="58" cy="62" r="1" fill="rgba(150,120,70,0.22)" />
    </G>
  ),

  egg: ({ p }) => (
    <G>
      <Defs>
        <RadialGradient id={`${p}-y`} cx="40%" cy="35%" r="70%">
          <Stop offset="0%" stopColor="#FFD86B" />
          <Stop offset="55%" stopColor="#FFB01F" />
          <Stop offset="100%" stopColor="#EF8A12" />
        </RadialGradient>
        <RadialGradient id={`${p}-w`} cx="45%" cy="35%" r="75%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#F1E7DA" />
        </RadialGradient>
      </Defs>
      <Shadow cy={76} rx={26} />
      <Path d="M34,42 q-12,-1 -12,11 q-9,3 -3,12 q-1,10 10,9 q7,5 15,1 q11,2 11,-9 q8,-5 1,-13 q1,-11 -12,-10 q-5,-4 -10,-1 z" fill={`url(#${p}-w)`} />
      <Circle cx="52" cy="52" r="11" fill={`url(#${p}-y)`} />
      <Ellipse cx="48" cy="48" rx="3.6" ry="2.6" fill="rgba(255,255,255,0.65)" />
    </G>
  ),

  fish: ({ p }) => (
    <G>
      <Defs>
        <LinearGradient id={`${p}-f`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#AFD0D5" />
          <Stop offset="100%" stopColor="#5F8A91" />
        </LinearGradient>
      </Defs>
      <Shadow cy={78} rx={26} />
      {/* body pointing left, tail right */}
      <Path d="M22,52 q16,-19 42,-11 q-7,11 0,22 q-26,8 -42,-11 z" fill={`url(#${p}-f)`} />
      {/* tail */}
      <Path d="M60,42 l18,-9 -5,19 z" fill="#4E767C" />
      {/* top fin */}
      <Path d="M40,38 q8,-8 16,-3 q-8,3 -16,3 z" fill="#547E85" />
      {/* eye + gill + gloss */}
      <Circle cx="33" cy="49" r="2.6" fill="#FFFFFF" />
      <Circle cx="33" cy="49" r="1.3" fill="#2A3B3D" />
      <Path d="M44,44 q3,8 0,16" stroke="rgba(40,60,62,0.3)" strokeWidth="1.6" fill="none" />
      <Path d="M30,45 q10,-4 22,0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </G>
  ),

  chicken: ({ p }) => (
    <G>
      <Defs>
        <RadialGradient id={`${p}-m`} cx="40%" cy="32%" r="75%">
          <Stop offset="0%" stopColor="#E4AF6E" />
          <Stop offset="100%" stopColor="#A96A32" />
        </RadialGradient>
      </Defs>
      <Shadow cy={80} rx={22} />
      {/* bone */}
      <Path d="M40,56 l-14,15" stroke="#F4EAD6" strokeWidth="7" strokeLinecap="round" />
      <Circle cx="24" cy="73" r="5" fill="#F5EEDF" />
      <Circle cx="30" cy="67" r="4.2" fill="#F5EEDF" />
      {/* meat */}
      <Ellipse cx="56" cy="44" rx="21" ry="19" fill={`url(#${p}-m)`} />
      <Ellipse cx="49" cy="37" rx="7" ry="4.6" fill="rgba(255,255,255,0.28)" />
      <Ellipse cx="62" cy="52" rx="6" ry="3" fill="rgba(90,45,15,0.18)" />
    </G>
  ),

  extras: ({ p }) => (
    <G>
      <Defs>
        <RadialGradient id={`${p}-n`} cx="40%" cy="30%" r="80%">
          <Stop offset="0%" stopColor="#EAC98C" />
          <Stop offset="100%" stopColor="#C79A54" />
        </RadialGradient>
      </Defs>
      <Shadow cy={80} rx={22} />
      <G transform="rotate(-18 50 52)">
        <Path d="M44,30 q11,0 11,11 q0,5 -4,8 q4,4 4,10 q0,12 -11,12 q-11,0 -11,-12 q0,-6 4,-10 q-4,-3 -4,-8 q0,-11 11,-11 z" fill={`url(#${p}-n)`} />
        <Path d="M38,40 q6,3 12,0 M38,58 q6,3 12,0" stroke="rgba(120,80,30,0.35)" strokeWidth="1.5" fill="none" />
      </G>
      <G transform="rotate(14 66 60)">
        <Path d="M64,48 q8,0 8,8 q0,3.5 -3,6 q3,3 3,7 q0,8.5 -8,8.5 q-8,0 -8,-8.5 q0,-4 3,-7 q-3,-2.5 -3,-6 q0,-8 8,-8 z" fill={`url(#${p}-n)`} />
      </G>
    </G>
  ),

  thali: ({ p }) => (
    <G>
      <Defs>
        <RadialGradient id={`${p}-pl`} cx="42%" cy="30%" r="80%">
          <Stop offset="0%" stopColor="#FCF5E9" />
          <Stop offset="100%" stopColor="#E7D8BE" />
        </RadialGradient>
        <RadialGradient id={`${p}-dal`} cx="40%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#FFD84F" />
          <Stop offset="100%" stopColor="#EE951B" />
        </RadialGradient>
      </Defs>
      <Shadow cy={82} rx={28} />
      <Circle cx="50" cy="52" r="32" fill={`url(#${p}-pl)`} />
      <Circle cx="50" cy="52" r="32" fill="none" stroke="rgba(120,90,50,0.14)" strokeWidth="2" />
      <Circle cx="50" cy="52" r="12" fill="#FBF4E8" stroke="rgba(120,90,50,0.12)" strokeWidth="1.5" />
      {/* katori dots: dal, sabzi, rice */}
      <Circle cx="50" cy="33" r="8" fill={`url(#${p}-dal)`} />
      <Circle cx="67" cy="58" r="8" fill="#6FA83E" />
      <Circle cx="34" cy="60" r="8" fill="#F1E7D2" />
      <Ellipse cx="48" cy="31" rx="2.4" ry="1.4" fill="rgba(255,255,255,0.5)" />
    </G>
  ),
};
