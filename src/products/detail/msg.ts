import { Data } from 'effect'
import type * as Http from 'tea-effect/Http'
import type { Product } from '../api'

export type Msg = Data.TaggedEnum<{
  ProductLoaded: { readonly product: Product }
  ProductFailed: { readonly error: Http.HttpError }
}>

export const Msg = Data.taggedEnum<Msg>()

export const productLoaded = (product: Product): Msg => Msg.ProductLoaded({ product })
export const productFailed = (error: Http.HttpError): Msg => Msg.ProductFailed({ error })
