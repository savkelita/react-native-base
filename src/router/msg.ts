import { Data, Either, Option } from 'effect'
import type { ApiError } from '../common/http'
import type { Session } from '../auth/session'
import type { RefreshResult } from '../auth/api'
import type * as Login from '../login'
import type { StorageError } from '../tea/storage'
import type { ScreenMsg } from './screen-msg'

export type Msg = Data.TaggedEnum<{
  Screen: { readonly screenMsg: ScreenMsg }
  SessionLoaded: { readonly session: Option.Option<Session> }
  SessionLoadError: { readonly error: StorageError }
  Login: { readonly loginMsg: Login.Msg }
  Logout: {}
  RefreshTick: {}
  RefreshCompleted: { readonly result: Either.Either<RefreshResult, ApiError> }
  Navigate: { readonly screenName: string }
}>

export const Msg = Data.taggedEnum<Msg>()

export const screen = (screenMsg: ScreenMsg): Msg => Msg.Screen({ screenMsg })
export const sessionLoaded = (session: Option.Option<Session>): Msg => Msg.SessionLoaded({ session })
export const sessionLoadError = (error: StorageError): Msg => Msg.SessionLoadError({ error })
export const login = (loginMsg: Login.Msg): Msg => Msg.Login({ loginMsg })
export const logout = (): Msg => Msg.Logout()
export const refreshTick = (): Msg => Msg.RefreshTick()
export const refreshCompleted = (result: Either.Either<RefreshResult, ApiError>): Msg =>
  Msg.RefreshCompleted({ result })
export const navigate = (screenName: string): Msg => Msg.Navigate({ screenName })
