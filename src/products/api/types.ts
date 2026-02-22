import { Schema } from 'effect'

// -------------------------------------------------------------------------------------
// Product
// -------------------------------------------------------------------------------------

export const Product = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
  description: Schema.String,
  category: Schema.String,
  price: Schema.Number,
  rating: Schema.Number,
  stock: Schema.Number,
  brand: Schema.NullishOr(Schema.String),
  thumbnail: Schema.String,
  images: Schema.Array(Schema.String),
})

export type Product = typeof Product.Type

// -------------------------------------------------------------------------------------
// ProductsResponse
// -------------------------------------------------------------------------------------

export const ProductsResponse = Schema.Struct({
  products: Schema.Array(Product),
  total: Schema.Number,
})

export type ProductsResponse = typeof ProductsResponse.Type
