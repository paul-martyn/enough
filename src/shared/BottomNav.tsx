import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { spring } from './motion'

type Item = { to: string; label: string; icon: ReactNode }

// Minimal line icons (monochrome, follow currentColor). Center tab is Главная.
const icons = {
  tasks: (
    <path
      d="M4 12l4 4 12-12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  notes: (
    <path
      d="M6 3h9l5 5v13H6z M15 3v5h5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  home: (
    <path
      d="M4 11l8-7 8 7 M6 10v10h12V10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  grid: (
    <path
      d="M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  dots: (
    <path
      d="M5 12h.01M12 12h.01M19 12h.01"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  ),
}

const items: Item[] = [
  { to: '/tasks', label: 'Задачи', icon: icons.tasks },
  { to: '/notes', label: 'Заметки', icon: icons.notes },
  { to: '/home', label: 'Главная', icon: icons.home },
  { to: '/more', label: 'Ещё', icon: icons.grid },
  { to: '/extra', label: 'Скоро', icon: icons.dots },
]

/**
 * Floating liquid-glass bar (squared corners). The active tab gets a soft
 * colored glow UNDER the glass (layoutId animates it between tabs) plus a
 * springy icon scale.
 */
export default function BottomNav() {
  return (
    <nav
      className="pointer-events-none fixed inset-x-0 z-20 flex justify-center px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 6px)' }}
    >
      <div className="glass pointer-events-auto flex w-full max-w-[420px] items-center justify-around rounded-[22px] px-2 py-2.5 shadow-lg shadow-black/10">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className="relative flex flex-col items-center px-2"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="tab-glow"
                    transition={spring}
                    aria-hidden="true"
                    className="absolute -top-1 h-12 w-12 rounded-full bg-cta/30 blur-md"
                  />
                )}
                <motion.span
                  animate={{ scale: isActive ? 1.12 : 1 }}
                  whileTap={{ scale: 0.88 }}
                  transition={spring}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isActive ? 'bg-ink text-white' : 'text-black/40'
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    {item.icon}
                  </svg>
                </motion.span>
                <span
                  className={`relative mt-0.5 text-[11px] font-bold leading-tight ${
                    isActive ? 'text-ink' : 'text-black/40'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
