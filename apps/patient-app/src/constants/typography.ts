/**
 * Design Token - Typography
 * Standardized font sizes, weights, and line heights
 */

export const FONT_SIZE = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
} as const;

export const FONT_WEIGHT = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const LINE_HEIGHT = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
} as const;

// Semantic typography combinations
export const TYPOGRAPHY = {
  // Headers
  h1: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
  },
  h2: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
  },
  h3: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.normal,
  },
  h4: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.normal,
  },

  // Body text
  bodyLarge: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
  },
  body: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
  },
  bodySmall: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
  },

  // Special text
  caption: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.normal,
  },
  button: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.normal,
  },
} as const;
