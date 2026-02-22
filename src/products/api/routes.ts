import * as Http from 'tea-effect/Http'
import { env } from '../../common/env'
import { Product, ProductsResponse } from './types'
import type { Product as ProductType, ProductsResponse as ProductsResponseType } from './types'

// -------------------------------------------------------------------------------------
// Get Products
// -------------------------------------------------------------------------------------

export const getProducts: Http.Request<ProductsResponseType> = Http.get(
  `${env.apiBaseUrl}/products`,
  Http.expectJson(ProductsResponse),
)

// -------------------------------------------------------------------------------------
// Get Product
// -------------------------------------------------------------------------------------

export const getProduct = (id: number): Http.Request<ProductType> =>
  Http.get(`${env.apiBaseUrl}/products/${id}`, Http.expectJson(Product))
