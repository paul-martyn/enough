import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { CategoryRepository } from './features/categories/CategoryRepository'
import './index.css'

// Seed default categories on first run (idempotent). liveQuery picks them up.
void CategoryRepository.ensureSeed()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
