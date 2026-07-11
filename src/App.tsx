import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './shared/BottomNav'
import Placeholder from './shared/Placeholder'
import HomePage from './features/home/HomePage'
import TasksPage from './features/tasks/TasksPage'
import SettingsPage from './features/settings/SettingsPage'

/*
 * Shell layout:
 *  - #root is a fixed, non-scrolling stage (see index.css).
 *  - <main> is absolutely positioned to fill it and is the ONLY scroll
 *    container; pages add bottom padding so content clears the floating bars.
 *  - BottomNav (and the Tasks quick-add bar) are absolute inside #root, so they
 *    are anchored to something that never moves — no iOS rubber-band drift.
 */
export default function App() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/settings'

  return (
    <>
      <main
        className="absolute inset-0 overflow-y-auto"
        style={{ overscrollBehaviorY: 'contain' }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notes" element={<Placeholder title="Заметки" />} />
          <Route path="/more" element={<Placeholder title="Ещё" />} />
          <Route path="/extra" element={<Placeholder title="Скоро" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {!hideNav && <BottomNav />}
    </>
  )
}
