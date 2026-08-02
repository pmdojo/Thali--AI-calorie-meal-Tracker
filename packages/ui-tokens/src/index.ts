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
  serifSemi: 'PlayfairDisplay_600SemiBold',   // elegant serif headings
  serifBold: 'PlayfairDisplay_700Bold',
  serifX:    'PlayfairDisplay_800ExtraBold',
  mono:      'Menlo',
} as const;

// ─── Palette ────────────────────────────────────────────────────────────────
export const colors = {
  // surfaces — warm cream / peach (matches the landing)
  bg:          '#F5E7D0',        // warm cream
  bgAlt:       '#EFDCC0',
  surface:     '#FFFFFF',
  surfaceAlt:  '#F5ECDB',        // pale gold card
  surfaceWarm: '#F6E7D6',        // pale clay
  surfaceMint: '#ECEEDC',        // pale olive
  surfaceSky:  '#F0E7D6',        // pale sand
  border:      'rgba(42,36,29,0.08)',
  borderStrong:'rgba(42,36,29,0.14)',
  divider:     'rgba(42,36,29,0.06)',

  // glass (per spec)
  glass:       'rgba(255,255,255,0.62)',
  glassStrong: 'rgba(255,252,246,0.80)',
  glassBorder: 'rgba(255,255,255,0.60)',
  scrim:       'rgba(42,36,29,0.42)',

  // text
  text:        '#2A241D',
  textSoft:    '#4A4238',
  textMuted:   '#857B6C',
  textFaint:   '#A79C8A',
  onDark:      '#FBF7F0',

  // brand — terracotta orange (matches the landing)
  brand:       '#DD8A46',        // terracotta orange
  brandDeep:   '#C26E2E',
  brandSoft:   '#F2C79A',
  brandTint:   '#FBE6CE',

  secondary:   '#B5714B',        // terracotta clay
  secondaryDeep:'#96592F',
  secondaryTint:'#F3E1D2',

  accent:      '#E39A57',        // warm amber-orange
  accentDeep:  '#C26E2E',
  accentSoft:  '#F2C79A',
  accentTint:  '#FBE6CE',

  ink:         '#2A241D',        // near-black warm for pill CTAs

  gold:        '#DD8A46',
  goldSoft:    '#F2C79A',

  // semantics (warm-harmonised)
  success:     '#6E8B4E',        // olive
  successSoft: '#DCE6C6',
  warning:     '#E39A57',
  warningSoft: '#F7DAB8',
  danger:      '#C1553B',        // terracotta red
  dangerSoft:  '#F0CFC4',
  info:        '#DD8A46',
  infoSoft:    '#FBE6CE',

  // macro chips — earthy hues (protein leads with the orange brand)
  protein:     '#DD8A46',        // terracotta orange
  carbs:       '#B5714B',        // clay
  fat:         '#A88A3A',        // bronze
  water:       '#6E8B7A',        // sage
  fiber:       '#7E8B4E',        // olive
} as const;

export type ColorToken = keyof typeof colors;

// Gradients
export const gradients = {
  brand:      ['#E39A57', '#C26E2E'] as [string, string],   // terracotta orange
  brandCalm:  ['#F2C79A', '#DD8A46'] as [string, string],
  peach:      ['#E39A57', '#C26E2E'] as [string, string],   // warm orange
  sunrise:    ['#F8ECD6', '#F3DCBE'] as [string, string],   // hero bg (cream→peach)
  parchment:  ['#F8ECD6', '#EBC99C'] as [string, string],   // screen bg (cream→peach)
  mint:       ['#9BB06E', '#6E8B4E'] as [string, string],
  sky:        ['#F2C79A', '#E0A35A'] as [string, string],
  gold:       ['#F2C79A', '#DD8A46'] as [string, string],
  ink:        ['#3A2E1D', '#2A241D'] as [string, string],   // dark pill CTA
  glassSheen: ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.5)'] as [string, string],
  // warm sticker tags (legacy names kept)
  tagYellow:  ['#F7D8A8', '#EDB877'] as [string, string],
  tagPink:    ['#F0C7A8', '#E0A37B'] as [string, string],
  tagPurple:  ['#EAC79C', '#D8A86F'] as [string, string],
  tagBlue:    ['#F2C79A', '#DD8A46'] as [string, string],
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
  displayXL: { fontFamily: fonts.serifX, fontSize: 46, lineHeight: 52, letterSpacing: -1, fontWeight: '800' as const },
  display:   { fontFamily: fonts.serifX, fontSize: 36, lineHeight: 42, letterSpacing: -0.6, fontWeight: '800' as const },
  h1:        { fontFamily: fonts.serifBold, fontSize: 29, lineHeight: 36, letterSpacing: -0.4, fontWeight: '700' as const },
  h2:        { fontFamily: fonts.serifBold, fontSize: 23, lineHeight: 30, letterSpacing: -0.2, fontWeight: '700' as const },
  h3:        { fontFamily: fonts.serifSemi, fontSize: 19, lineHeight: 25, letterSpacing: -0.1, fontWeight: '600' as const },
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
    shadowColor: '#3C3020', shadowOpacity: 0.10, shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 }, elevation: 3,
  },
  cardHover: {
    shadowColor: '#3C3020', shadowOpacity: 0.14, shadowRadius: 40,
    shadowOffset: { width: 0, height: 26 }, elevation: 6,
  },
  floating: {
    shadowColor: '#2A2114', shadowOpacity: 0.18, shadowRadius: 44,
    shadowOffset: { width: 0, height: 24 }, elevation: 10,
  },
  brandGlow: {
    shadowColor: '#DD8A46', shadowOpacity: 0.42, shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 }, elevation: 8,
  },
  accentGlow: {
    shadowColor: '#E39A57', shadowOpacity: 0.4, shadowRadius: 28,
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
