import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import * as Cmd from 'tea-effect/Cmd'
import type * as Platform from 'tea-effect/Platform'
import { colors, spacing, typography } from '../common/theme'
import { Msg, increment, decrement, reset } from './msg'
import type { Model } from './model'

export type { Model }
export type { Msg }

// -------------------------------------------------------------------------------------
// Init
// -------------------------------------------------------------------------------------

export const init: [Model, Cmd.Cmd<Msg>] = [{ count: 0 }, Cmd.none]

// -------------------------------------------------------------------------------------
// Update
// -------------------------------------------------------------------------------------

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] =>
  Msg.$match(msg, {
    Increment: (): [Model, Cmd.Cmd<Msg>] => [{ ...model, count: model.count + 1 }, Cmd.none],
    Decrement: (): [Model, Cmd.Cmd<Msg>] => [{ ...model, count: model.count - 1 }, Cmd.none],
    Reset: (): [Model, Cmd.Cmd<Msg>] => [{ ...model, count: 0 }, Cmd.none],
  })

// -------------------------------------------------------------------------------------
// View
// -------------------------------------------------------------------------------------

export const HomeView = ({ model, dispatch }: { readonly model: Model; readonly dispatch: Platform.Dispatch<Msg> }) => (
  <View style={styles.container}>
    <Text style={typography.title1}>Home</Text>
    <Text style={typography.body}>Welcome to the react-native-base scaffold using the tea-effect architecture.</Text>
    <View style={styles.counter}>
      <TouchableOpacity style={styles.button} onPress={() => dispatch(decrement())}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.count}>{model.count}</Text>
      <TouchableOpacity style={styles.button} onPress={() => dispatch(increment())}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={() => dispatch(reset())}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.l, gap: spacing.m, backgroundColor: colors.background },
  counter: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, marginTop: spacing.m },
  button: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: colors.white, fontSize: 20, fontWeight: '600' },
  count: { fontSize: 24, fontWeight: '600', color: colors.text, minWidth: 40, textAlign: 'center' },
  resetButton: { marginLeft: spacing.s, padding: spacing.s },
  resetText: { color: colors.textSecondary, fontSize: 16 },
})
