// Thali design tokens — pastel, calm, non-clinical. Draws from the NutriTrack
// inspo (soft lavender + cream), warmed with a spice-forward accent so it doesn't
// read as a generic Silicon Valley wellness app.

export const colors = {
  // surfaces
  bg:          '#F7F4EE', // warm off-white (cream)
  surface:     '#FFFFFF',
  surfaceAlt:  '#EEE9F5', // pale lavender card
  border:      '#E5DFD3',

  // text
  text:        '#1F1B2E',
  textMuted:   '#6B6478',

  // brand
  brand:       '#7C6BF0', // lavender — primary
  brandSoft:   '#C7BEFB',
  accent:      '#E86B3F', // turmeric-warm orange — CTAs, streak
  accentSoft:  '#FBD9C7',

  // semantics
  success:     '#4CAF7B', // within budget
  warning:     '#E8B54E', // slightly over
  danger:      '#D8524A', // over budget
  info:        '#4E8BC6',

  // macro chips
  protein:     '#7C6BF0',
  carbs:       '#E8B54E',
  fat:         '#E86B3F',
} as const;

export type ColorToken = keyof typeof colors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const type = {
  display:   { fontSize: 34, lineHeight: 40, fontWeight: '700' as const },
  title:     { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  heading:   { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body:      { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyBold:  { fontSize: 15, lineHeight: 22, fontWeight: '600' as const },
  caption:   { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  mono:      { fontFamily: 'Menlo', fontSize: 14 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
} as const;
