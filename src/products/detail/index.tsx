import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { Option } from 'effect'
import * as Cmd from 'tea-effect/Cmd'
import * as Http from 'tea-effect/Http'
import type * as Platform from 'tea-effect/Platform'
import { spacing, radii, shadows } from '../../common/theme'
import type { Colors } from '../../common/theme'
import { useTheme } from '../../common/theme/context'
import * as Api from '../api'
import type { Model } from './model'
import { Msg, productLoaded, productFailed } from './msg'

export type { Model }
export type { Msg }

// -------------------------------------------------------------------------------------
// Init
// -------------------------------------------------------------------------------------

export const init = (productId: number): [Model, Cmd.Cmd<Msg>] => [
  { product: Option.none(), isLoading: true, error: Option.none() },
  Http.send(Api.getProduct(productId), { onSuccess: productLoaded, onError: productFailed }),
]

// -------------------------------------------------------------------------------------
// Update
// -------------------------------------------------------------------------------------

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] =>
  Msg.$match(msg, {
    ProductLoaded: ({ product }): [Model, Cmd.Cmd<Msg>] => [
      { ...model, product: Option.some(product), isLoading: false, error: Option.none() },
      Cmd.none,
    ],
    ProductFailed: ({ error }): [Model, Cmd.Cmd<Msg>] => [
      { ...model, isLoading: false, error: Option.some(error) },
      Cmd.none,
    ],
  })

// -------------------------------------------------------------------------------------
// View
// -------------------------------------------------------------------------------------

export const ProductDetailView = ({
  model,
  dispatch: _dispatch,
}: {
  readonly model: Model
  readonly dispatch: Platform.Dispatch<Msg>
}) => {
  const { colors, typography } = useTheme()
  const styles = createStyles(colors)

  if (model.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (Option.isSome(model.error)) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>Failed to load product.</Text>
        </View>
      </View>
    )
  }

  if (Option.isNone(model.product)) return null

  const product = model.product.value
  const imageUri = product.images.length > 0 ? product.images[0] : product.thumbnail

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      <Text style={typography.title1}>{product.title}</Text>
      {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={[styles.detailValue, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Rating</Text>
          <Text style={styles.detailValue}>
            {'\u2605'} {product.rating.toFixed(1)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Stock</Text>
          <Text style={styles.detailValue}>{product.stock}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.l, gap: spacing.m },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    image: { width: '100%', height: 280, borderRadius: radii.l, backgroundColor: colors.surface },
    brand: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    category: { fontSize: 13, color: colors.textTertiary, textTransform: 'capitalize' },
    description: { fontSize: 16, color: colors.textSecondary, lineHeight: 24 },
    details: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      padding: spacing.l,
      borderRadius: radii.l,
      marginTop: spacing.s,
      ...shadows.sm,
    },
    detailItem: { alignItems: 'center', gap: spacing.xs },
    detailLabel: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, letterSpacing: 0.2 },
    detailValue: { fontSize: 20, fontWeight: '700', color: colors.text },
    errorBar: {
      backgroundColor: colors.errorLight,
      padding: spacing.m,
      borderRadius: radii.s,
      borderLeftWidth: 3,
      borderLeftColor: colors.error,
    },
    errorText: { color: colors.error },
  })
