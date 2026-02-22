import { Data, Effect, Option, Schema, Stream } from 'effect'
import type { ParseResult } from 'effect'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type * as Cmd from 'tea-effect/Cmd'

// -------------------------------------------------------------------------------------
// StorageError
// -------------------------------------------------------------------------------------

export type StorageError = Data.TaggedEnum<{
  JsonParseError: { readonly key: string; readonly error: unknown }
  DecodeError: { readonly key: string; readonly error: ParseResult.ParseError }
  EncodeError: { readonly key: string; readonly error: ParseResult.ParseError }
}>

export const StorageError = Data.taggedEnum<StorageError>()

// -------------------------------------------------------------------------------------
// Tasks
// -------------------------------------------------------------------------------------

const getTask = <A, I>(key: string, schema: Schema.Schema<A, I>): Effect.Effect<Option.Option<A>, StorageError> =>
  Effect.gen(function* () {
    const raw = yield* Effect.promise(() => AsyncStorage.getItem(key))
    if (raw === null) return Option.none()
    const parsed = yield* Effect.try({
      try: () => JSON.parse(raw) as I,
      catch: error => StorageError.JsonParseError({ key, error }),
    })
    const decoded = yield* Schema.decode(schema)(parsed).pipe(
      Effect.mapError(error => StorageError.DecodeError({ key, error })),
    )
    return Option.some(decoded)
  })

const setTask = <A, I>(key: string, schema: Schema.Schema<A, I>, value: A): Effect.Effect<void, StorageError> =>
  Effect.gen(function* () {
    const encoded = yield* Schema.encode(schema)(value).pipe(
      Effect.mapError(error => StorageError.EncodeError({ key, error })),
    )
    const json = JSON.stringify(encoded)
    yield* Effect.promise(() => AsyncStorage.setItem(key, json))
  })

const removeTask = (key: string): Effect.Effect<void, never> => Effect.promise(() => AsyncStorage.removeItem(key))

// -------------------------------------------------------------------------------------
// Commands
// -------------------------------------------------------------------------------------

export const get = <A, I, Msg>(
  key: string,
  schema: Schema.Schema<A, I>,
  handlers: {
    readonly onSuccess: (data: Option.Option<A>) => Msg
    readonly onError: (error: StorageError) => Msg
  },
): Cmd.Cmd<Msg> =>
  Stream.fromEffect(
    Effect.match(getTask(key, schema), {
      onSuccess: data => handlers.onSuccess(data),
      onFailure: error => handlers.onError(error),
    }),
  )

export const set = <A, I, Msg>(
  key: string,
  schema: Schema.Schema<A, I>,
  value: A,
  handlers: {
    readonly onSuccess: () => Msg
    readonly onError: (error: StorageError) => Msg
  },
): Cmd.Cmd<Msg> =>
  Stream.fromEffect(
    Effect.match(setTask(key, schema, value), {
      onSuccess: () => handlers.onSuccess(),
      onFailure: error => handlers.onError(error),
    }),
  )

export const setIgnoreErrors = <A, I>(key: string, schema: Schema.Schema<A, I>, value: A): Cmd.Cmd<never> =>
  Stream.execute(Effect.ignore(setTask(key, schema, value)))

export const removeIgnoreErrors = (key: string): Cmd.Cmd<never> => Stream.execute(Effect.ignore(removeTask(key)))
