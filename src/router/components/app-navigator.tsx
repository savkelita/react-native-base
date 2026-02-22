import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import type * as Platform from 'tea-effect/Platform'
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

export const AppNavigator = ({ model, dispatch }: Props) => (
  <NavigationContainer ref={navigationRef} onReady={() => setNavigationRef(navigationRef)}>
    {model._tag === 'Initializing' && <LoadingView />}
    {model._tag === 'Anonymous' && <AnonymousNavigator model={model} dispatch={dispatch} />}
    {model._tag === 'Authenticated' && <AuthenticatedNavigator model={model} dispatch={dispatch} />}
  </NavigationContainer>
)
