import { View, StyleSheet } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerToggleButton,
} from '@react-navigation/drawer'
import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type * as Platform from 'tea-effect/Platform'
import * as Home from '../../home'
import * as ProductDetail from '../../products/detail'
import * as Products from '../../products'
import { colors, spacing } from '../../common/theme'
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
  readonly dispatch: Platform.Dispatch<Msg>
}

const CustomDrawerContent = ({ dispatch, ...props }: DrawerProps) => (
  <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
    <View style={styles.drawerItems}>
      <DrawerItemList {...props} />
    </View>
    <View style={styles.drawerFooter}>
      <View style={styles.separator} />
      <DrawerItem label="Logout" labelStyle={styles.logoutLabel} onPress={() => dispatch(logout())} />
    </View>
  </DrawerContentScrollView>
)

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

export const AuthenticatedNavigator = ({ model, dispatch }: Props) => (
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} dispatch={dispatch} />}>
    <Drawer.Screen name="Home" options={{ title: 'Home' }} listeners={onFocus(dispatch, 'Home')}>
      {() => {
        if (model.screen._tag !== 'HomeScreen') return null
        return <Home.HomeView model={model.screen.model} dispatch={msg => dispatch(screen(homeMsg(msg)))} />
      }}
    </Drawer.Screen>
    <Drawer.Screen name="Products" options={{ headerShown: false }}>
      {() => <ProductsStackNavigator model={model} dispatch={dispatch} />}
    </Drawer.Screen>
  </Drawer.Navigator>
)

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerItems: {
    flex: 1,
  },
  drawerFooter: {
    paddingBottom: spacing.m,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.m,
    marginBottom: spacing.xs,
  },
  logoutLabel: {
    color: colors.error,
  },
})
