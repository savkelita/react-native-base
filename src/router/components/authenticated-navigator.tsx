import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type * as Platform from 'tea-effect/Platform'
import * as Home from '../../home'
import * as Products from '../../products'
import { colors } from '../../common/theme'
import { screen, logout, navigate } from '../msg'
import type { Model } from '../model'
import type { Msg } from '../msg'
import { homeMsg, productsMsg } from '../screen-msg'

const Stack = createNativeStackNavigator()

type Props = {
  readonly model: Extract<Model, { _tag: 'Authenticated' }>
  readonly dispatch: Platform.Dispatch<Msg>
}

const LogoutButton = ({ dispatch }: { readonly dispatch: Platform.Dispatch<Msg> }) => (
  <TouchableOpacity onPress={() => dispatch(logout())}>
    <Text style={styles.logoutText}>Logout</Text>
  </TouchableOpacity>
)

const NavigateButton = ({
  dispatch,
  screenName,
  label,
}: {
  readonly dispatch: Platform.Dispatch<Msg>
  readonly screenName: string
  readonly label: string
}) => (
  <TouchableOpacity onPress={() => dispatch(navigate(screenName))}>
    <Text style={styles.navText}>{label}</Text>
  </TouchableOpacity>
)

export const AuthenticatedNavigator = ({ model, dispatch }: Props) => (
  <Stack.Navigator
    screenOptions={{
      headerRight: () => <LogoutButton dispatch={dispatch} />,
    }}
  >
    <Stack.Screen
      name="Home"
      options={{
        title: 'Home',
        headerLeft: () => <NavigateButton dispatch={dispatch} screenName="Products" label="Products" />,
      }}
    >
      {() => {
        if (model.screen._tag !== 'HomeScreen') return null
        return <Home.HomeView model={model.screen.model} dispatch={msg => dispatch(screen(homeMsg(msg)))} />
      }}
    </Stack.Screen>
    <Stack.Screen name="Products" options={{ title: 'Products' }}>
      {() => {
        if (model.screen._tag !== 'ProductsScreen') return null
        return <Products.ProductsView model={model.screen.model} dispatch={msg => dispatch(screen(productsMsg(msg)))} />
      }}
    </Stack.Screen>
  </Stack.Navigator>
)

const styles = StyleSheet.create({
  logoutText: { color: colors.error, fontSize: 16 },
  navText: { color: colors.primary, fontSize: 16 },
})
