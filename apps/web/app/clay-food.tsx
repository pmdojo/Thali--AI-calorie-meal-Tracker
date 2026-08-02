// Soft-clay 3D food illustrations for the web (plain DOM SVG) — the same art
// language as the app's ClayFood component, so the landing and app feel like
// one product. Volume from gradients, gloss from highlights, a soft contact
// shadow so each reads as floating.
export type ClayKind = 'thali' | 'dal' | 'sabzi';

export function ClayIcon({ kind, size = 56 }: { kind: ClayKind; size?: number }) {
  const p = `clayw-${kind}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {kind === 'thali' && <Thali p={p} />}
      {kind === 'dal' && <Dal p={p} />}
      {kind === 'sabzi' && <Sabzi p={p} />}
    </svg>
  );
}

function Shadow({ cy = 84, rx = 22, ry = 4 }: { cy?: number; rx?: number; ry?: number }) {
  return <ellipse cx="50" cy={cy} rx={rx} ry={ry} fill="rgba(90,45,15,0.12)" />;
}

function Thali({ p }: { p: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${p}-pl`} cx="42%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FCF5E9" />
          <stop offset="100%" stopColor="#E7D8BE" />
        </radialGradient>
        <radialGradient id={`${p}-dal`} cx="40%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFD84F" />
          <stop offset="100%" stopColor="#EE951B" />
        </radialGradient>
      </defs>
      <Shadow cy={82} rx={28} />
      <circle cx="50" cy="52" r="32" fill={`url(#${p}-pl)`} />
      <circle cx="50" cy="52" r="32" fill="none" stroke="rgba(120,90,50,0.14)" strokeWidth="2" />
      <circle cx="50" cy="52" r="12" fill="#FBF4E8" stroke="rgba(120,90,50,0.12)" strokeWidth="1.5" />
      <circle cx="50" cy="33" r="8" fill={`url(#${p}-dal)`} />
      <circle cx="67" cy="58" r="8" fill="#6FA83E" />
      <circle cx="34" cy="60" r="8" fill="#F1E7D2" />
      <ellipse cx="48" cy="31" rx="2.4" ry="1.4" fill="rgba(255,255,255,0.5)" />
    </g>
  );
}

function Bowl({ p }: { p: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${p}-bowl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1E7D4" />
          <stop offset="100%" stopColor="#D7C4A5" />
        </linearGradient>
      </defs>
      <path d="M24,54 a26,26 0 0 0 52,0 z" fill={`url(#${p}-bowl)`} />
      <ellipse cx="50" cy="54" rx="26" ry="6.5" fill="#F6EEDF" />
      <ellipse cx="50" cy="54" rx="21" ry="4.6" fill="rgba(120,90,50,0.14)" />
    </g>
  );
}

function Dal({ p }: { p: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${p}-d`} cx="42%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFD84F" />
          <stop offset="100%" stopColor="#EE951B" />
        </radialGradient>
      </defs>
      <Shadow />
      <Bowl p={p} />
      <ellipse cx="50" cy="51" rx="20" ry="5.6" fill={`url(#${p}-d)`} />
      <ellipse cx="44" cy="49" rx="4" ry="1.6" fill="rgba(255,255,255,0.45)" />
      <circle cx="55" cy="51" r="1.7" fill="#8C3B1E" />
      <circle cx="49" cy="53" r="1.5" fill="#6E2E17" />
      <path d="M58,49 q3,-2 5,0 q-2,3 -5,0 z" fill="#4C8528" />
    </g>
  );
}

function Sabzi({ p }: { p: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${p}-l1`} cx="40%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#A7D96B" />
          <stop offset="100%" stopColor="#5E9B32" />
        </radialGradient>
        <radialGradient id={`${p}-l2`} cx="40%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#8FCB57" />
          <stop offset="100%" stopColor="#4C8528" />
        </radialGradient>
      </defs>
      <Shadow />
      <circle cx="36" cy="52" r="13" fill={`url(#${p}-l2)`} />
      <circle cx="64" cy="50" r="14" fill={`url(#${p}-l1)`} />
      <circle cx="50" cy="42" r="15" fill={`url(#${p}-l1)`} />
      <circle cx="45" cy="50" r="11" fill={`url(#${p}-l2)`} />
      <circle cx="58" cy="48" r="10" fill={`url(#${p}-l2)`} />
      <circle cx="60" cy="55" r="4.5" fill="#E9812F" />
      <circle cx="40" cy="46" r="4" fill="#E5473C" />
      <ellipse cx="48" cy="38" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
    </g>
  );
}
