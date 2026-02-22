import { StyleSheet } from 'react-native'

// -------------------------------------------------------------------------------------
// Colors
// -------------------------------------------------------------------------------------

export const colors = {
  primary: '#0078D4',
  primaryDark: '#005A9E',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#323130',
  textSecondary: '#605E5C',
  error: '#D13438',
  border: '#EDEBE9',
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
// Typography
// -------------------------------------------------------------------------------------

export const typography = StyleSheet.create({
  title1: { fontSize: 28, fontWeight: '700', color: colors.text },
  title2: { fontSize: 22, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, color: colors.text },
  caption: { fontSize: 12, color: colors.textSecondary },
})
