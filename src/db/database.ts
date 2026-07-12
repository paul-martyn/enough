import Dexie, { type EntityTable } from 'dexie'
import type { Task } from '../features/tasks/types'
import type { Category } from '../features/categories/types'
import { DEFAULT_CATEGORY_ID } from '../features/categories/types'

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
  categories: EntityTable<Category, 'id'>
}

// v1: tasks only.
db.version(1).stores({
  tasks: 'id, done, priority, dueDate, updatedAt, deletedAt',
})

// v2: introduce categories; every task gains a categoryId.
db.version(2)
  .stores({
    tasks: 'id, done, categoryId, priority, dueDate, updatedAt, deletedAt',
    categories: 'id, order, updatedAt, deletedAt',
  })
  .upgrade(async (tx) => {
    // Assign any pre-existing task to the default category.
    await tx
      .table<Task>('tasks')
      .toCollection()
      .modify((task) => {
        if (!task.categoryId) task.categoryId = DEFAULT_CATEGORY_ID
      })
  })

// v3: tasks gain an "important" flag (starred; shown on the Home screen).
db.version(3)
  .stores({
    tasks: 'id, done, important, categoryId, priority, dueDate, updatedAt, deletedAt',
    categories: 'id, order, updatedAt, deletedAt',
  })
  .upgrade(async (tx) => {
    await tx
      .table<Task>('tasks')
      .toCollection()
      .modify((task) => {
        if (task.important !== 0 && task.important !== 1) task.important = 0
      })
  })
