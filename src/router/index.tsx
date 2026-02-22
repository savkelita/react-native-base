import { Either, Option } from 'effect'
import * as Cmd from 'tea-effect/Cmd'
import * as Sub from 'tea-effect/Sub'
import * as Task from 'tea-effect/Task'
import * as Api from '../auth/api'
import { Session, SESSION_KEY, toAuthorizationConfig } from '../auth/session'
import { hasAllPermissions } from '../auth/types'
import * as Home from '../home'
import * as ProductDetail from '../products/detail'
import * as Products from '../products'
import * as Login from '../login'
import * as Storage from '../tea/storage'
import * as NavigationCmd from '../tea/navigation-cmd'
import { Model } from './model'
import { Msg, screen, sessionLoaded, sessionLoadError, login, refreshTick, refreshCompleted } from './msg'
import { ScreenModel, homeScreen, productsScreen, productDetailScreen } from './screen-model'
import { ScreenMsg, homeMsg, productsMsg, productDetailMsg } from './screen-msg'

export type { Model }
export type { Msg }

// -------------------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------------------

type Route = { readonly _tag: 'home' } | { readonly _tag: 'products' }

const screenNameToRoute = (name: string): Option.Option<Route> => {
  switch (name) {
    case 'Home':
      return Option.some({ _tag: 'home' as const })
    case 'Products':
      return Option.some({ _tag: 'products' as const })
    default:
      return Option.none()
  }
}

const routePermissions: Record<string, ReadonlyArray<string>> = {
  home: ['home.view'],
  products: ['products.view'],
}

const getRoutePermissions = (routeTag: string): ReadonlyArray<string> => routePermissions[routeTag] ?? []

const startScreen = (route: Route): [ScreenModel, Cmd.Cmd<ScreenMsg>] => {
  switch (route._tag) {
    case 'home': {
      const [model, cmd] = Home.init
      return [homeScreen(model), Cmd.map(homeMsg)(cmd)]
    }
    case 'products': {
      const [model, cmd] = Products.init
      return [productsScreen(model), Cmd.map(productsMsg)(cmd)]
    }
  }
}

const startScreenWithAuth = (
  route: Option.Option<Route>,
  config: ReturnType<typeof toAuthorizationConfig>,
): [ScreenModel, Cmd.Cmd<ScreenMsg>] =>
  Option.match(route, {
    onNone: () => [ScreenModel.NotFoundScreen({ path: 'unknown' }), Cmd.none],
    onSome: r => {
      const perms = getRoutePermissions(r._tag)
      if (!hasAllPermissions(config, perms)) return [ScreenModel.UnauthorizedScreen({ path: r._tag }), Cmd.none]
      return startScreen(r)
    },
  })

const updateScreen = (msg: ScreenMsg, screenModel: ScreenModel): [ScreenModel, Cmd.Cmd<ScreenMsg>] =>
  ScreenMsg.$match(msg, {
    HomeMsg: ({ msg: homeMessage }): [ScreenModel, Cmd.Cmd<ScreenMsg>] => {
      if (screenModel._tag !== 'HomeScreen') return [screenModel, Cmd.none]
      const [model, cmd] = Home.update(homeMessage, screenModel.model)
      return [homeScreen(model), Cmd.map(homeMsg)(cmd)]
    },
    ProductsMsg: ({ msg: productsMessage }): [ScreenModel, Cmd.Cmd<ScreenMsg>] => {
      if (screenModel._tag !== 'ProductsScreen') return [screenModel, Cmd.none]
      const [model, cmd] = Products.update(productsMessage, screenModel.model)
      return [productsScreen(model), Cmd.map(productsMsg)(cmd)]
    },
    ProductDetailMsg: ({ msg: productDetailMessage }): [ScreenModel, Cmd.Cmd<ScreenMsg>] => {
      if (screenModel._tag !== 'ProductDetailScreen') return [screenModel, Cmd.none]
      const [model, cmd] = ProductDetail.update(productDetailMessage, screenModel.model)
      return [productDetailScreen(model), Cmd.map(productDetailMsg)(cmd)]
    },
  })

const initAuthenticated = (session: typeof Session.Type): [Model, Cmd.Cmd<Msg>] => {
  const [screenModel, screenCmd] = startScreen({ _tag: 'home' })
  return [Model.Authenticated({ session, screen: screenModel }), Cmd.map(screen)(screenCmd)]
}

const initAnonymous = (): [Model, Cmd.Cmd<Msg>] => {
  const [loginModel, loginCmd] = Login.init
  return [Model.Anonymous({ login: loginModel }), Cmd.map(login)(loginCmd)]
}

// -------------------------------------------------------------------------------------
// Init
// -------------------------------------------------------------------------------------

export const init: [Model, Cmd.Cmd<Msg>] = [
  Model.Initializing(),
  Storage.get(SESSION_KEY, Session, { onSuccess: sessionLoaded, onError: sessionLoadError }),
]

// -------------------------------------------------------------------------------------
// Update
// -------------------------------------------------------------------------------------

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] =>
  Msg.$match(msg, {
    SessionLoaded: ({ session }): [Model, Cmd.Cmd<Msg>] => {
      if (model._tag !== 'Initializing') return [model, Cmd.none]
      return Option.match(session, {
        onNone: () => initAnonymous(),
        onSome: s => initAuthenticated(s),
      })
    },

    SessionLoadError: (): [Model, Cmd.Cmd<Msg>] => {
      if (model._tag !== 'Initializing') return [model, Cmd.none]
      return initAnonymous()
    },

    Login: ({ loginMsg }): [Model, Cmd.Cmd<Msg>] => {
      if (model._tag !== 'Anonymous') return [model, Cmd.none]
      const [loginModel, loginCmd] = Login.update(loginMsg, model.login)
      if (Option.isSome(loginModel.result)) {
        const session = loginModel.result.value
        const [authModel, authCmd] = initAuthenticated(session)
        return [authModel, Cmd.batch([authCmd, Storage.setIgnoreErrors(SESSION_KEY, Session, session)])]
      }
      return [Model.Anonymous({ login: loginModel }), Cmd.map(login)(loginCmd)]
    },

    Logout: (): [Model, Cmd.Cmd<Msg>] => {
      const [anonModel, anonCmd] = initAnonymous()
      return [anonModel, Cmd.batch([anonCmd, Storage.removeIgnoreErrors(SESSION_KEY)])]
    },

    Screen: ({ screenMsg }): [Model, Cmd.Cmd<Msg>] => {
      if (model._tag !== 'Authenticated') return [model, Cmd.none]
      const [screenModel, screenCmd] = updateScreen(screenMsg, model.screen)
      return [Model.Authenticated({ ...model, screen: screenModel }), Cmd.map(screen)(screenCmd)]
    },

    NavigateToProduct: ({ productId }): [Model, Cmd.Cmd<Msg>] => {
      if (model._tag !== 'Authenticated') return [model, Cmd.none]
      const [detailModel, detailCmd] = ProductDetail.init(productId)
      return [
        Model.Authenticated({ ...model, screen: productDetailScreen(detailModel) }),
        Cmd.batch([Cmd.map(screen)(Cmd.map(productDetailMsg)(detailCmd)), NavigationCmd.navigate('ProductDetail')]),
      ]
    },

    Navigate: ({ screenName }): [Model, Cmd.Cmd<Msg>] => {
      if (model._tag !== 'Authenticated') return [model, Cmd.none]
      const config = toAuthorizationConfig(model.session)
      const route = screenNameToRoute(screenName)
      const [screenModel, screenCmd] = startScreenWithAuth(route, config)
      return [
        Model.Authenticated({ ...model, screen: screenModel }),
        Cmd.batch([Cmd.map(screen)(screenCmd), NavigationCmd.navigate(screenName)]),
      ]
    },

    RefreshTick: (): [Model, Cmd.Cmd<Msg>] => {
      if (model._tag !== 'Authenticated') return [model, Cmd.none]
      return [model, Task.attempt(refreshCompleted)(Api.refresh(model.session.refreshToken))]
    },

    RefreshCompleted: ({ result }): [Model, Cmd.Cmd<Msg>] => {
      if (model._tag !== 'Authenticated') return [model, Cmd.none]
      return Either.match(result, {
        onLeft: (): [Model, Cmd.Cmd<Msg>] => {
          const [anonModel, anonCmd] = initAnonymous()
          return [anonModel, Cmd.batch([anonCmd, Storage.removeIgnoreErrors(SESSION_KEY)])]
        },
        onRight: (refreshResult): [Model, Cmd.Cmd<Msg>] => {
          const updatedSession: typeof Session.Type = {
            ...model.session,
            accessToken: refreshResult.accessToken,
            refreshToken: refreshResult.refreshToken,
          }
          return [
            Model.Authenticated({ ...model, session: updatedSession }),
            Storage.setIgnoreErrors(SESSION_KEY, Session, updatedSession),
          ]
        },
      })
    },
  })

// -------------------------------------------------------------------------------------
// Subscriptions
// -------------------------------------------------------------------------------------

const REFRESH_INTERVAL_MS = 4 * 60 * 1000

export const subscriptions = (model: Model): Sub.Sub<Msg> => {
  if (model._tag !== 'Authenticated') return Sub.none
  return Sub.interval(REFRESH_INTERVAL_MS, refreshTick())
}
