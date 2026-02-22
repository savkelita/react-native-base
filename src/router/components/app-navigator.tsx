import { useMemo } from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme, createNavigationContainerRef } from '@react-navigation/native'
import type * as Platform from 'tea-effect/Platform'
import { useTheme } from '../../common/theme/context'
import { setNavigationRef } from '../../tea/navigation-cmd'
import type { Model } from '../model'
import type { Msg } from '../msg'
import { LoadingView } from './loading-view'
import { AnonymousNavigator } from './anonymous-navigator'
import { AuthenticatedNavigator } from './authenticated-navigator'

type Props = {
  readonly model: Model
  readonly dispatch: Platform.Dispatch<Msg>
}

const navigationRef = createNavigationContainerRef()

export const AppNavigator = ({ model, dispatch }: Props) => {
  const { colors, isDark } = useTheme()

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    }
  }, [isDark, colors])

  return (
    <NavigationContainer ref={navigationRef} onReady={() => setNavigationRef(navigationRef)} theme={navigationTheme}>
      {model._tag === 'Initializing' && <LoadingView />}
      {model._tag === 'Anonymous' && <AnonymousNavigator model={model} dispatch={dispatch} />}
      {model._tag === 'Authenticated' && <AuthenticatedNavigator model={model} dispatch={dispatch} />}
    </NavigationContainer>
  )
}
