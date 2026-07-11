// Design tokens for the "soft / candy" style (see Design Style Guide).
// Core colors also live as CSS variables in index.css (Tailwind @theme) so they
// can be used as classes (bg-cream, text-ink, bg-cta). Category colors are
// dynamic, so they live here and are applied via inline styles.

export const COLORS = {
  bgOutside: '#dedad0', // behind the phone-width card on desktop
  cream: '#fbf8f2', // app background
  ink: '#1a1a1a', // text / dark buttons
  cta: '#ff5fa2', // pink accent — the "+" action
  done: '#f1efe9', // completed task background
} as const

// Pastel palette assigned to categories, cycled for new ones.
export const CATEGORY_PALETTE = [
  '#ffd23f', // yellow
  '#ff9a7a', // peach
  '#8ee6b0', // green
  '#b7c9ff', // blue
  '#ff8fd0', // pink
  '#c9b8ff', // lilac
] as const

export function categoryColor(index: number): string {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]
}
