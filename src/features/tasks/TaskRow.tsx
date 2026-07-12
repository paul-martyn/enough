import { useState } from 'react'
import { motion } from 'framer-motion'
import { TaskRepository } from './TaskRepository'
import { spring, tap } from '../../shared/motion'
import ConfirmDialog from '../../shared/ConfirmDialog'
import type { Task } from './types'

/**
 * A single task card: checkbox — title — star — delete. The category shows as
 * a 3px rail on the left edge; the card itself stays a calm white surface.
 * Every control is a ≥44px touch target. No horizontal gestures — the
 * category swiper behind the list owns those.
 */
export default function TaskRow({ task, color }: { task: Task; color: string }) {
  const isDone = task.done === 1
  const isImportant = task.important === 1
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="relative">
      <div className="relative flex items-center gap-1 overflow-hidden rounded-card border border-hairline bg-surface py-1.5 pl-3 pr-1 shadow-e1">
        {/* Category rail */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ background: color, opacity: isDone ? 0.35 : 1 }}
        />

        {/* Checkbox: 24px visible box in a 44px target */}
        <motion.button
          whileTap={{ scale: 1.15 }}
          transition={spring}
          onClick={(e) => {
            e.stopPropagation()
            void TaskRepository.toggleDone(task.id, !isDone)
          }}
          aria-label={isDone ? 'Снять отметку' : 'Отметить выполненной'}
          className="flex h-11 w-11 flex-none items-center justify-center"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-[8px] border-2 ${
              isDone ? 'border-accent bg-accent' : 'border-ink/25 bg-transparent'
            }`}
          >
            {isDone && (
              <motion.svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                aria-hidden="true"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: spring }}
              >
                <path
                  d="M2.5 7.5l3 3 6-7"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </span>
        </motion.button>

        {/* Title — tapping it also toggles done (the biggest target) */}
        <button
          onClick={() => void TaskRepository.toggleDone(task.id, !isDone)}
          className={`min-h-11 min-w-0 flex-1 break-words py-2 text-left t-strong ${
            isDone ? 'text-muted line-through decoration-[1.5px]' : 'text-ink'
          }`}
        >
          {task.title}
        </button>

        {/* Star */}
        <motion.button
          whileTap={{ scale: 1.2, rotate: 8 }}
          transition={spring}
          onClick={(e) => {
            e.stopPropagation()
            void TaskRepository.toggleImportant(task.id, !isImportant)
          }}
          aria-label={isImportant ? 'Убрать из важного' : 'Пометить важной'}
          className="flex h-11 w-11 flex-none items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"
              fill={isImportant ? '#2f6d4f' : 'none'}
              stroke={isImportant ? '#2f6d4f' : '#a39b8f'}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        {/* Delete */}
        <motion.button
          whileTap={tap}
          onClick={(e) => {
            e.stopPropagation()
            setConfirming(true)
          }}
          aria-label="Удалить"
          className="flex h-11 w-11 flex-none items-center justify-center text-faint"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
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
