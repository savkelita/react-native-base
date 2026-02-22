import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Colors } from './index'
import { lightColors, darkColors, createTypography } from './index'

export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_MODE_KEY = 'theme_mode'

type Theme = {
  readonly colors: Colors
  readonly typography: ReturnType<typeof createTypography>
  readonly isDark: boolean
  readonly themeMode: ThemeMode
  readonly setThemeMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<Theme>(null as never)

export const useTheme = (): Theme => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { readonly children: React.ReactNode }) => {
  const systemScheme = useColorScheme()
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')

  useEffect(() => {
    AsyncStorage.getItem(THEME_MODE_KEY).then(stored => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeModeState(stored)
      }
    })
  }, [])

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode)
    AsyncStorage.setItem(THEME_MODE_KEY, mode)
  }, [])

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark'
  const colors = isDark ? darkColors : lightColors
  const typography = useMemo(() => createTypography(colors), [colors])

  return (
    <ThemeContext.Provider value={{ colors, typography, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
