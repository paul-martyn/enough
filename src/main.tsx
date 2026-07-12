import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.tsx'
import { CategoryRepository } from './features/categories/CategoryRepository'
import { apply, load } from './features/settings/settingsStore'
import './index.css'

// Apply saved UI settings BEFORE first paint (no flash of default look).
apply(load())

// Seed default categories on first run (idempotent). liveQuery picks them up.
void CategoryRepository.ensureSeed()

// Lock the zoom: Safari ignores user-scalable=no in-browser, so block pinch
// (gesture events) and double-tap zoom. UI scale is controlled in Settings.
for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
  document.addEventListener(type, (e) => e.preventDefault(), { passive: false })
}
let lastTouchEnd = 0
document.addEventListener(
  'touchend',
  (e) => {
    const now = Date.now()
    if (now - lastTouchEnd < 300) e.preventDefault()
    lastTouchEnd = now
  },
  { passive: false },
)

// NOTE: StrictMode is intentionally off — its double-mount breaks
// AnimatePresence exit animations (framer-motion), freezing route changes.
createRoot(document.getElementById('root')!).render(
  <HashRouter>
    {/* Respect the OS "reduce motion" preference across all framer animations. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </HashRouter>,
)
