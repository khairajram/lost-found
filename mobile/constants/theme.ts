export const COLORS = {
  // Brand
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',

  // Lost & Found Intent Accents
  lost: '#EF4444',
  lostLight: '#FEE2E2',
  lostDark: '#B91C1C',

  found: '#10B981',
  foundLight: '#D1FAE5',
  foundDark: '#047857',

  // AI & Matching
  ai: '#8B5CF6',
  aiLight: '#EDE9FE',
  aiDark: '#6D28D9',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  info: '#3B82F6',

  // Neutrals & Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Typography
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textLight: '#F8FAFC',
  white: '#FFFFFF',
  black: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  bodySemibold: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionSemibold: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  small: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 6,
  },
};
