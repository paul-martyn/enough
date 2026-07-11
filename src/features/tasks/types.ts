export type Priority = 'low' | 'normal' | 'high'

export interface Task {
  /** Client-generated UUID. */
  id: string
  title: string
  done: 0 | 1 // stored as number so Dexie can index it
  priority: Priority
  /** ISO date (yyyy-mm-dd) or null. */
  dueDate: string | null
  notes: string
  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
  /** ISO datetime when soft-deleted, or null if live. */
  deletedAt: string | null
}

/** Fields the UI provides when creating a task; the rest are filled by the repository. */
export interface NewTask {
  title: string
  priority?: Priority
  dueDate?: string | null
  notes?: string
}
