// Thali — design system v3 "Sky Glass".
// Premium blue glassmorphism with playful kawaii touches (soft pastel sticker
// tags, a cute mascot, floating white cards). Palette + glass spec per brief;
// warmth swapped for calm sky-blue. Every value here is intentional.

// ─── Fonts (loaded in app/_layout via @expo-google-fonts) ──────────────────
export const fonts = {
  regular:   'PlusJakartaSans_400Regular',
  medium:    'PlusJakartaSans_500Medium',
  semibold:  'PlusJakartaSans_600SemiBold',
  bold:      'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
  numSemi:   'Manrope_600SemiBold',
  numBold:   'Manrope_700Bold',
  numX:      'Manrope_800ExtraBold',
  mono:      'Menlo',
} as const;

// ─── Palette ────────────────────────────────────────────────────────────────
export const colors = {
  // surfaces
  bg:          '#EAF6FC',        // sky
  bgAlt:       '#E1F0FB',
  surface:     '#FFFFFF',
  surfaceAlt:  '#EAF1FF',        // pale periwinkle card
  surfaceWarm: '#E4F6FF',        // pale cyan (legacy name kept)
  surfaceMint: '#E6F7F1',        // pale aqua-mint
  surfaceSky:  '#E9F1FB',
  border:      'rgba(29,29,31,0.06)',
  borderStrong:'rgba(29,29,31,0.12)',
  divider:     'rgba(29,29,31,0.05)',

  // glass (per spec)
  glass:       'rgba(255,255,255,0.65)',
  glassStrong: 'rgba(255,255,255,0.78)',
  glassBorder: 'rgba(255,255,255,0.55)',
  scrim:       'rgba(20,40,70,0.38)',

  // text
  text:        '#1D1D1F',
  textSoft:    '#3A3F4A',
  textMuted:   '#6F7482',
  textFaint:   '#A2A8B4',
  onDark:      '#FFFFFF',

  // brand — blue → lavender → cyan
  brand:       '#6EA8FF',        // primary
  brandDeep:   '#4C8AF0',
  brandSoft:   '#B9D3FF',
  brandTint:   '#E7F0FF',

  secondary:   '#A69CFF',        // lavender
  secondaryDeep:'#8A7DF0',
  secondaryTint:'#EDEBFF',

  accent:      '#73D6FF',        // cyan
  accentDeep:  '#3FB6E8',
  accentSoft:  '#C4EEFF',
  accentTint:  '#E4F6FF',

  ink:         '#141A24',        // near-black for pill CTAs (kawaii ref)

  gold:        '#7AB8FF',        // legacy alias → blue
  goldSoft:    '#CFE4FF',

  // semantics (iOS-ish)
  success:     '#34C77E',
  successSoft: '#CFF3E1',
  warning:     '#FFB020',
  warningSoft: '#FFE7BC',
  danger:      '#FF5A5F',
  dangerSoft:  '#FFD6D8',
  info:        '#6EA8FF',
  infoSoft:    '#D6E6FF',

  // macro chips
  protein:     '#6EA8FF',
  carbs:       '#A69CFF',
  fat:         '#73D6FF',
  water:       '#3FB6E8',
  fiber:       '#34C77E',
} as const;

export type ColorToken = keyof typeof colors;

// Gradients
export const gradients = {
  brand:      ['#6EA8FF', '#A69CFF'] as [string, string],
  brandCalm:  ['#6EA8FF', '#73D6FF'] as [string, string],
  peach:      ['#73D6FF', '#6EA8FF'] as [string, string],  // legacy name → cyan-blue
  sunrise:    ['#EAF6FC', '#F4FBFF'] as [string, string],   // hero bg
  parchment:  ['#EAF6FC', '#E1F0FB'] as [string, string],   // screen bg
  mint:       ['#7CE0C0', '#34C77E'] as [string, string],
  sky:        ['#8FC7FF', '#6EA8FF'] as [string, string],
  gold:       ['#A9D4FF', '#6EA8FF'] as [string, string],
  ink:        ['#232B38', '#141A24'] as [string, string],   // dark pill CTA
  glassSheen: ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.5)'] as [string, string],
  // playful sticker tags
  tagYellow:  ['#FFE39A', '#FFD166'] as [string, string],
  tagPink:    ['#FFC7DE', '#FF9EC4'] as [string, string],
  tagPurple:  ['#C9BFFF', '#A69CFF'] as [string, string],
  tagBlue:    ['#AFD6FF', '#73D6FF'] as [string, string],
} as const;

// ─── Spacing ────────────────────────────────────────────────────────────────
export const spacing = {
  xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48, huge: 64,
} as const;

// ─── Radii — 32 is the card default per brief ──────────────────────────────
export const radii = {
  xs: 8, sm: 12, md: 18, lg: 24, xl: 28, xxl: 32, huge: 40, pill: 999,
} as const;

// ─── Typography ─────────────────────────────────────────────────────────────
export const type = {
  displayXL: { fontFamily: fonts.extrabold, fontSize: 44, lineHeight: 50, letterSpacing: -1.2, fontWeight: '800' as const },
  display:   { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: -0.8, fontWeight: '800' as const },
  h1:        { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5, fontWeight: '700' as const },
  h2:        { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3, fontWeight: '700' as const },
  h3:        { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2, fontWeight: '600' as const },
  bodyLg:    { fontFamily: fonts.regular, fontSize: 17, lineHeight: 26, fontWeight: '400' as const },
  body:      { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, fontWeight: '400' as const },
  bodyBold:  { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, fontWeight: '600' as const },
  label:     { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, letterSpacing: 0.2, fontWeight: '600' as const },
  caption:   { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  captionBold:{ fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  tiny:      { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, letterSpacing: 0.4, fontWeight: '500' as const },
  numeric:   { fontFamily: fonts.numX, fontSize: 44, lineHeight: 48, letterSpacing: -1.5, fontWeight: '800' as const },
  numericLg: { fontFamily: fonts.numX, fontSize: 64, lineHeight: 68, letterSpacing: -2, fontWeight: '800' as const },
  mono:      { fontFamily: fonts.mono, fontSize: 13 },
} as const;

// ─── Shadows (per spec: 0 20px 60px rgba(0,0,0,.08)) ───────────────────────
export const shadow = {
  none: { shadowColor: '#000', shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 },
  card: {
    shadowColor: '#1B3A63', shadowOpacity: 0.08, shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 }, elevation: 3,
  },
  cardHover: {
    shadowColor: '#1B3A63', shadowOpacity: 0.12, shadowRadius: 40,
    shadowOffset: { width: 0, height: 26 }, elevation: 6,
  },
  floating: {
    shadowColor: '#12294a', shadowOpacity: 0.16, shadowRadius: 44,
    shadowOffset: { width: 0, height: 24 }, elevation: 10,
  },
  brandGlow: {
    shadowColor: '#6EA8FF', shadowOpacity: 0.4, shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 }, elevation: 8,
  },
  accentGlow: {
    shadowColor: '#73D6FF', shadowOpacity: 0.4, shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 }, elevation: 8,
  },
} as const;

// ─── Motion ─────────────────────────────────────────────────────────────────
export const motion = {
  duration: { fast: 140, base: 220, slow: 380, hero: 600 },
  spring: {
    soft:  { damping: 20, stiffness: 150, mass: 0.9 },
    firm:  { damping: 22, stiffness: 240, mass: 0.8 },
    press: { damping: 22, stiffness: 380, mass: 0.7 },
  },
  ease: { standard: [0.2, 0.8, 0.2, 1] as const, exit: [0.4, 0, 1, 1] as const },
} as const;

// ─── Semantic helpers ───────────────────────────────────────────────────────
export function budgetTone(consumed: number, budget: number): 'good' | 'edge' | 'over' {
  if (budget <= 0) return 'edge';
  const r = consumed / budget;
  if (r > 1.05) return 'over';
  if (r > 0.9) return 'edge';
  return 'good';
}
export const toneColor = {
  good: { fg: colors.success, bg: colors.successSoft },
  edge: { fg: colors.warning, bg: colors.warningSoft },
  over: { fg: colors.danger,  bg: colors.dangerSoft  },
} as const;
