# React Native Base

A React Native base project using the **tea-effect** architecture (The Elm Architecture + Effect-TS) with Expo.

## Architecture

This project implements the [TEA (The Elm Architecture)](https://guide.elm-lang.org/architecture/) pattern via `tea-effect` — the same architecture used in the companion `frontend-base` web project.

### Core Pattern

```
Model → View → Msg → Update → Model
```

Every feature module follows this structure:

| File | Purpose |
|------|---------|
| `model.ts` | Readonly state type definitions |
| `msg.ts` | Message types using `Data.taggedEnum` from Effect |
| `index.tsx` | Exports: `init`, `update`, `View` component |

### React Native Adaptations

Two custom modules in `src/tea/` replace browser-specific tea-effect modules:

- **`storage.ts`** — Replaces `tea-effect/LocalStorage` using `@react-native-async-storage/async-storage`
- **`navigation-cmd.ts`** — Replaces `tea-effect/Navigation` using React Navigation's imperative API

Both return `Cmd<Msg>`, staying fully within the TEA ecosystem.

### Navigation

Hybrid approach — React Navigation manages screen transitions, TEA manages auth state and screen data:

- `Initializing` → loading spinner (reading session from storage)
- `Anonymous` → login stack
- `Authenticated` → main stack (home, products)

## Project Structure

```
src/
├── tea/                    # Custom RN platform modules (Storage, NavigationCmd)
├── router/                 # Top-level orchestrator (init, update, subscriptions)
│   └── components/         # AppNavigator, AuthenticatedNavigator, AnonymousNavigator
├── auth/                   # Session types + API (login, refresh)
├── login/                  # Login feature module
├── home/                   # Home feature module (demo counter)
├── products/               # Products feature module (API example)
├── navigation/             # Route config + permission guards
├── common/
│   ├── env/                # Environment variables
│   ├── http/               # ApiError types + mapHttpError
│   └── theme/              # Design tokens (colors, spacing, typography)
└── __mocks__/              # Vitest mocks for react-native, expo-constants
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- iOS Simulator (Xcode) and/or Android Emulator

### Installation

```bash
yarn install
```

### Running

```bash
yarn start       # Expo dev server
yarn ios         # iOS simulator
yarn android     # Android emulator
```

## Commands

| Command | Description |
|---------|-------------|
| `yarn start` | Expo dev server |
| `yarn ios` | Start on iOS simulator |
| `yarn android` | Start on Android emulator |
| `yarn checkts` | TypeScript type checking |
| `yarn lint` | ESLint check |
| `yarn test:unit` | Run unit tests (Vitest) |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test` | Full verification: prettier + checkts + unit tests |
| `yarn fix-lint` | Auto-fix ESLint issues |
| `yarn fix-prettier` | Auto-fix Prettier formatting |

## Adding a New Screen

1. Create `src/<feature>/model.ts`, `msg.ts`, `index.tsx`
2. If the screen fetches data: create `src/<feature>/api/` folder (`types.ts`, `routes.ts`, `index.ts`)
3. Add screen variant to `src/router/screen-model.ts` and `screen-msg.ts`
4. Add route mapping in `src/router/index.tsx` (`screenNameToRoute`, `routePermissions`, `startScreen`)
5. Wire into `updateScreen` in `src/router/index.tsx`
6. Add screen to `src/router/components/authenticated-navigator.tsx`
7. Add navigation entry in `src/navigation/config.ts` (with permission guard)
8. Add `src/<feature>/update.test.ts` for update function tests

## HTTP Patterns

### Feature modules: `Http.send`

```typescript
// api/routes.ts
export const getProducts: Http.Request<ProductsResponse> = Http.get(
  `${env.apiBaseUrl}/products`,
  Http.expectJson(ProductsResponse),
)

// index.tsx
const fetchProducts: Cmd.Cmd<Msg> = Http.send(Api.getProducts, {
  onSuccess: productsLoaded,
  onError: productsFailed,
})
```

### Router-level: `Task.attempt`

```typescript
// Used for token refresh where error composition is needed
Task.attempt(refreshCompleted)(Api.refresh(token))
```

## Testing

Tests are colocated with source files as `update.test.ts`. TEA `update` functions are pure — test with plain assertions:

```typescript
import { describe, it, expect } from 'vitest'
import { init, update } from './index'

describe('Feature', () => {
  it('should handle message', () => {
    const [model] = init
    const [newModel, cmd] = update(someMsg, model)
    expect(newModel.field).toBe(expectedValue)
  })
})
```

## Code Style

- No semicolons
- Single quotes
- 120 character line width
- Trailing commas everywhere
- `StyleSheet.create()` for all styles
- Conventional Commits enforced by commitlint

## Environment

Environment variables are configured via `app.json` → `expo.extra` and read at runtime via `expo-constants`.

| Variable | Description | Default |
|----------|-------------|---------|
| `apiBaseUrl` | API base URL | `https://dummyjson.com` |

## Tech Stack

- **Runtime**: React Native 0.81 + Expo SDK 54
- **Architecture**: tea-effect (TEA + Effect-TS)
- **Navigation**: React Navigation 7 (native stack)
- **Storage**: AsyncStorage
- **Language**: TypeScript 5.9 (strict mode)
- **Testing**: Vitest + @effect/vitest
- **Linting**: ESLint 10 + Prettier
- **Git hooks**: Husky + lint-staged + commitlint
