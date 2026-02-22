import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { Option } from 'effect'
import * as Cmd from 'tea-effect/Cmd'
import * as Http from 'tea-effect/Http'
import type * as Platform from 'tea-effect/Platform'
import { colors, spacing, typography } from '../common/theme'
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

const ProductRow = ({ item, onPress }: { readonly item: Product; readonly onPress: () => void }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
    <View style={styles.info}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
      <View style={styles.details}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
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
}) => (
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
        renderItem={({ item }) => <ProductRow item={item} onPress={() => onProductSelected(item)} />}
        contentContainerStyle={styles.list}
      />
    )}
  </View>
)

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.l, gap: spacing.m, backgroundColor: colors.background },
  spinner: { marginTop: spacing.xl },
  errorBar: { backgroundColor: '#FDE7E9', padding: spacing.m, borderRadius: 4 },
  errorText: { color: colors.error },
  list: { gap: spacing.s },
  row: { flexDirection: 'row', padding: spacing.m, backgroundColor: colors.surface, borderRadius: 8, gap: spacing.m },
  thumbnail: { width: 56, height: 56, borderRadius: 4 },
  info: { flex: 1, gap: spacing.xs },
  productTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  category: { fontSize: 14, color: colors.textSecondary },
  details: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xs },
  price: { fontSize: 14, fontWeight: '600', color: colors.text },
  rating: { fontSize: 14, color: colors.textSecondary },
  stock: { fontSize: 14, color: colors.textSecondary },
})
