import { Data } from 'effect'
import type { Session } from '../auth/session'
import type * as Login from '../login'
import type { ScreenModel } from './screen-model'

export type Model = Data.TaggedEnum<{
  Initializing: {}
  Anonymous: { readonly login: Login.Model }
  Authenticated: {
    readonly session: Session
    readonly screen: ScreenModel
  }
}>

export const Model = Data.taggedEnum<Model>()
