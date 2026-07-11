import { NavLink } from 'react-router-dom'

const items = [
  { to: '/tasks', label: 'Задачи', icon: '✓' },
  { to: '/notes', label: 'Идеи', icon: '💡' },
  { to: '/finances', label: 'Финансы', icon: '₽' },
]

export default function BottomNav() {
  return (
    <nav
      className="sticky bottom-0 z-10 flex border-t border-slate-800 bg-slate-900/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
