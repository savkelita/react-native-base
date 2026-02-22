import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { Option } from 'effect'
import * as Cmd from 'tea-effect/Cmd'
import * as Http from 'tea-effect/Http'
import type * as Platform from 'tea-effect/Platform'
import { spacing, radii, shadows } from '../common/theme'
import type { Colors } from '../common/theme'
import { useTheme } from '../common/theme/context'
import type { Model } from './model'
import { Msg, productsLoaded, productsFailed } from './msg'
import * as Api from './api'
import type { Product } from './api'

export type { Model }
export type { Msg }

// -------------------------------------------------------------------------------------
// Commands
// -------------------------------------------------------------------------------------

const fetchProducts: Cmd.Cmd<Msg> = Http.send(Api.getProducts, {
  onSuccess: productsLoaded,
  onError: productsFailed,
})

// -------------------------------------------------------------------------------------
// Init
// -------------------------------------------------------------------------------------

export const init: [Model, Cmd.Cmd<Msg>] = [{ products: [], isLoading: true, error: Option.none() }, fetchProducts]

// -------------------------------------------------------------------------------------
// Update
// -------------------------------------------------------------------------------------

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] =>
  Msg.$match(msg, {
    LoadProducts: (): [Model, Cmd.Cmd<Msg>] => [{ ...model, isLoading: true, error: Option.none() }, fetchProducts],
    ProductsLoaded: ({ response }): [Model, Cmd.Cmd<Msg>] => [
      { ...model, products: response.products, isLoading: false, error: Option.none() },
      Cmd.none,
    ],
    ProductsFailed: ({ error }): [Model, Cmd.Cmd<Msg>] => [
      { ...model, isLoading: false, error: Option.some(error) },
      Cmd.none,
    ],
  })

// -------------------------------------------------------------------------------------
// View
// -------------------------------------------------------------------------------------

const ProductRow = ({
  item,
  onPress,
  styles,
}: {
  readonly item: Product
  readonly onPress: () => void
  readonly styles: ReturnType<typeof createStyles>
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
    <View style={styles.info}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
      <View style={styles.details}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Text style={styles.rating}>
          {'\u2605'} {item.rating.toFixed(1)}
        </Text>
        <Text style={styles.stock}>Stock: {item.stock}</Text>
      </View>
    </View>
  </TouchableOpacity>
)

export const ProductsView = ({
  model,
  dispatch: _dispatch,
  onProductSelected,
}: {
  readonly model: Model
  readonly dispatch: Platform.Dispatch<Msg>
  readonly onProductSelected: (product: Product) => void
}) => {
  const { colors, typography } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.container}>
      <Text style={typography.title1}>Products</Text>
      {model.isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      ) : Option.isSome(model.error) ? (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>Failed to load products.</Text>
        </View>
      ) : (
        <FlatList
          data={model.products}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <ProductRow item={item} onPress={() => onProductSelected(item)} styles={styles} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  )
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, padding: spacing.l, gap: spacing.m, backgroundColor: colors.background },
    spinner: { marginTop: spacing.xl },
    errorBar: {
      backgroundColor: colors.errorLight,
      padding: spacing.m,
      borderRadius: radii.s,
      borderLeftWidth: 3,
      borderLeftColor: colors.error,
    },
    errorText: { color: colors.error },
    list: { gap: spacing.m },
    row: {
      flexDirection: 'row',
      padding: spacing.m,
      backgroundColor: colors.surface,
      borderRadius: radii.m,
      gap: spacing.m,
      ...shadows.sm,
    },
    thumbnail: { width: 64, height: 64, borderRadius: radii.s, backgroundColor: colors.background },
    info: { flex: 1, gap: 2 },
    productTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    category: { fontSize: 13, color: colors.textTertiary, textTransform: 'capitalize' },
    details: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xs, alignItems: 'center' },
    price: { fontSize: 15, fontWeight: '700', color: colors.primary },
    rating: { fontSize: 13, color: colors.textSecondary },
    stock: { fontSize: 13, color: colors.textSecondary },
  })
