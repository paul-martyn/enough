import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TaskRepository } from './TaskRepository'
import { useTasks } from './useTasks'
import TaskRow from './TaskRow'
import { CategoryRepository } from '../categories/CategoryRepository'
import { useCategories } from '../categories/useCategories'
import { DEFAULT_CATEGORY_ID } from '../categories/types'
import type { Category } from '../categories/types'
import { categoryColor } from '../../shared/theme'
import ConfirmDialog from '../../shared/ConfirmDialog'
import { spring, tap } from '../../shared/motion'

type Filter = 'all' | string // 'all' or a categoryId

export default function TasksPage() {
  const tasks = useTasks()
  const categories = useCategories()
  const [filter, setFilter] = useState<Filter>('all')
  const [slideDir, setSlideDir] = useState(0) // -1 left, 1 right (for swipe slide)
  const [quick, setQuick] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [deletingCount, setDeletingCount] = useState(0)

  const loading = !tasks || !categories
  const colorIndexOf = (categoryId: string) =>
    categories?.findIndex((c) => c.id === categoryId) ?? 0

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

  async function openDelete(category: Category) {
    setDeletingCount(await CategoryRepository.liveTaskCount(category.id))
    setDeleting(category)
  }

  async function confirmDelete(mode: 'move' | 'deleteTasks') {
    if (!deleting) return
    await CategoryRepository.remove(deleting.id, mode)
    if (filter === deleting.id) setFilter('all')
    setDeleting(null)
  }

  // Swipe between categories: 'all' → cat1 → cat2 → …
  const order: Filter[] = ['all', ...(categories ?? []).map((c) => c.id)]
  function shiftFilter(step: 1 | -1) {
    const idx = order.indexOf(filter)
    const next = idx + step
    if (next < 0 || next >= order.length) return
    setSlideDir(step)
    setFilter(order[next])
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
    <div className="flex flex-col">
      {/* Sticky glass header: title + category chips. Content slides under it. */}
      <div className="glass sticky top-0 z-10 rounded-none border-x-0 border-t-0">
        <div className="mx-auto w-full max-w-[640px]">
          <div
            className="px-6 pb-3.5"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}
          >
            <div className="text-[28px] font-extrabold text-ink">Задачи</div>
          </div>

          {/* Chips row; the "+" button is pinned at the right edge, chips
              scroll under it and get blurred by its glass. */}
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto px-6 pb-4 pr-[76px]">
              <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
                Все
              </Chip>
              {(categories ?? []).map((c) => (
                <CategoryChip
                  key={c.id}
                  category={c}
                  active={filter === c.id}
                  onSelect={() => setFilter(c.id)}
                  onLongPress={
                    c.id === DEFAULT_CATEGORY_ID ? undefined : () => void openDelete(c)
                  }
                />
              ))}
            </div>

            <motion.button
              whileTap={tap}
              onClick={() => setAddingCategory(true)}
              aria-label="Новая категория"
              className="glass absolute right-4 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-xl text-xl font-extrabold text-ink"
            >
              +
            </motion.button>

            {/* Add-category input slides over the chips row */}
            {addingCategory && (
                <motion.form
                  onSubmit={submitCategory}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0, transition: spring }}
                  className="glass absolute inset-x-0 top-0 z-20 flex items-center gap-2 rounded-none border-x-0 px-6 py-2"
                >
                  <input
                    autoFocus
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Название категории"
                    className="min-w-0 flex-1 rounded-xl border-2 border-black/10 bg-white px-4 py-2 text-[15px] font-bold text-ink focus:outline-none"
                  />
                  <motion.button
                    whileTap={tap}
                    type="submit"
                    className="flex-none rounded-xl bg-ink px-4 py-2 text-[14px] font-bold text-white"
                  >
                    ОК
                  </motion.button>
                  <motion.button
                    whileTap={tap}
                    type="button"
                    onClick={() => setAddingCategory(false)}
                    className="flex-none rounded-xl px-2 py-2 text-[14px] font-bold text-black/50"
                  >
                    ✕
                  </motion.button>
                </motion.form>
              )}
          </div>
        </div>
      </div>

      {/* Swipeable grouped list */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        dragDirectionLock
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) shiftFilter(1)
          else if (info.offset.x > 80) shiftFilter(-1)
        }}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Keyed remount slides the new category in; exit is instant (see App.tsx). */}
        <motion.div
          key={filter}
          initial={{ opacity: 0, x: slideDir * 48 }}
          animate={{ opacity: 1, x: 0, transition: spring }}
          className="mx-auto flex w-full max-w-[640px] flex-col gap-7 px-6 pt-6"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 200px)' }}
        >
          {loading && (
            <div className="py-8 text-center text-black/40">Загрузка…</div>
          )}

          {!loading &&
            groups.map(({ category, tasks: rows }) => (
              <div key={category.id}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[14px] font-bold tracking-wide text-black/45">
                    {category.name.toUpperCase()}
                  </div>
                  {category.id !== DEFAULT_CATEGORY_ID && (
                    <motion.button
                      whileTap={tap}
                      aria-label={`Действия с категорией ${category.name}`}
                      onClick={() => void openDelete(category)}
                      className="px-2 text-[18px] font-bold leading-none text-black/35"
                    >
                      ⋯
                    </motion.button>
                  )}
                </div>
                <div className="flex flex-col gap-2.5">
                  {rows.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: spring }}
                    >
                      <TaskRow
                        task={task}
                        color={categoryColor(colorIndexOf(task.categoryId))}
                      />
                    </motion.div>
                  ))}
                  {rows.length === 0 && (
                    <div className="px-0.5 py-1 text-[14px] font-semibold text-black/35">
                      Пока нет задач
                    </div>
                  )}
                </div>
              </div>
            ))}
        </motion.div>
      </motion.div>

      {/* Floating glass quick-add bar, hovering above the nav bar. */}
      <form
        onSubmit={submitQuick}
        className="pointer-events-none fixed inset-x-0 z-20 flex justify-center px-4"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 88px)' }}
      >
        <div className="glass pointer-events-auto flex w-full max-w-[400px] items-center gap-2 rounded-[22px] p-2 pl-5 shadow-lg shadow-black/10">
          <input
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            placeholder="Новая задача…"
            className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-ink placeholder:text-black/40 focus:outline-none"
          />
          <motion.button
            whileTap={tap}
            type="submit"
            aria-label="Добавить задачу"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-cta text-2xl font-extrabold text-ink"
          >
            +
          </motion.button>
        </div>
      </form>

      {/* Category delete confirmation */}
      <ConfirmDialog
        open={deleting !== null}
        title={`Удалить категорию «${deleting?.name ?? ''}»?`}
        message={
          deletingCount > 0
            ? `В категории ${deletingCount} ${taskWord(deletingCount)}. Что с ними сделать?`
            : 'Категория пуста — задачи не пострадают.'
        }
        actions={
          deletingCount > 0
            ? [
                {
                  label: 'Перенести в Общее',
                  kind: 'primary',
                  onClick: () => void confirmDelete('move'),
                },
                {
                  label: 'Удалить с задачами',
                  kind: 'danger',
                  onClick: () => void confirmDelete('deleteTasks'),
                },
              ]
            : [
                {
                  label: 'Удалить',
                  kind: 'danger',
                  onClick: () => void confirmDelete('move'),
                },
              ]
        }
        onCancel={() => setDeleting(null)}
      />
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
    <motion.button
      whileTap={tap}
      onClick={onClick}
      className={`flex-none whitespace-nowrap rounded-xl border-2 px-4 py-2 text-[14px] font-bold ${
        active ? 'border-ink bg-ink text-white' : 'border-black/12 bg-white/70 text-ink'
      }`}
    >
      {children}
    </motion.button>
  )
}

/** Chip with long-press (500ms) opening the delete dialog. */
function CategoryChip({
  category,
  active,
  onSelect,
  onLongPress,
}: {
  category: Category
  active: boolean
  onSelect: () => void
  onLongPress?: () => void
}) {
  const timer = useRef<number | null>(null)
  const fired = useRef(false)

  function start() {
    if (!onLongPress) return
    fired.current = false
    timer.current = window.setTimeout(() => {
      fired.current = true
      onLongPress()
    }, 500)
  }
  function cancel() {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
  }

  return (
    <motion.button
      whileTap={tap}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerMove={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => {
        if (!fired.current) onSelect()
      }}
      className={`flex-none whitespace-nowrap rounded-xl border-2 px-4 py-2 text-[14px] font-bold ${
        active ? 'border-ink bg-ink text-white' : 'border-black/12 bg-white/70 text-ink'
      }`}
      style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
    >
      {category.name}
    </motion.button>
  )
}
