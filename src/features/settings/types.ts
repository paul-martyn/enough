export interface Settings {
  /** Background color (hex) — one of BACKGROUND_PRESETS' values. */
  background: string
  /** Glass opacity 0.3–0.9. */
  glassOpacity: number
  /** Glass blur in px, 6–40. */
  glassBlur: number
  /** UI zoom 0.85–1.20. */
  scale: number
  /** Display name of this assistant/vault, shown on the Home header. */
  assistantName: string
  /** Small square avatar as a data URL (canvas-resized), or null. */
  avatarDataUrl: string | null
}

export const BACKGROUND_PRESETS: ReadonlyArray<{ name: string; value: string }> = [
  { name: 'Бумага', value: '#f7f4ee' },
  { name: 'Белый', value: '#ffffff' },
  { name: 'Лён', value: '#f3efe6' },
  { name: 'Шалфей', value: '#eef3ec' },
  { name: 'Небо', value: '#edf1f5' },
  { name: 'Лаванда', value: '#f0edf5' },
]

export const LIMITS = {
  glassOpacity: { min: 0.3, max: 0.9, step: 0.05 },
  glassBlur: { min: 6, max: 40, step: 1 },
  scale: { min: 0.85, max: 1.2, step: 0.05 },
} as const

export const DEFAULT_SETTINGS: Settings = {
  background: '#f7f4ee',
  glassOpacity: 0.85,
  glassBlur: 14,
  scale: 1,
  assistantName: 'enough',
  avatarDataUrl: null,
}
