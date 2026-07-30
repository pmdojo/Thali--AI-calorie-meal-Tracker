// Thali — design system v2 (premium 2026 SaaS).
// Warm, calm, AI-first. Draws from Apple's "materials" thinking (surfaces layered
// on colored bases), Linear's precise typography and shadows, and Airbnb's warm
// hospitality color story. Every value here is intentional — never tweak in a
// component; extend a token instead.

// ─── Palette ──────────────────────────────────────────────────────────────
// Anchor: cream (#FBF7F0) base + deep plum (#1B1830) text + brand lavender +
// spice-warm accent. Everything else is a tint or shade of these five.

export const colors = {
  // Surfaces (light "materials")
  bg:          '#FBF7F0',        // warm parchment
  bgAlt:       '#F3EEE4',        // subtle depth for stacked surfaces
  surface:     '#FFFFFF',
  surfaceAlt:  '#F5F1FB',        // pale lavender card fill
  surfaceWarm: '#FDF0E4',        // pale peach card fill
  surfaceMint: '#EAF7EF',        // pale mint card fill
  surfaceSky:  '#E9F1FB',        // pale sky card fill
  border:      'rgba(27, 24, 48, 0.06)',
  borderStrong:'rgba(27, 24, 48, 0.12)',
  divider:     'rgba(27, 24, 48, 0.04)',

  // Glass (translucent overlays)
  glass:       'rgba(255,255,255,0.72)',
  glassStrong: 'rgba(255,255,255,0.88)',
  glassBorder: 'rgba(255,255,255,0.55)',
  scrim:       'rgba(27, 24, 48, 0.45)',

  // Text
  text:        '#1B1830',
  textSoft:    '#3A3556',
  textMuted:   '#6B6488',
  textFaint:   '#9B95B4',
  onDark:      '#FBF7F0',

  // Brand — lavender (primary) → peach (accent) gradient system
  brand:       '#7A5AF8',        // primary lavender, richer than v1
  brandDeep:   '#5B3FE0',
  brandSoft:   '#C7BAFC',
  brandTint:   '#EFEAFD',

  accent:      '#F26B3A',        // turmeric-forward orange
  accentDeep:  '#D95721',
  accentSoft:  '#FBCFB5',
  accentTint:  '#FDECDE',

  gold:        '#D9A24B',
  goldSoft:    '#F2D8A5',

  // Semantics
  success:     '#2FA679',
  successSoft: '#C7ECD9',
  warning:     '#E5A72B',
  warningSoft: '#F8E1B0',
  danger:      '#DC5350',
  dangerSoft:  '#F4C8C6',
  info:        '#3B8FE2',
  infoSoft:    '#C9DFF7',

  // Macro chips (calmer, category-coded)
  protein:     '#7A5AF8',
  carbs:       '#E5A72B',
  fat:         '#F26B3A',
  water:       '#3B8FE2',
  fiber:       '#2FA679',
} as const;

// Gradient stops — used with expo-linear-gradient
export const gradients = {
  brand:      ['#8F70FF', '#F26B3A'] as [string, string],   // hero / CTA
  brandCalm:  ['#7A5AF8', '#B291FF'] as [string, string],
  peach:      ['#F26B3A', '#F2A76B'] as [string, string],
  sunrise:    ['#FDECDE', '#F5F1FB'] as [string, string],   // hero bg
  parchment:  ['#FBF7F0', '#F3EEE4'] as [string, string],
  mint:       ['#7BC69C', '#2FA679'] as [string, string],
  sky:        ['#8DB6E8', '#3B8FE2'] as [string, string],
  gold:       ['#F2D8A5', '#D9A24B'] as [string, string],
  glassSheen: ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.55)'] as [string, string],
} as const;

// ─── Spacing (8pt with 4pt half-steps) ────────────────────────────────────
export const spacing = {
  xxs: 2,
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
  xxxl:48,
  huge:64,
} as const;

// ─── Radii — 24 as system default, per redesign brief ─────────────────────
export const radii = {
  xs:   6,
  sm:   10,
  md:   16,
  lg:   20,
  xl:   24,       // system default for cards
  xxl:  32,       // hero cards
  huge: 40,
  pill: 999,
} as const;

// ─── Typography ────────────────────────────────────────────────────────────
// Uses system fonts (SF Pro on iOS, Roboto on Android) with tight tracking
// and clean line-heights. No Google font network dep.
const family = { sans: 'System', mono: 'Menlo' } as const;

export const type = {
  // Display / hero
  displayXL: { fontFamily: family.sans, fontSize: 44, lineHeight: 48, fontWeight: '800' as const, letterSpacing: -1.2 },
  display:   { fontFamily: family.sans, fontSize: 34, lineHeight: 40, fontWeight: '800' as const, letterSpacing: -0.8 },

  // Headings
  h1:        { fontFamily: family.sans, fontSize: 28, lineHeight: 34, fontWeight: '700' as const, letterSpacing: -0.6 },
  h2:        { fontFamily: family.sans, fontSize: 22, lineHeight: 28, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3:        { fontFamily: family.sans, fontSize: 18, lineHeight: 24, fontWeight: '600' as const, letterSpacing: -0.2 },

  // Body
  bodyLg:    { fontFamily: family.sans, fontSize: 17, lineHeight: 25, fontWeight: '400' as const },
  body:      { fontFamily: family.sans, fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyBold:  { fontFamily: family.sans, fontSize: 15, lineHeight: 22, fontWeight: '600' as const },

  // Ancillary
  label:     { fontFamily: family.sans, fontSize: 13, lineHeight: 18, fontWeight: '600' as const, letterSpacing: 0.2 },
  caption:   { fontFamily: family.sans, fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  captionBold:{fontFamily: family.sans, fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  tiny:      { fontFamily: family.sans, fontSize: 11, lineHeight: 14, fontWeight: '500' as const, letterSpacing: 0.4 },
  numeric:   { fontFamily: family.sans, fontSize: 44, lineHeight: 48, fontWeight: '800' as const, letterSpacing: -1.5 },
  numericLg: { fontFamily: family.sans, fontSize: 64, lineHeight: 68, fontWeight: '800' as const, letterSpacing: -2 },
  mono:      { fontFamily: family.mono, fontSize: 13 },
} as const;

// ─── Shadow system — layered (near + far) for real depth ───────────────────
// Every card should compose one of these; never invent a shadow in a component.
export const shadow = {
  none: { shadowColor: '#000', shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 },

  // Level 1 — flat surface, subtle lift
  card: {
    shadowColor: '#1B1830',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  // Level 2 — hovering / interactive card
  cardHover: {
    shadowColor: '#1B1830',
    shadowOpacity: 0.10,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },

  // Level 3 — modals, FAB
  floating: {
    shadowColor: '#1B1830',
    shadowOpacity: 0.14,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },

  // Brand-tinted lift (used sparingly on primary CTAs)
  brandGlow: {
    shadowColor: '#7A5AF8',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  accentGlow: {
    shadowColor: '#F26B3A',
    shadowOpacity: 0.32,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;

// ─── Motion tokens ─────────────────────────────────────────────────────────
// Used with Moti / Reanimated. Prefer these over hand-tuned timing.
export const motion = {
  duration: {
    fast:    140,
    base:    220,
    slow:    360,
    hero:    560,
  },
  spring: {
    // Soft, product-y springs — no bounces that read as toys.
    soft:  { damping: 18, stiffness: 160, mass: 0.8 },
    firm:  { damping: 22, stiffness: 260, mass: 0.7 },
    press: { damping: 20, stiffness: 400, mass: 0.6 },
  },
  ease: {
    // For timing-driven props (opacity, blur radius)
    standard: [0.2, 0.8, 0.2, 1] as const,
    exit:     [0.4, 0, 1, 1] as const,
  },
} as const;

// ─── Semantic color helpers ────────────────────────────────────────────────
// Central mapping so the app's "under budget / over" logic reads the same
// language across components.
export function budgetTone(consumed: number, budget: number): 'good' | 'edge' | 'over' {
  if (budget <= 0) return 'edge';
  const ratio = consumed / budget;
  if (ratio > 1.05) return 'over';
  if (ratio > 0.9) return 'edge';
  return 'good';
}

export const toneColor = {
  good: { fg: colors.success, bg: colors.successSoft },
  edge: { fg: colors.warning, bg: colors.warningSoft },
  over: { fg: colors.danger,  bg: colors.dangerSoft  },
} as const;

// Legacy aliases (keep existing screens compiling until the sweep is done)
export type ColorToken = keyof typeof colors;
