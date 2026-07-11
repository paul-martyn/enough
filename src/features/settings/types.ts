export interface Settings {
  /** Background color (hex) — one of BACKGROUND_PRESETS' values. */
  background: string
  /** Glass opacity 0.3–0.9. */
  glassOpacity: number
  /** Glass blur in px, 6–40. */
  glassBlur: number
  /** UI zoom 0.85–1.20. */
  scale: number
}

export const BACKGROUND_PRESETS: ReadonlyArray<{ name: string; value: string }> = [
  { name: 'Кремовый', value: '#fbf8f2' },
  { name: 'Белый', value: '#ffffff' },
  { name: 'Мятный', value: '#eef6f0' },
  { name: 'Персиковый', value: '#fdf0ea' },
  { name: 'Голубой', value: '#eef1fb' },
  { name: 'Сиреневый', value: '#f3eefb' },
]

export const LIMITS = {
  glassOpacity: { min: 0.3, max: 0.9, step: 0.05 },
  glassBlur: { min: 6, max: 40, step: 1 },
  scale: { min: 0.85, max: 1.2, step: 0.05 },
} as const

export const DEFAULT_SETTINGS: Settings = {
  background: '#fbf8f2',
  glassOpacity: 0.55,
  glassBlur: 22,
  scale: 1,
}
