import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import BottomNav from './shared/BottomNav'
import Placeholder from './shared/Placeholder'
import HomePage from './features/home/HomePage'
import TasksPage from './features/tasks/TasksPage'
import SettingsPage from './features/settings/SettingsPage'
import { pageVariants } from './shared/motion'

/*
 * Shell layout:
 *  - #root is a fixed, non-scrolling stage (see index.css).
 *  - <main> is absolutely positioned to fill it and is the ONLY scroll
 *    container; pages add bottom padding so content clears the floating bars.
 *  - Route changes animate via AnimatePresence (fade + rise).
 */
export default function App() {
  const location = useLocation()
  const hideNav = location.pathname === '/settings'

  return (
    <>
      <main
        className="absolute inset-0 overflow-y-auto"
        style={{ overscrollBehaviorY: 'contain' }}
      >
        {/* Keyed remount animates each page in; exit is instant (AnimatePresence
            route exits hang with framer-motion 12 + React 19 + Router 7). */}
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/notes" element={<Placeholder title="Заметки" />} />
            <Route path="/more" element={<Placeholder title="Ещё" />} />
            <Route path="/extra" element={<Placeholder title="Скоро" />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </motion.div>
      </main>

      {!hideNav && <BottomNav />}
    </>
  )
}
