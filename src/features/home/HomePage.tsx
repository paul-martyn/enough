import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TaskRepository } from '../tasks/TaskRepository'
import { useTasks } from '../tasks/useTasks'
import TaskRow from '../tasks/TaskRow'
import { useCategories } from '../categories/useCategories'
import { DEFAULT_CATEGORY_ID } from '../categories/types'
import { categoryColor } from '../../shared/theme'
import { useSettings } from '../settings/useSettings'
import { tap } from '../../shared/motion'

export default function HomePage() {
  const tasks = useTasks()
  const categories = useCategories()
  const { settings } = useSettings()
  const [quick, setQuick] = useState('')

  const loading = !tasks || !categories
  const colorOf = (categoryId: string) => {
    const idx = categories?.findIndex((c) => c.id === categoryId) ?? -1
    return categoryColor(idx < 0 ? 0 : idx)
  }

  async function submitQuick(e: React.FormEvent) {
    e.preventDefault()
    const title = quick.trim()
    if (!title) return
    await TaskRepository.add({ title, categoryId: DEFAULT_CATEGORY_ID })
    setQuick('')
  }

  const todayLabelRaw = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const todayLabel = todayLabelRaw.charAt(0).toUpperCase() + todayLabelRaw.slice(1)

  const doneToday = tasks?.filter((t) => t.done === 1).length ?? 0
  const total = tasks?.length ?? 0
  const important = (tasks ?? [])
    .filter((t) => t.done === 0 && t.important === 1)
    .slice(0, 5)

  const name = settings.assistantName || 'enough'

  return (
    <div
      className="mx-auto flex w-full max-w-[640px] flex-col gap-7 px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 28px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 130px)',
      }}
    >
      {/* Header: vault name + date, settings gear, avatar */}
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="truncate text-[30px] font-extrabold leading-tight text-ink">
            {name}
          </div>
          <div className="mt-1 text-[15px] font-medium text-black/45">{todayLabel}</div>
        </div>
        <div className="flex flex-none items-center gap-2.5">
          <motion.span whileTap={tap} className="inline-flex">
            <Link
              to="/settings"
              aria-label="Настройки"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-ink"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z M19.4 13a7.6 7.6 0 000-2l2-1.5-2-3.5-2.4 1a7.6 7.6 0 00-1.7-1l-.4-2.5h-4l-.4 2.5a7.6 7.6 0 00-1.7 1l-2.4-1-2 3.5L4.6 11a7.6 7.6 0 000 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 001.7 1l.4 2.5h4l.4-2.5a7.6 7.6 0 001.7-1l2.4 1 2-3.5-2-1.5z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.span>
          <motion.span whileTap={tap} className="inline-flex">
            <Link to="/settings" aria-label="Профиль" className="block">
              {settings.avatarDataUrl ? (
                <img
                  src={settings.avatarDataUrl}
                  alt=""
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffd23f] text-2xl font-extrabold text-ink">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </Link>
          </motion.span>
        </div>
      </div>

      {/* Quick add */}
      <form
        onSubmit={submitQuick}
        className="flex items-center gap-3 rounded-[22px] bg-ink px-5 py-4"
      >
        <input
          value={quick}
          onChange={(e) => setQuick(e.target.value)}
          placeholder="Быстро добавить задачу…"
          className="min-w-0 flex-1 border-none bg-transparent text-[16px] font-semibold text-white placeholder:text-white/50 focus:outline-none"
        />
        <motion.button
          whileTap={tap}
          type="submit"
          aria-label="Добавить"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-cta text-2xl font-extrabold text-ink"
        >
          +
        </motion.button>
      </form>

      {/* Stats */}
      <div className="rounded-2xl bg-[#8ee6b0] p-5">
        <div className="text-[32px] font-bold leading-none text-ink">
          {loading ? '—' : `${doneToday}/${total}`}
        </div>
        <div className="mt-2 text-[13px] font-semibold text-black/60">
          Сегодня выполнено
        </div>
      </div>

      {/* Important (starred) tasks */}
      <div>
        <div className="mb-3 text-[17px] font-bold text-ink">Важное</div>
        <div className="flex flex-col gap-2.5">
          {important.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TaskRow task={t} color={colorOf(t.categoryId)} />
            </motion.div>
          ))}
          {!loading && important.length === 0 && (
            <div className="rounded-2xl bg-black/[.04] px-5 py-5 text-[14px] font-semibold leading-snug text-black/40">
              Отмечай задачи звёздочкой ⭐ — они появятся здесь.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
