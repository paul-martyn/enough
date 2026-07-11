import { useState } from 'react'
import { TaskRepository } from '../tasks/TaskRepository'
import { useTasks } from '../tasks/useTasks'
import { useCategories } from '../categories/useCategories'
import { DEFAULT_CATEGORY_ID } from '../categories/types'
import { categoryColor } from '../../shared/theme'
import { USER_NAME } from '../../shared/config'

export default function HomePage() {
  const tasks = useTasks()
  const categories = useCategories()
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
  const upcoming = (tasks ?? []).filter((t) => t.done === 0).slice(0, 3)

  return (
    <div
      className="flex flex-1 flex-col gap-[22px] overflow-y-auto px-6 pb-6"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 28px)' }}
    >
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[26px] font-extrabold leading-tight text-ink">
            Привет, {USER_NAME}
          </div>
          <div className="mt-1 text-sm font-medium text-black/45">{todayLabel}</div>
        </div>
        <div className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-[#ffd23f] text-xl font-extrabold text-ink">
          {USER_NAME.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Quick add */}
      <form
        onSubmit={submitQuick}
        className="flex items-center gap-3 rounded-3xl bg-ink px-5 py-[18px]"
      >
        <input
          value={quick}
          onChange={(e) => setQuick(e.target.value)}
          placeholder="Быстро добавить задачу…"
          className="min-w-0 flex-1 border-none bg-transparent text-[15px] font-semibold text-white placeholder:text-white/50 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Добавить"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-cta text-xl font-extrabold text-ink"
        >
          +
        </button>
      </form>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-[20px] bg-[#8ee6b0] p-4">
          <div className="text-[28px] font-bold text-ink">
            {loading ? '—' : `${doneToday}/${total}`}
          </div>
          <div className="mt-0.5 text-xs font-semibold text-black/60">
            Сегодня выполнено
          </div>
        </div>
        <div className="flex-1 rounded-[20px] bg-[#b7c9ff] p-4">
          <div className="text-[28px] font-bold text-ink">
            {loading ? '—' : categories.length}
          </div>
          <div className="mt-0.5 text-xs font-semibold text-black/60">Категории</div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="mt-1 text-[15px] font-bold text-ink">Ближайшее</div>
      <div className="flex flex-col gap-2.5">
        {upcoming.map((t) => (
          <button
            key={t.id}
            onClick={() => void TaskRepository.toggleDone(t.id, true)}
            className="flex items-center gap-3 rounded-[18px] px-4 py-3.5 text-left"
            style={{ background: colorOf(t.categoryId) }}
          >
            <span className="h-[22px] w-[22px] flex-none rounded-full border-[2.5px] border-ink bg-white" />
            <span className="text-sm font-bold text-ink">{t.title}</span>
          </button>
        ))}
        {!loading && upcoming.length === 0 && (
          <div className="px-0.5 py-1.5 text-[13px] font-semibold text-black/40">
            Все задачи выполнены 🎉
          </div>
        )}
      </div>
    </div>
  )
}
