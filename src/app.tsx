import * as React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { makeUseProgram } from 'tea-effect/React'
import { TeaContext } from './context'
import * as Router from './router'
import { AppNavigator } from './router/components/app-navigator'

const useProgram = makeUseProgram(React)

export default function App() {
  const { model, dispatch } = useProgram(Router.init, Router.update, Router.subscriptions)

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <TeaContext.Provider value={{ model, dispatch }}>
          <AppNavigator model={model} dispatch={dispatch} />
        </TeaContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
