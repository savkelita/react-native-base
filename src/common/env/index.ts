import Constants from 'expo-constants'

export type Env = {
  readonly apiBaseUrl: string
}

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>

export const env: Env = {
  apiBaseUrl: extra.apiBaseUrl ?? 'https://dummyjson.com',
}
