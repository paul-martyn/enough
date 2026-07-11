import { useState } from 'react'
import { TaskRepository } from './TaskRepository'
import { useTasks } from './useTasks'
import type { Priority, Task } from './types'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, normal: 1, low: 2 }

const PRIORITY_STYLE: Record<Priority, string> = {
  high: 'bg-red-500/15 text-red-300 border-red-500/30',
  normal: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
}

export default function TasksPage() {
  const tasks = useTasks()
  const [title, setTitle] = useState('')

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    await TaskRepository.add({ title: value })
    setTitle('')
  }

  // Loading state while the first liveQuery resolves.
  if (!tasks) {
    return <p className="p-4 text-slate-400">Загрузка…</p>
  }

  const open = tasks
    .filter((t) => t.done === 0)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  const done = tasks.filter((t) => t.done === 1)

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <form onSubmit={addTask} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая задача…"
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-base outline-none placeholder:text-slate-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white active:bg-indigo-700"
        >
          +
        </button>
      </form>

      {open.length === 0 && done.length === 0 && (
        <p className="py-10 text-center text-slate-500">
          Задач пока нет. Добавь первую 👆
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {open.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>

      {done.length > 0 && (
        <>
          <p className="mt-2 text-sm text-slate-500">Выполнено ({done.length})</p>
          <ul className="flex flex-col gap-2 opacity-60">
            {done.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function TaskRow({ task }: { task: Task }) {
  const isDone = task.done === 1

  function cyclePriority() {
    const next: Record<Priority, Priority> = {
      low: 'normal',
      normal: 'high',
      high: 'low',
    }
    void TaskRepository.setPriority(task.id, next[task.priority])
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/40 px-3 py-3">
      <button
        onClick={() => void TaskRepository.toggleDone(task.id, !isDone)}
        aria-label={isDone ? 'Снять отметку' : 'Отметить выполненной'}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          isDone
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-500'
        }`}
      >
        {isDone ? '✓' : ''}
      </button>

      <span
        className={`flex-1 break-words ${isDone ? 'text-slate-500 line-through' : ''}`}
      >
        {task.title}
      </span>

      <button
        onClick={cyclePriority}
        className={`shrink-0 rounded-md border px-2 py-0.5 text-xs ${PRIORITY_STYLE[task.priority]}`}
      >
        {task.priority}
      </button>

      <button
        onClick={() => void TaskRepository.remove(task.id)}
        aria-label="Удалить"
        className="shrink-0 px-1 text-slate-500 active:text-red-400"
      >
        ✕
      </button>
    </li>
  )
}
