import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    alias: {
      'react-native': path.resolve(__dirname, 'src/__mocks__/react-native.ts'),
      'expo-constants': path.resolve(__dirname, 'src/__mocks__/expo-constants.ts'),
    },
  },
})
