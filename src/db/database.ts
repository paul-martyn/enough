import Dexie, { type EntityTable } from 'dexie'
import type { Task } from '../features/tasks/types'

/**
 * Central Dexie database. Every feature adds its own table here.
 *
 * Design choices that keep future cloud sync cheap:
 *  - Primary keys are client-generated UUIDs (never auto-increment), so records
 *    created on different devices never collide when merged.
 *  - Every record carries createdAt / updatedAt / deletedAt (ISO strings).
 *    Deletes are "soft" (set deletedAt) so a sync can propagate them.
 */
export const db = new Dexie('enough') as Dexie & {
  tasks: EntityTable<Task, 'id'>
}

db.version(1).stores({
  // Only indexed fields are listed here, not every column.
  tasks: 'id, done, priority, dueDate, updatedAt, deletedAt',
})
