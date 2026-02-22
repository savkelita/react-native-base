import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Option } from 'effect'
import * as Cmd from 'tea-effect/Cmd'
import * as Http from 'tea-effect/Http'
import type * as TeaPlatform from 'tea-effect/Platform'
import * as Api from '../auth/api'
import { colors, spacing, typography } from '../common/theme'
import type { Model } from './model'
import { Msg, usernameChanged, passwordChanged, submit, loginSucceeded, loginFailed } from './msg'

export type { Model }
export type { Msg }

// -------------------------------------------------------------------------------------
// Init
// -------------------------------------------------------------------------------------

export const init: [Model, Cmd.Cmd<Msg>] = [
  {
    username: '',
    password: '',
    isSubmitting: false,
    error: Option.none(),
    result: Option.none(),
  },
  Cmd.none,
]

// -------------------------------------------------------------------------------------
// Update
// -------------------------------------------------------------------------------------

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] =>
  Msg.$match(msg, {
    UsernameChanged: ({ username }): [Model, Cmd.Cmd<Msg>] => [{ ...model, username, error: Option.none() }, Cmd.none],
    PasswordChanged: ({ password }): [Model, Cmd.Cmd<Msg>] => [{ ...model, password, error: Option.none() }, Cmd.none],
    Submit: (): [Model, Cmd.Cmd<Msg>] => [
      { ...model, isSubmitting: true, error: Option.none() },
      Http.send(Api.loginRequest({ username: model.username, password: model.password }), {
        onSuccess: response => loginSucceeded(Api.toSession(response)),
        onError: loginFailed,
      }),
    ],
    LoginSucceeded: ({ session }): [Model, Cmd.Cmd<Msg>] => [
      { ...model, isSubmitting: false, result: Option.some(session) },
      Cmd.none,
    ],
    LoginFailed: ({ error }): [Model, Cmd.Cmd<Msg>] => [
      { ...model, isSubmitting: false, error: Option.some(error) },
      Cmd.none,
    ],
  })

// -------------------------------------------------------------------------------------
// View
// -------------------------------------------------------------------------------------

export const LoginView = ({
  model,
  dispatch,
}: {
  readonly model: Model
  readonly dispatch: TeaPlatform.Dispatch<Msg>
}) => (
  <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={typography.title1}>Login</Text>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={model.username}
              onChangeText={text => dispatch(usernameChanged(text))}
              editable={!model.isSubmitting}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter username"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={model.password}
              onChangeText={text => dispatch(passwordChanged(text))}
              secureTextEntry
              editable={!model.isSubmitting}
              placeholder="Enter password"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          {Option.isSome(model.error) && (
            <View style={styles.errorBar}>
              <Text style={styles.errorText}>Invalid username or password</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.submitButton, (model.isSubmitting || !model.username || !model.password) && styles.disabled]}
            onPress={() => dispatch(submit())}
            disabled={model.isSubmitting || !model.username || !model.password}
            activeOpacity={0.7}
          >
            <Text style={styles.submitText}>{model.isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </KeyboardAvoidingView>
)

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
    backgroundColor: colors.surface,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.xl,
    gap: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  form: { gap: spacing.m },
  field: { gap: spacing.xs },
  label: { fontSize: 14, fontWeight: '500', color: colors.text },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: spacing.m,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  errorBar: { backgroundColor: '#FDE7E9', padding: spacing.m, borderRadius: 4 },
  errorText: { color: colors.error, fontSize: 14 },
  submitButton: {
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  disabled: { opacity: 0.5 },
  submitText: { color: colors.white, fontSize: 16, fontWeight: '600' },
})
