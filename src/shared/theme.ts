// Design tokens for the "warm paper & ink" system.
// Core colors live as CSS variables in index.css (Tailwind @theme) and are
// used as classes (bg-paper, text-ink, bg-accent…). Category colors are
// dynamic, so they live here and are applied via inline styles.

export const COLORS = {
  paper: '#f7f4ee', // app background (warm paper)
  surface: '#ffffff', // cards
  ink: '#241f18', // warm ink text
  muted: '#6b6257', // secondary text (AA on surface/paper)
  accent: '#2f6d4f', // fir/sage green — progress, checks, active states
  danger: '#c64b3c',
} as const

// Muted warm identity pairs assigned to categories, cycled for new ones.
// `solid` marks the category (left rail on task cards, dot in chips);
// `tint` is its quiet background where one is needed.
export const CATEGORY_COLORS: ReadonlyArray<{ solid: string; tint: string }> = [
  { solid: '#a8761f', tint: '#f3e9d3' }, // охра
  { solid: '#b05a3c', tint: '#f4e4db' }, // глина
  { solid: '#4e7a54', tint: '#e4eddf' }, // шалфей
  { solid: '#4a6fa5', tint: '#e2e9f2' }, // пыльно-синий
  { solid: '#a05468', tint: '#f4e3e7' }, // розовое дерево
  { solid: '#71618f', tint: '#eae5f0' }, // фиалка
]

export function categoryColor(index: number): string {
  return CATEGORY_COLORS[((index % CATEGORY_COLORS.length) + CATEGORY_COLORS.length) % CATEGORY_COLORS.length].solid
}

export function categoryTint(index: number): string {
  return CATEGORY_COLORS[((index % CATEGORY_COLORS.length) + CATEGORY_COLORS.length) % CATEGORY_COLORS.length].tint
}
