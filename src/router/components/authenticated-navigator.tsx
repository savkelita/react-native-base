import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerToggleButton,
} from '@react-navigation/drawer'
import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Ionicons from '@expo/vector-icons/Ionicons'
import type * as Platform from 'tea-effect/Platform'
import * as Home from '../../home'
import * as ProductDetail from '../../products/detail'
import * as Products from '../../products'
import { spacing, radii, shadows } from '../../common/theme'
import type { Colors } from '../../common/theme'
import { useTheme } from '../../common/theme/context'
import type { ThemeMode } from '../../common/theme/context'
import { screen, logout, navigate, navigateToProduct } from '../msg'
import type { Model } from '../model'
import type { Msg } from '../msg'
import { homeMsg, productsMsg, productDetailMsg } from '../screen-msg'

const Drawer = createDrawerNavigator()
const ProductsStack = createNativeStackNavigator()

type Props = {
  readonly model: Extract<Model, { _tag: 'Authenticated' }>
  readonly dispatch: Platform.Dispatch<Msg>
}

type DrawerProps = DrawerContentComponentProps & {
  readonly model: Extract<Model, { _tag: 'Authenticated' }>
  readonly dispatch: Platform.Dispatch<Msg>
}

const themeModes: ReadonlyArray<{
  readonly mode: ThemeMode
  readonly label: string
  readonly icon: 'sunny-outline' | 'moon-outline' | 'phone-portrait-outline'
}> = [
  { mode: 'light', label: 'Light', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
  { mode: 'system', label: 'System', icon: 'phone-portrait-outline' },
]

const ThemeSelector = () => {
  const { colors, themeMode, setThemeMode } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.themeSelector}>
      <Text style={styles.themeSelectorLabel}>Theme</Text>
      <View style={styles.themeModes}>
        {themeModes.map(({ mode, label, icon }) => {
          const isActive = themeMode === mode
          return (
            <TouchableOpacity
              key={mode}
              style={[styles.themeModeButton, isActive && styles.themeModeButtonActive]}
              onPress={() => setThemeMode(mode)}
              activeOpacity={0.7}
            >
              <Ionicons name={icon} size={16} color={isActive ? colors.primary : colors.textTertiary} />
              <Text style={[styles.themeModeText, isActive && styles.themeModeTextActive]}>{label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const DrawerHeader = ({ username }: { readonly username: string }) => {
  const { colors, typography } = useTheme()
  const styles = createStyles(colors)
  const initial = username.charAt(0).toUpperCase()

  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.headerInfo}>
        <Text style={typography.subtitle}>{username}</Text>
        <Text style={typography.caption}>Authenticated</Text>
      </View>
    </View>
  )
}

const CustomDrawerContent = ({ model, dispatch, ...props }: DrawerProps) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <DrawerHeader username={model.session.username} />
      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.drawerFooter}>
        <View style={styles.separator} />
        <ThemeSelector />
        <View style={styles.separator} />
        <DrawerItem
          label="Logout"
          labelStyle={styles.logoutLabel}
          icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={colors.error} />}
          onPress={() => dispatch(logout())}
        />
      </View>
    </DrawerContentScrollView>
  )
}

const onFocus = (dispatch: Platform.Dispatch<Msg>, screenName: string) => ({
  focus: () => dispatch(navigate(screenName)),
})

const ProductsStackNavigator = ({ model, dispatch }: Props) => (
  <ProductsStack.Navigator>
    <ProductsStack.Screen
      name="ProductList"
      options={{ title: 'Products', headerLeft: () => <DrawerToggleButton /> }}
      listeners={onFocus(dispatch, 'Products')}
    >
      {() => {
        if (model.screen._tag !== 'ProductsScreen') return null
        return (
          <Products.ProductsView
            model={model.screen.model}
            dispatch={msg => dispatch(screen(productsMsg(msg)))}
            onProductSelected={product => dispatch(navigateToProduct(product.id))}
          />
        )
      }}
    </ProductsStack.Screen>
    <ProductsStack.Screen name="ProductDetail" options={{ title: 'Product Detail' }}>
      {() => {
        if (model.screen._tag !== 'ProductDetailScreen') return null
        return (
          <ProductDetail.ProductDetailView
            model={model.screen.model}
            dispatch={msg => dispatch(screen(productDetailMsg(msg)))}
          />
        )
      }}
    </ProductsStack.Screen>
  </ProductsStack.Navigator>
)

export const AuthenticatedNavigator = ({ model, dispatch }: Props) => {
  const { colors } = useTheme()

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} model={model} dispatch={dispatch} />}
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primaryLight,
        drawerItemStyle: { borderRadius: radii.s },
        drawerLabelStyle: { fontWeight: '500' },
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
        listeners={onFocus(dispatch, 'Home')}
      >
        {() => {
          if (model.screen._tag !== 'HomeScreen') return null
          return <Home.HomeView model={model.screen.model} dispatch={msg => dispatch(screen(homeMsg(msg)))} />
        }}
      </Drawer.Screen>
      <Drawer.Screen
        name="Products"
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="cube-outline" size={size} color={color} />,
        }}
      >
        {() => <ProductsStackNavigator model={model} dispatch={dispatch} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    drawerContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.m,
      paddingHorizontal: spacing.l,
      paddingTop: spacing.m,
      paddingBottom: spacing.l,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      marginBottom: spacing.s,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: radii.full,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.sm,
    },
    avatarText: {
      color: colors.white,
      fontSize: 20,
      fontWeight: '700',
    },
    headerInfo: {
      flex: 1,
      gap: 2,
    },
    drawerItems: {
      flex: 1,
    },
    drawerFooter: {
      paddingBottom: spacing.l,
      paddingHorizontal: spacing.xs,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginHorizontal: spacing.m,
      marginVertical: spacing.s,
    },
    themeSelector: {
      paddingHorizontal: spacing.m,
      gap: spacing.s,
    },
    themeSelectorLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      letterSpacing: 0.2,
      paddingHorizontal: spacing.xs,
    },
    themeModes: {
      flexDirection: 'row',
      gap: spacing.s,
    },
    themeModeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.s,
      borderRadius: radii.s,
      backgroundColor: colors.background,
    },
    themeModeButtonActive: {
      backgroundColor: colors.primaryLight,
    },
    themeModeText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textTertiary,
    },
    themeModeTextActive: {
      color: colors.primary,
    },
    logoutLabel: {
      color: colors.error,
      fontWeight: '500',
    },
  })
