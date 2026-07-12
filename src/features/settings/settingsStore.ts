import { DEFAULT_SETTINGS, type Settings } from './types'

/**
 * Device-level UI preferences (background, glass, scale). Stored in
 * localStorage — synchronous read means we can apply them BEFORE first paint
 * (no flash of default look), and they intentionally don't sync across devices.
 *
 * Applied by writing CSS variables the stylesheet reads:
 *   --color-cream (background), --glass-opacity, --glass-blur, --app-scale.
 */
const KEY = 'enough.settings.v1'

let current: Settings = load()
const listeners = new Set<(s: Settings) => void>()

export function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function get(): Settings {
  return current
}

export function apply(s: Settings): void {
  const root = document.documentElement
  // Override the Tailwind theme color so every `bg-cream` follows the choice.
  root.style.setProperty('--color-cream', s.background)
  root.style.setProperty('--app-bg', s.background)
  root.style.setProperty('--glass-opacity', String(s.glassOpacity))
  root.style.setProperty('--glass-blur', `${s.glassBlur}px`)
  root.style.setProperty('--app-scale', String(s.scale))
  document.body.style.background = s.background
}

export function save(patch: Partial<Settings>): void {
  current = { ...current, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(current))
  } catch {
    /* ignore quota/private-mode errors */
  }
  apply(current)
  listeners.forEach((cb) => cb(current))
}

/** Reset appearance only — profile (name/avatar) is kept intentionally. */
export function reset(): void {
  const { background, glassOpacity, glassBlur, scale } = DEFAULT_SETTINGS
  save({ background, glassOpacity, glassBlur, scale })
}

export function subscribe(cb: (s: Settings) => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
