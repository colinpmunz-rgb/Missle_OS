export const Colors = {
  light: {
    primary: '#0A0A0A',
    accent: '#2A2A2A',
    background: '#F8F7F4',
    surface: '#EEECEA',
    glass: '#EEECEA',
    text: '#0A0A0A',
    textMuted: '#7A7A7A',
    border: '#DDDAD4',
    white: '#FFFFFF',
    error: '#8B1A1A',
    success: '#1A3A28',
    warning: '#6A4A18',
    orange: '#B87840',
  },
  dark: {
    primary: '#BEBEBE',
    accent: '#999999',
    background: '#080808',
    surface: '#0E0E0E',
    glass: 'rgba(255,255,255,0.04)',
    text: '#F0EDE8',
    textMuted: '#545454',
    border: 'rgba(255,255,255,0.07)',
    white: '#FFFFFF',
    error: '#8B1A1A',
    success: '#2A4A35',
    warning: '#7A5C20',
    orange: '#B87840',
  },
};

export const CalendarTagColors = {
  School: '#2563EB',
  Test: '#DC2626',
  Personal: '#16A34A',
  Business: '#2D5A3A',
  'Personal Time': '#F5F0E8',
};

export const Fonts = {
  garamond: {
    regular: 'EBGaramond_400Regular',
    medium: 'EBGaramond_500Medium',
    semiBold: 'EBGaramond_600SemiBold',
    bold: 'EBGaramond_700Bold',
    italic: 'EBGaramond_400Regular_Italic',
  },
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
};

export const Typography = {
  displayLarge: { fontSize: 32, fontFamily: Fonts.garamond.bold, lineHeight: 40 },
  displayMedium: { fontSize: 26, fontFamily: Fonts.garamond.bold, lineHeight: 34 },
  displaySmall: { fontSize: 22, fontFamily: Fonts.garamond.semiBold, lineHeight: 30 },
  headingLarge: { fontSize: 20, fontFamily: Fonts.garamond.semiBold, lineHeight: 28 },
  headingMedium: { fontSize: 18, fontFamily: Fonts.garamond.medium, lineHeight: 26 },
  headingSmall: { fontSize: 16, fontFamily: Fonts.garamond.medium, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontFamily: Fonts.inter.regular, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontFamily: Fonts.inter.regular, lineHeight: 22 },
  bodySmall: { fontSize: 12, fontFamily: Fonts.inter.regular, lineHeight: 18 },
  labelLarge: { fontSize: 14, fontFamily: Fonts.inter.semiBold, lineHeight: 20 },
  labelMedium: { fontSize: 12, fontFamily: Fonts.inter.medium, lineHeight: 18 },
  labelSmall: { fontSize: 10, fontFamily: Fonts.inter.medium, lineHeight: 16 },
  mono: { fontSize: 14, fontFamily: Fonts.inter.regular, lineHeight: 22 },
};
