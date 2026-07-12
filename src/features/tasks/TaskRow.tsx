import { useState } from 'react'
import { motion } from 'framer-motion'
import { TaskRepository } from './TaskRepository'
import { spring, tap } from '../../shared/motion'
import ConfirmDialog from '../../shared/ConfirmDialog'
import type { Task } from './types'

/**
 * A single task card: checkbox — title — star — delete. Deleting is an explicit
 * button + confirmation (no swipe), so the card no longer captures horizontal
 * gestures and the category swiper behind it works even over a task.
 */
export default function TaskRow({ task, color }: { task: Task; color: string }) {
  const isDone = task.done === 1
  const isImportant = task.important === 1
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="relative">
      {/* The card itself */}
      <div
        className="relative flex items-center gap-3 rounded-2xl px-4 py-4"
        style={{
          background: isDone ? '#f1efe9' : color,
          opacity: isDone ? 0.55 : 1,
        }}
      >
        <motion.button
          whileTap={{ scale: 1.3 }}
          transition={spring}
          onClick={(e) => {
            e.stopPropagation()
            void TaskRepository.toggleDone(task.id, !isDone)
          }}
          aria-label={isDone ? 'Снять отметку' : 'Отметить выполненной'}
          className="flex h-6 w-6 flex-none items-center justify-center rounded-full border-[2.5px] border-ink text-[13px] font-bold text-white"
          style={{ background: isDone ? '#1a1a1a' : 'transparent' }}
        >
          {isDone ? '✓' : ''}
        </motion.button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            void TaskRepository.toggleDone(task.id, !isDone)
          }}
          className={`min-w-0 flex-1 break-words text-left text-[16px] font-bold text-ink ${
            isDone ? 'line-through' : ''
          }`}
        >
          {task.title}
        </button>

        <motion.button
          whileTap={{ scale: 1.35, rotate: 8 }}
          transition={spring}
          onClick={(e) => {
            e.stopPropagation()
            void TaskRepository.toggleImportant(task.id, !isImportant)
          }}
          aria-label={isImportant ? 'Убрать из важного' : 'Пометить важной'}
          className="flex h-9 w-9 flex-none items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"
              fill={isImportant ? '#1a1a1a' : 'none'}
              stroke={isImportant ? '#1a1a1a' : 'rgba(26,26,26,.45)'}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        <motion.button
          whileTap={tap}
          onClick={(e) => {
            e.stopPropagation()
            setConfirming(true)
          }}
          aria-label="Удалить"
          className="flex h-9 w-9 flex-none items-center justify-center text-black/35"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 7h14 M9 7V5h6v2 M7 7l1 13h8l1-13 M10 11v5 M14 11v5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Удалить задачу?"
        message={task.title}
        actions={[
          {
            label: 'Удалить',
            kind: 'danger',
            onClick: () => {
              void TaskRepository.remove(task.id)
              setConfirming(false)
            },
          },
        ]}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
