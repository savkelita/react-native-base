import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import * as Cmd from 'tea-effect/Cmd'
import type * as Platform from 'tea-effect/Platform'
import { spacing, radii, shadows } from '../common/theme'
import type { Colors } from '../common/theme'
import { useTheme } from '../common/theme/context'
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

export const HomeView = ({ model, dispatch }: { readonly model: Model; readonly dispatch: Platform.Dispatch<Msg> }) => {
  const { colors, typography } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.container}>
      <Text style={typography.title1}>Home</Text>
      <Text style={typography.bodySmall}>
        Welcome to the react-native-base scaffold using the tea-effect architecture.
      </Text>
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
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, padding: spacing.l, gap: spacing.l, backgroundColor: colors.background },
    counter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.m,
      backgroundColor: colors.surface,
      padding: spacing.l,
      borderRadius: radii.l,
      ...shadows.sm,
    },
    button: {
      width: 48,
      height: 48,
      borderRadius: radii.m,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: { color: colors.white, fontSize: 22, fontWeight: '600' },
    count: { fontSize: 32, fontWeight: '700', color: colors.text, minWidth: 48, textAlign: 'center' },
    resetButton: {
      marginLeft: 'auto',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      borderRadius: radii.s,
      backgroundColor: colors.borderLight,
    },
    resetText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  })
