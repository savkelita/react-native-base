import type { AuthorizationConfig } from '../auth/types'
import { hasAllPermissions, emptyAuthorization } from '../auth/types'
import { NavigationEntry, navigationLink } from './types'

// -------------------------------------------------------------------------------------
// Configuration: Declare all navigation items here
// -------------------------------------------------------------------------------------

const allEntries: ReadonlyArray<NavigationEntry> = [
  navigationLink('home', 'Home', 'Home', { requiredPermissions: ['home.view'] }),
  navigationLink('products', 'Products', 'Products', { requiredPermissions: ['products.view'] }),
]

// -------------------------------------------------------------------------------------
// Authorization filtering
// -------------------------------------------------------------------------------------

const isPermitted = (config: AuthorizationConfig, permissions: ReadonlyArray<string>): boolean =>
  permissions.length === 0 || hasAllPermissions(config, permissions)

const filterEntries = (
  config: AuthorizationConfig,
  entries: ReadonlyArray<NavigationEntry>,
): ReadonlyArray<NavigationEntry> =>
  entries.flatMap(entry =>
    NavigationEntry.$match(entry, {
      NavigationLink: link => (isPermitted(config, link.requiredPermissions) ? [entry] : []),
    }),
  )

// -------------------------------------------------------------------------------------
// Builders
// -------------------------------------------------------------------------------------

export const buildNavigation = (config: AuthorizationConfig): ReadonlyArray<NavigationEntry> =>
  filterEntries(config, allEntries)

export const buildPublicNavigation = (): ReadonlyArray<NavigationEntry> => filterEntries(emptyAuthorization, allEntries)
