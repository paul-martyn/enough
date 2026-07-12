import { useState } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { softSpring, tap } from './motion'

/*
 * Design primitives — the only place component chrome is defined.
 * Screens compose these instead of styling elements ad hoc.
 * Tokens (colors, radii, shadows, type) live in index.css / theme.ts.
 */

type ButtonVariant = 'primary' | 'ghost' | 'danger'

/** motion.button props with plain ReactNode children (no MotionValues). */
type MotionButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children?: React.ReactNode
}

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white',
  danger: 'bg-danger text-white',
  ghost: 'bg-transparent text-muted hover:bg-black/[.04]',
}

/** Standard action button. 44px min height, radius-ctl, t-strong. */
export function Button({
  variant = 'ghost',
  className = '',
  children,
  ...rest
}: { variant?: ButtonVariant } & MotionButtonProps) {
  return (
    <motion.button
      whileTap={tap}
      className={`min-h-11 rounded-ctl px-4 py-3 t-strong ${buttonStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/** Quiet 44px icon button — the standard touch target for icon actions. */
export function IconButton({
  label,
  className = '',
  children,
  ...rest
}: { label: string } & MotionButtonProps) {
  return (
    <motion.button
      whileTap={tap}
      aria-label={label}
      className={`flex h-11 w-11 flex-none items-center justify-center rounded-ctl text-muted hover:bg-black/[.04] ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/** White card surface: radius-card, hairline border, e1 elevation. */
export function Card({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-card border border-hairline bg-surface shadow-e1 ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Filter/selection chip. `dot` renders the category identity dot.
 * Extra pointer props (long-press handling) pass straight through.
 */
export function Chip({
  active = false,
  dot,
  className = '',
  children,
  ...rest
}: { active?: boolean; dot?: string } & MotionButtonProps) {
  return (
    <motion.button
      whileTap={tap}
      className={`flex h-11 flex-none items-center gap-2 whitespace-nowrap rounded-ctl border px-4 t-label ${
        active
          ? 'border-ink bg-ink text-white'
          : 'border-hairline bg-surface text-ink'
      } ${className}`}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-2 w-2 flex-none rounded-full"
          style={{ background: dot }}
        />
      )}
      {children}
    </motion.button>
  )
}

/** Section header: quiet caps caption with an optional right-hand slot. */
export function Eyebrow({
  children,
  right,
}: {
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="mb-3 flex min-h-6 items-center justify-between">
      <div className="t-caption text-muted">{children}</div>
      {right}
    </div>
  )
}

/** Standard text field. */
export function TextInput({
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-ctl border border-hairline bg-surface px-4 py-3 t-body text-ink placeholder:text-faint focus:border-accent focus:outline-none ${className}`}
      {...rest}
    />
  )
}

/**
 * Centered dialog: warm scrim, e3 card, radius-bar. Overlay click closes.
 * The single dialog chrome for confirmations and small forms.
 */
export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center px-6"
      style={{ background: 'rgba(36, 31, 24, 0.35)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-label={title}
        className="w-full max-w-[340px] rounded-bar bg-surface p-5 shadow-e3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, transition: softSpring }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="t-title text-ink">{title}</div>
        {children}
      </motion.div>
    </motion.div>
  )
}

/**
 * The one quick-add bar, shared by Home (card variant) and Tasks (floating
 * frost variant) — pass the chrome via className. Owns its input state;
 * the screen decides what to do with the submitted title.
 */
export function QuickAddBar({
  placeholder,
  onSubmit,
  className = '',
}: {
  placeholder: string
  onSubmit: (title: string) => void
  className?: string
}) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const title = value.trim()
    if (!title) return
    onSubmit(title)
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 rounded-bar p-2 pl-4 ${className}`}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent t-body text-ink placeholder:text-faint focus:outline-none"
      />
      <motion.button
        whileTap={tap}
        type="submit"
        aria-label="Добавить задачу"
        className="flex h-11 w-11 flex-none items-center justify-center rounded-ctl bg-ink text-white"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 4v12 M4 10h12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>
    </form>
  )
}

/** Quiet empty state — an invitation, not an apology. */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-hairline bg-surface/60 px-5 py-6 t-body font-medium text-muted">
      {children}
    </div>
  )
}
