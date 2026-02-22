import { Effect, Stream } from 'effect'
import type * as Cmd from 'tea-effect/Cmd'

// -------------------------------------------------------------------------------------
// Navigation Ref
// -------------------------------------------------------------------------------------

let navigationRef: any = null

export const setNavigationRef = (ref: any): void => {
  navigationRef = ref
}

// -------------------------------------------------------------------------------------
// Commands
// -------------------------------------------------------------------------------------

export const navigate = (screenName: string, params?: Record<string, unknown>): Cmd.Cmd<never> =>
  Stream.execute(
    Effect.sync(() => {
      navigationRef?.navigate(screenName, params)
    }),
  )

export const goBack = (): Cmd.Cmd<never> =>
  Stream.execute(
    Effect.sync(() => {
      navigationRef?.goBack()
    }),
  )

export const reset = (screenName: string): Cmd.Cmd<never> =>
  Stream.execute(
    Effect.sync(() => {
      navigationRef?.reset({ index: 0, routes: [{ name: screenName }] })
    }),
  )
