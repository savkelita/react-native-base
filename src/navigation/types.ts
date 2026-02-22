import { Data } from 'effect'

export type NavigationEntry = Data.TaggedEnum<{
  NavigationLink: {
    readonly key: string
    readonly label: string
    readonly screen: string
    readonly requiredPermissions: ReadonlyArray<string>
  }
}>

export const NavigationEntry = Data.taggedEnum<NavigationEntry>()

export const navigationLink = (
  key: string,
  label: string,
  screen: string,
  options?: { requiredPermissions?: ReadonlyArray<string> },
): NavigationEntry =>
  NavigationEntry.NavigationLink({
    key,
    label,
    screen,
    requiredPermissions: options?.requiredPermissions ?? [],
  })
