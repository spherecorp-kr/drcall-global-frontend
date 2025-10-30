/**
 * Design Token - Spacing
 * Standardized spacing values following 4px base grid
 */

export const SPACING = {
  // Base spacing units (4px grid system)
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '2.5rem',  // 40px
  '5xl': '3rem',    // 48px

  // Semantic spacing
  cardPadding: '1.25rem',      // 20px
  sectionGap: '1rem',           // 16px
  listItemGap: '0.75rem',       // 12px
  inputPadding: '0.75rem',      // 12px
  buttonPadding: '0.75rem 1.5rem', // 12px 24px

  // Container spacing
  containerPadding: '1.25rem',  // 20px
  modalPadding: '1.5rem',       // 24px
} as const;

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.625rem',   // 10px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.875rem', // 30px
  full: '9999px',   // Fully rounded

  // Semantic radius
  card: '0.625rem',
  button: '0.625rem',
  modal: '1.875rem',
  input: '0.5rem',
} as const;

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',

  // Semantic shadows
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  modal: '0 10px 40px rgba(0, 0, 0, 0.15)',
  button: '0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;
