import { Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './shared/BottomNav'
import Placeholder from './shared/Placeholder'
import HomePage from './features/home/HomePage'
import TasksPage from './features/tasks/TasksPage'

export default function App() {
  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col bg-cream shadow-[0_0_60px_rgba(0,0,0,0.08)]">
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notes" element={<Placeholder title="Заметки" />} />
          <Route path="/more" element={<Placeholder title="Ещё" />} />
          <Route path="/extra" element={<Placeholder title="Скоро" />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}
