import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type * as Platform from 'tea-effect/Platform'
import * as Login from '../../login'
import { login } from '../msg'
import type { Model } from '../model'
import type { Msg } from '../msg'

const Stack = createNativeStackNavigator()

type Props = {
  readonly model: Extract<Model, { _tag: 'Anonymous' }>
  readonly dispatch: Platform.Dispatch<Msg>
}

export const AnonymousNavigator = ({ model, dispatch }: Props) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {() => <Login.LoginView model={model.login} dispatch={msg => dispatch(login(msg))} />}
    </Stack.Screen>
  </Stack.Navigator>
)
