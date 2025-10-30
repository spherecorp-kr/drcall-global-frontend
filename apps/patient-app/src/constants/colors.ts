/**
 * Design Token - Colors
 * Centralized color palette for the application
 */

export const COLORS = {
  // Primary Colors
  primary: '#00A0D2',
  primaryDark: '#0088B8',
  primaryLight: '#33B3DC',

  // Text Colors
  text: {
    primary: '#1F1F1F',
    secondary: '#8A8A8A',
    tertiary: '#AAAAAA',
    disabled: '#CCCCCC',
    white: '#FFFFFF',
  },

  // Background Colors
  background: {
    white: '#FFFFFF',
    gray: '#F5F5F5',
    lightGray: '#FAFAFA',
    card: '#FFFFFF',
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#CCCCCC',
    dark: '#8A8A8A',
  },

  // Status Colors
  status: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },

  // Appointment Status Colors
  appointment: {
    confirmed: '#00A0D2',
    pending: '#FF9800',
    completed: '#4CAF50',
    cancelled: '#F44336',
  },

  // Overlay
  overlay: {
    dark: 'rgba(0, 0, 0, 0.6)',
    light: 'rgba(0, 0, 0, 0.3)',
    modal: 'rgba(31, 31, 31, 0.6)',
  },
} as const;

// Type-safe color access
export type ColorPath =
  | keyof typeof COLORS
  | `text.${keyof typeof COLORS.text}`
  | `background.${keyof typeof COLORS.background}`
  | `border.${keyof typeof COLORS.border}`
  | `status.${keyof typeof COLORS.status}`
  | `appointment.${keyof typeof COLORS.appointment}`
  | `overlay.${keyof typeof COLORS.overlay}`;

/**
 * Get color value from path
 * @example getColor('primary') // '#00A0D2'
 * @example getColor('text.primary') // '#1F1F1F'
 */
export const getColor = (path: ColorPath): string => {
  const parts = path.split('.');
  let value: any = COLORS;

  for (const part of parts) {
    value = value[part];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found`);
      return '#000000';
    }
  }

  return value as string;
};
