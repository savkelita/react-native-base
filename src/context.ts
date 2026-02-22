import { createContext, useContext } from 'react'
import type * as Platform from 'tea-effect/Platform'
import type { Model } from './router/model'
import type { Msg } from './router/msg'

export type TeaContextValue = {
  readonly model: Model
  readonly dispatch: Platform.Dispatch<Msg>
}

export const TeaContext = createContext<TeaContextValue>(null as never)

export const useTeaContext = (): TeaContextValue => useContext(TeaContext)
