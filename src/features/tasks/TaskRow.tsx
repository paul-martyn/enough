import { useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { TaskRepository } from './TaskRepository'
import { spring, tap } from '../../shared/motion'
import type { Task } from './types'

const REVEAL = -88 // px the row parks at to expose the delete zone
const COMMIT = -64 // drag distance that snaps open

/**
 * A single task card: checkbox — title — star. Swipe left to reveal delete
 * (long swipe deletes immediately). The row captures pointer events so a
 * horizontal drag here never triggers the category swiper behind it.
 */
export default function TaskRow({ task, color }: { task: Task; color: string }) {
  const isDone = task.done === 1
  const isImportant = task.important === 1
  const controls = useAnimation()
  const [open, setOpen] = useState(false)
  const width = useRef(0)

  function onDragEnd(_: unknown, info: { offset: { x: number } }) {
    const x = info.offset.x
    if (x < -width.current * 0.6) {
      // long swipe — delete right away (AnimatePresence collapses the row)
      void TaskRepository.remove(task.id)
      return
    }
    if (x < COMMIT) {
      setOpen(true)
      void controls.start({ x: REVEAL, transition: spring })
    } else {
      setOpen(false)
      void controls.start({ x: 0, transition: spring })
    }
  }

  function closeReveal() {
    if (!open) return
    setOpen(false)
    void controls.start({ x: 0, transition: spring })
  }

  return (
    <div
      className="relative"
      ref={(el) => {
        if (el) width.current = el.offsetWidth
      }}
      // Row owns horizontal gestures — don't let the category swiper see them.
      onPointerDownCapture={(e) => e.stopPropagation()}
    >
      {/* Delete zone under the card */}
      <div className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center rounded-2xl bg-[#ff4d4d]">
        <motion.button
          whileTap={tap}
          aria-label="Удалить"
          onClick={() => void TaskRepository.remove(task.id)}
          className="flex h-11 w-11 items-center justify-center text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
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

      {/* The card itself */}
      <motion.div
        drag="x"
        dragConstraints={{ left: REVEAL, right: 0 }}
        dragElastic={0.15}
        dragMomentum={false}
        animate={controls}
        onDragEnd={onDragEnd}
        onClick={closeReveal}
        className="relative flex items-center gap-3 rounded-2xl px-4 py-4"
        style={{
          background: isDone ? '#f1efe9' : color,
          opacity: isDone ? 0.55 : 1,
          touchAction: 'pan-y',
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
            if (open) return // first tap just closes the reveal
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
              fill={isImportant ? '#ffd23f' : 'none'}
              stroke={isImportant ? '#e0a800' : 'rgba(26,26,26,.45)'}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  )
}
