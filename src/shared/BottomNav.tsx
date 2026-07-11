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

export default function BottomNav() {
  return (
    <nav
      className="flex flex-none justify-around border-t border-black/5 bg-white px-2 pt-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? 'text-ink' : 'text-black/35'
            }`
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            {item.icon}
          </svg>
          <span className="text-[11px] font-bold">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
