import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

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
 * Floating liquid-glass pill. Content scrolls beneath it and shows through
 * the backdrop blur. Fixed so it never moves with page scroll.
 */
export default function BottomNav() {
  return (
    <nav
      className="pointer-events-none fixed inset-x-0 z-20 flex justify-center px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      <div className="pointer-events-auto flex w-full max-w-[400px] items-center justify-around rounded-full border border-white/50 bg-white/60 px-2 py-2 shadow-lg shadow-black/10 backdrop-blur-2xl supports-[not(backdrop-filter:blur(0))]:bg-white/90">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className="flex flex-col items-center"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    isActive ? 'bg-ink text-white' : 'text-black/40'
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                    {item.icon}
                  </svg>
                </span>
                <span
                  className={`text-[10px] font-bold leading-tight ${
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
