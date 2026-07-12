import type { Transition, Variants } from 'framer-motion'

/** Snappy default spring used across the app. */
export const spring: Transition = { type: 'spring', stiffness: 400, damping: 30 }

/** Softer spring for larger surfaces (dialogs, pages). */
export const softSpring: Transition = { type: 'spring', stiffness: 300, damping: 32 }

/** Route/page enter animation (exit is instant — see App.tsx note). */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

/** Standard press feedback for every interactive element. */
export const tap = { scale: 0.96 }
