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
import { Button, Chip, Dialog, EmptyState, Eyebrow, QuickAddBar, TextInput } from '../../shared/ui'
import { spring, tap } from '../../shared/motion'

type Filter = 'all' | string // 'all' or a categoryId

export default function TasksPage() {
  const tasks = useTasks()
  const categories = useCategories()
  const [filter, setFilter] = useState<Filter>('all')
  const [slideDir, setSlideDir] = useState(0) // -1 left, 1 right (for swipe slide)
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [deletingCount, setDeletingCount] = useState(0)

  const loading = !tasks || !categories
  const colorIndexOf = (categoryId: string) =>
    categories?.findIndex((c) => c.id === categoryId) ?? 0

  const targetCategory = filter === 'all' ? DEFAULT_CATEGORY_ID : filter
  const activeCategoryName =
    filter === 'all' ? null : (categories ?? []).find((c) => c.id === filter)?.name

  async function submitQuick(title: string) {
    await TaskRepository.add({ title, categoryId: targetCategory })
  }

  async function submitCategory(e: React.FormEvent) {
    e.preventDefault()
    const name = newCategory.trim()
    if (!name) return
    await CategoryRepository.add(name)
    setNewCategory('')
    setAddingCategory(false)
  }

  function closeCategory() {
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

  // Swipe/tap between categories: 'all' → cat1 → cat2 → …
  const order: Filter[] = ['all', ...(categories ?? []).map((c) => c.id)]
  // Single entry point for changing category: sets the slide direction from the
  // index delta so both swipes and chip taps animate consistently.
  function goToFilter(next: Filter) {
    if (next === filter) return
    const from = order.indexOf(filter)
    const to = order.indexOf(next)
    setSlideDir(to > from ? 1 : -1)
    setFilter(next)
  }
  function shiftFilter(step: 1 | -1) {
    const idx = order.indexOf(filter)
    const next = idx + step
    if (next < 0 || next >= order.length) return
    goToFilter(order[next])
  }

  const visibleCats = (categories ?? []).filter(
    (c) => filter === 'all' || c.id === filter,
  )

  const groups = visibleCats.map((c) => {
    const catTasks = (tasks ?? []).filter((t) => t.categoryId === c.id)
    const undone = catTasks.filter((t) => t.done === 0)
    const done = catTasks.filter((t) => t.done === 1)
    return { category: c, tasks: [...undone, ...done], undoneCount: undone.length }
  })

  return (
    <div className="flex flex-col">
      {/* Sticky solid header: title + category chips over the page background. */}
      <div
        className="sticky top-0 z-10 border-b border-hairline"
        style={{ background: 'var(--app-bg)' }}
      >
        <div className="mx-auto w-full max-w-[640px]">
          <div
            className="px-5 pb-2"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
          >
            <h1 className="t-display text-ink">Задачи</h1>
          </div>

          {/* Chips row; «Новая» lives inline at the end — no overlays. */}
          <div className="flex gap-2 overflow-x-auto px-5 pb-3">
            <Chip active={filter === 'all'} onClick={() => goToFilter('all')}>
              Все
            </Chip>
            {(categories ?? []).map((c, i) => (
              <CategoryChip
                key={c.id}
                category={c}
                dot={categoryColor(i)}
                active={filter === c.id}
                onSelect={() => goToFilter(c.id)}
                onLongPress={
                  c.id === DEFAULT_CATEGORY_ID ? undefined : () => void openDelete(c)
                }
              />
            ))}
            <Chip onClick={() => setAddingCategory(true)} aria-label="Новая категория">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M7 2v10 M2 7h10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Новая
            </Chip>
          </div>
        </div>
      </div>

      {/* Swipeable grouped list */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
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
          className="mx-auto flex w-full max-w-[640px] flex-col gap-8 px-5 pt-6"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 200px)' }}
        >
          {loading && (
            <div className="py-8 text-center t-body text-muted">Загрузка…</div>
          )}

          {!loading &&
            groups.map(({ category, tasks: rows, undoneCount }) => (
              <section key={category.id}>
                <Eyebrow
                  right={
                    <div className="flex items-center gap-1">
                      <span className="t-caption tnum text-faint">
                        {undoneCount > 0 ? undoneCount : ''}
                      </span>
                      {category.id !== DEFAULT_CATEGORY_ID && (
                        <motion.button
                          whileTap={tap}
                          aria-label={`Действия с категорией ${category.name}`}
                          onClick={() => void openDelete(category)}
                          className="-my-2 flex h-11 w-11 items-center justify-center rounded-ctl text-muted"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M6 12h.01M12 12h.01M18 12h.01"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </motion.button>
                      )}
                    </div>
                  }
                >
                  {category.name}
                </Eyebrow>
                <div className="flex flex-col gap-2">
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
                    <EmptyState>Пока пусто — добавьте задачу в строке ниже.</EmptyState>
                  )}
                </div>
              </section>
            ))}
        </motion.div>
      </motion.div>

      {/* Floating frost quick-add bar, hovering above the nav bar. */}
      <div
        className="pointer-events-none fixed inset-x-0 z-20 flex justify-center px-4"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)' }}
      >
        <QuickAddBar
          placeholder={
            activeCategoryName ? `В «${activeCategoryName}»…` : 'Новая задача…'
          }
          onSubmit={(title) => void submitQuick(title)}
          className="quick-add-enter frost pointer-events-auto w-full max-w-[400px]"
        />
      </div>

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

      {/* Compact centered "new category" dialog */}
      <Dialog open={addingCategory} title="Новая категория" onClose={closeCategory}>
        <form onSubmit={submitCategory}>
          <TextInput
            autoFocus
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Название категории"
            className="mt-4"
          />
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="primary" type="submit">
              Добавить
            </Button>
            <Button variant="ghost" type="button" onClick={closeCategory}>
              Отмена
            </Button>
          </div>
        </form>
      </Dialog>
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

/** Chip with long-press (500ms) opening the delete dialog. */
function CategoryChip({
  category,
  dot,
  active,
  onSelect,
  onLongPress,
}: {
  category: Category
  dot: string
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
    <Chip
      active={active}
      dot={dot}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerMove={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => {
        if (!fired.current) onSelect()
      }}
      style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
    >
      {category.name}
    </Chip>
  )
}
