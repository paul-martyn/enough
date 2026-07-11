import { useState } from 'react'
import { TaskRepository } from './TaskRepository'
import { useTasks } from './useTasks'
import { CategoryRepository } from '../categories/CategoryRepository'
import { useCategories } from '../categories/useCategories'
import { DEFAULT_CATEGORY_ID } from '../categories/types'
import { categoryColor } from '../../shared/theme'
import type { Task } from './types'

type Filter = 'all' | string // 'all' or a categoryId

export default function TasksPage() {
  const tasks = useTasks()
  const categories = useCategories()
  const [filter, setFilter] = useState<Filter>('all')
  const [quick, setQuick] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const loading = !tasks || !categories
  const colorIndexOf = (categoryId: string) =>
    categories?.findIndex((c) => c.id === categoryId) ?? 0

  // Where a quick-added task lands: the active category, or the default under "Все".
  const targetCategory = filter === 'all' ? DEFAULT_CATEGORY_ID : filter

  async function submitQuick(e: React.FormEvent) {
    e.preventDefault()
    const title = quick.trim()
    if (!title) return
    await TaskRepository.add({ title, categoryId: targetCategory })
    setQuick('')
  }

  async function submitCategory(e: React.FormEvent) {
    e.preventDefault()
    const name = newCategory.trim()
    if (!name) return
    await CategoryRepository.add(name)
    setNewCategory('')
    setAddingCategory(false)
  }

  const visibleCats = (categories ?? []).filter(
    (c) => filter === 'all' || c.id === filter,
  )

  const groups = visibleCats.map((c) => {
    const catTasks = (tasks ?? []).filter((t) => t.categoryId === c.id)
    const undone = catTasks.filter((t) => t.done === 0)
    const done = catTasks.filter((t) => t.done === 1)
    return { category: c, tasks: [...undone, ...done] }
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div
        className="flex-none px-6 pb-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 28px)' }}
      >
        <div className="text-2xl font-extrabold text-ink">Задачи</div>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-none gap-2 overflow-x-auto px-6 pb-3">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
          Все
        </Chip>
        {(categories ?? []).map((c) => (
          <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.name}
          </Chip>
        ))}

        {addingCategory ? (
          <form onSubmit={submitCategory} className="flex flex-none items-center gap-1.5">
            <input
              autoFocus
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Название"
              className="w-28 rounded-[14px] border-2 border-black/12 bg-white px-3 py-1.5 text-[13px] font-bold text-ink focus:outline-none"
            />
            <button
              type="submit"
              className="flex-none rounded-[14px] bg-ink px-3.5 py-1.5 text-[13px] font-bold text-white"
            >
              ОК
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAddingCategory(true)}
            className="flex-none whitespace-nowrap rounded-[14px] border-2 border-dashed border-black/25 bg-white px-3.5 py-1.5 text-[13px] font-bold text-black/45"
          >
            + Категория
          </button>
        )}
      </div>

      {/* Grouped task list */}
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 pb-4 pt-1">
        {loading && <div className="py-8 text-center text-black/40">Загрузка…</div>}

        {!loading &&
          groups.map(({ category, tasks: rows }) => (
            <div key={category.id}>
              <div className="mb-2 text-[13px] font-bold tracking-wide text-black/45">
                {category.name.toUpperCase()}
              </div>
              <div className="flex flex-col gap-2">
                {rows.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    color={categoryColor(colorIndexOf(task.categoryId))}
                  />
                ))}
                {rows.length === 0 && (
                  <div className="px-0.5 py-1 text-[13px] font-semibold text-black/35">
                    Пока нет задач
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Persistent quick-add bar (always visible, above the tab bar) */}
      <form
        onSubmit={submitQuick}
        className="flex flex-none items-center gap-3 border-t border-black/5 bg-cream px-6 py-3"
      >
        <input
          value={quick}
          onChange={(e) => setQuick(e.target.value)}
          placeholder="Новая задача…"
          className="min-w-0 flex-1 rounded-2xl border-2 border-black/10 bg-white px-4 py-3 text-[15px] font-semibold text-ink placeholder:text-black/35 focus:border-black/25 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Добавить задачу"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-cta text-xl font-extrabold text-ink"
        >
          +
        </button>
      </form>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-none whitespace-nowrap rounded-[14px] border-2 px-4 py-1.5 text-[13px] font-bold ${
        active
          ? 'border-ink bg-ink text-white'
          : 'border-black/12 bg-white text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function TaskRow({ task, color }: { task: Task; color: string }) {
  const isDone = task.done === 1
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
      style={{
        background: isDone ? '#f1efe9' : color,
        opacity: isDone ? 0.55 : 1,
      }}
    >
      <button
        onClick={() => void TaskRepository.toggleDone(task.id, !isDone)}
        aria-label={isDone ? 'Снять отметку' : 'Отметить выполненной'}
        className="flex h-5 w-5 flex-none items-center justify-center rounded-full border-[2.5px] border-ink text-[11px] font-bold text-white"
        style={{ background: isDone ? '#1a1a1a' : 'transparent' }}
      >
        {isDone ? '✓' : ''}
      </button>

      <button
        onClick={() => void TaskRepository.toggleDone(task.id, !isDone)}
        className={`flex-1 break-words text-left text-sm font-bold text-ink ${
          isDone ? 'line-through' : ''
        }`}
      >
        {task.title}
      </button>

      <button
        onClick={() => void TaskRepository.remove(task.id)}
        aria-label="Удалить"
        className="flex-none px-1 text-ink/40"
      >
        ✕
      </button>
    </div>
  )
}
