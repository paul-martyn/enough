import { Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './shared/BottomNav'
import Placeholder from './shared/Placeholder'
import HomePage from './features/home/HomePage'
import TasksPage from './features/tasks/TasksPage'

/*
 * Shell layout:
 *  - #root is a fixed, non-scrolling shell (see index.css).
 *  - <main> is the ONLY scroll container; pages add bottom padding so content
 *    can scroll out from under the floating glass bars.
 *  - BottomNav floats above <main> (fixed), content shows through its blur.
 */
export default function App() {
  return (
    <>
      <main
        className="min-h-0 flex-1 overflow-y-auto"
        style={{ overscrollBehaviorY: 'contain' }}
      >
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
    </>
  )
}
