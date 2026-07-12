import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TaskRepository } from '../tasks/TaskRepository'
import { useTasks } from '../tasks/useTasks'
import TaskRow from '../tasks/TaskRow'
import { useCategories } from '../categories/useCategories'
import { DEFAULT_CATEGORY_ID } from '../categories/types'
import { categoryColor } from '../../shared/theme'
import { useSettings } from '../settings/useSettings'
import { Card, EmptyState, Eyebrow, QuickAddBar } from '../../shared/ui'
import { tap } from '../../shared/motion'

export default function HomePage() {
  const tasks = useTasks()
  const categories = useCategories()
  const { settings } = useSettings()

  const loading = !tasks || !categories
  const colorOf = (categoryId: string) => {
    const idx = categories?.findIndex((c) => c.id === categoryId) ?? -1
    return categoryColor(idx < 0 ? 0 : idx)
  }

  const todayLabel = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const done = tasks?.filter((t) => t.done === 1).length ?? 0
  const total = tasks?.length ?? 0
  const left = total - done
  const progress = total > 0 ? (done / total) * 100 : 0
  const important = (tasks ?? [])
    .filter((t) => t.done === 0 && t.important === 1)
    .slice(0, 5)

  const name = settings.assistantName || 'enough'

  return (
    <div
      className="mx-auto flex w-full max-w-[640px] flex-col gap-8 px-5"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 24px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 130px)',
      }}
    >
      {/* Header: date + vault name, settings gear, avatar */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="t-caption text-muted">{todayLabel}</div>
          <h1 className="mt-1 truncate t-display text-ink">{name}</h1>
        </div>
        <div className="flex flex-none items-center gap-2">
          <motion.span whileTap={tap} className="inline-flex">
            <Link
              to="/settings"
              aria-label="Настройки"
              className="flex h-11 w-11 items-center justify-center rounded-ctl text-muted hover:bg-black/[.04]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
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
                  className="h-12 w-12 rounded-full border border-hairline object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-tint t-title text-accent">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </Link>
          </motion.span>
        </div>
      </div>

      {/* Quick add — same bar as on Tasks, in its card form */}
      <QuickAddBar
        placeholder="Быстро добавить задачу…"
        onSubmit={(title) =>
          void TaskRepository.add({ title, categoryId: DEFAULT_CATEGORY_ID })
        }
        className="border border-hairline bg-surface shadow-e1"
      />

      {/* Signature: the day at a glance */}
      <Card className="p-5">
        <Eyebrow>Сегодня</Eyebrow>
        <div className="flex items-baseline gap-1.5">
          <span className="tnum text-[32px] font-extrabold leading-none tracking-[-0.02em] text-ink">
            {loading ? '—' : done}
          </span>
          <span className="tnum text-[17px] font-bold text-faint">
            / {loading ? '—' : total}
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/[.06]">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 t-body font-medium">
          {loading ? (
            <span className="text-muted">…</span>
          ) : total === 0 ? (
            <span className="text-muted">Задач пока нет — добавьте первую.</span>
          ) : left > 0 ? (
            <span className="text-muted">
              Осталось {left} {taskWord(left)}
            </span>
          ) : (
            <span className="font-bold text-accent">на сегодня — достаточно.</span>
          )}
        </div>
      </Card>

      {/* Important (starred) tasks */}
      <section>
        <Eyebrow>Важное</Eyebrow>
        <div className="flex flex-col gap-2">
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
            <EmptyState>
              Отмечайте задачи звёздочкой — самое важное соберётся здесь.
            </EmptyState>
          )}
        </div>
      </section>
    </div>
  )
}

function taskWord(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'задача'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'задачи'
  return 'задач'
}
