import { StyleSheet } from 'react-native'

// -------------------------------------------------------------------------------------
// Colors
// -------------------------------------------------------------------------------------

export const lightColors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#EEF2FF',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  success: '#10B981',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  white: '#FFFFFF',
} as const satisfies Record<string, string>

export type Colors = { readonly [K in keyof typeof lightColors]: string }

export const darkColors: Colors = {
  primary: '#818CF8',
  primaryDark: '#6366F1',
  primaryLight: '#1E1B4B',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  error: '#F87171',
  errorLight: '#450A0A',
  success: '#34D399',
  border: '#334155',
  borderLight: '#1E293B',
  white: '#FFFFFF',
} as const

// -------------------------------------------------------------------------------------
// Spacing
// -------------------------------------------------------------------------------------

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
} as const

// -------------------------------------------------------------------------------------
// Border Radii
// -------------------------------------------------------------------------------------

export const radii = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  full: 9999,
} as const

// -------------------------------------------------------------------------------------
// Shadows
// -------------------------------------------------------------------------------------

export const shadows = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
})

// -------------------------------------------------------------------------------------
// Typography
// -------------------------------------------------------------------------------------

export const createTypography = (colors: Colors) =>
  StyleSheet.create({
    title1: { fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: -0.5 },
    title2: { fontSize: 22, fontWeight: '600', color: colors.text, letterSpacing: -0.3 },
    subtitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    body: { fontSize: 16, color: colors.text, lineHeight: 24 },
    bodySmall: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, letterSpacing: 0.2 },
    caption: { fontSize: 12, color: colors.textTertiary },
  })
