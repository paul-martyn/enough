import { db } from '../../db/database'
import type { NewTask, Priority, Task } from './types'

/**
 * The ONLY place the app talks to storage for tasks. The UI depends on this
 * module, never on Dexie directly. When cloud sync is added later, its logic
 * lives here (write-through to IndexedDB + remote) and the UI stays untouched.
 */
export const TaskRepository = {
  /** All live (non-deleted) tasks, newest first. */
  async list(): Promise<Task[]> {
    const tasks = await db.tasks.filter((t) => t.deletedAt === null).toArray()
    return tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async add(input: NewTask): Promise<Task> {
    const now = new Date().toISOString()
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      done: 0,
      important: 0,
      categoryId: input.categoryId,
      priority: input.priority ?? 'normal',
      dueDate: input.dueDate ?? null,
      notes: input.notes ?? '',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
    await db.tasks.add(task)
    return task
  },

  async update(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<void> {
    await db.tasks.update(id, { ...patch, updatedAt: new Date().toISOString() })
  },

  async toggleDone(id: string, done: boolean): Promise<void> {
    await this.update(id, { done: done ? 1 : 0 })
  },

  async setPriority(id: string, priority: Priority): Promise<void> {
    await this.update(id, { priority })
  },

  async setCategory(id: string, categoryId: string): Promise<void> {
    await this.update(id, { categoryId })
  },

  async toggleImportant(id: string, important: boolean): Promise<void> {
    await this.update(id, { important: important ? 1 : 0 })
  },

  /** Soft delete — kept so a future sync can propagate the removal. */
  async remove(id: string): Promise<void> {
    await this.update(id, { deletedAt: new Date().toISOString() })
  },
}
