import { motion } from 'framer-motion'
import { softSpring, tap } from './motion'

export interface DialogAction {
  label: string
  /** 'danger' renders red, 'primary' dark, default is neutral. */
  kind?: 'danger' | 'primary'
  onClick: () => void
}

/**
 * Centered confirmation card (deliberately not a bottom sheet).
 * Renders nothing when `open` is false; overlay click cancels.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  actions,
  onCancel,
}: {
  open: boolean
  title: string
  message?: string
  actions: DialogAction[]
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <>
      {
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-[340px] rounded-2xl bg-white p-5 shadow-xl shadow-black/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: softSpring }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[17px] font-extrabold text-ink">{title}</div>
            {message && (
              <div className="mt-1.5 text-[14px] font-medium leading-snug text-black/55">
                {message}
              </div>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {actions.map((a) => (
                <motion.button
                  key={a.label}
                  whileTap={tap}
                  onClick={a.onClick}
                  className={`rounded-xl px-4 py-3 text-[15px] font-bold ${
                    a.kind === 'danger'
                      ? 'bg-[#ff4d4d] text-white'
                      : a.kind === 'primary'
                        ? 'bg-ink text-white'
                        : 'bg-black/5 text-ink'
                  }`}
                >
                  {a.label}
                </motion.button>
              ))}
              <motion.button
                whileTap={tap}
                onClick={onCancel}
                className="rounded-xl px-4 py-3 text-[15px] font-bold text-black/50"
              >
                Отмена
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      }
    </>
  )
}
