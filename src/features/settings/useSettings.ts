import { useSyncExternalStore } from 'react'
import { get, save, subscribe } from './settingsStore'
import type { Settings } from './types'

/** Reactive access to UI settings. */
export function useSettings(): {
  settings: Settings
  update: (patch: Partial<Settings>) => void
} {
  const settings = useSyncExternalStore(subscribe, get, get)
  return { settings, update: save }
}
