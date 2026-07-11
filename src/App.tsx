import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './shared/BottomNav'
import Placeholder from './shared/Placeholder'
import TasksPage from './features/tasks/TasksPage'

const TITLES: Record<string, string> = {
  '/tasks': 'Задачи',
  '/notes': 'Идеи',
  '/finances': 'Финансы',
}

export default function App() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Enough'

  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <header
        className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 px-4 py-3 text-lg font-semibold backdrop-blur"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        {title}
      </header>

      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notes" element={<Placeholder title="Идеи" />} />
          <Route path="/finances" element={<Placeholder title="Финансы" />} />
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}
