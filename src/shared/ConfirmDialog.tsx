import { Button, Dialog } from './ui'

export interface DialogAction {
  label: string
  /** 'danger' renders red, 'primary' dark, default is neutral. */
  kind?: 'danger' | 'primary'
  onClick: () => void
}

/**
 * Confirmation dialog built on the Dialog primitive. Actions stack
 * vertically; «Отмена» is always appended. Overlay click cancels.
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
  return (
    <Dialog open={open} title={title} onClose={onCancel}>
      {message && (
        <div className="mt-1.5 t-body font-medium leading-snug text-muted">
          {message}
        </div>
      )}
      <div className="mt-5 flex flex-col gap-2">
        {actions.map((a) => (
          <Button
            key={a.label}
            variant={a.kind === 'danger' ? 'danger' : a.kind === 'primary' ? 'primary' : 'ghost'}
            onClick={a.onClick}
          >
            {a.label}
          </Button>
        ))}
        <Button variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </Dialog>
  )
}
