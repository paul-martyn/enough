import { db } from '../../db/database'
import type { Category } from './types'
import { DEFAULT_CATEGORY_ID, SEED_CATEGORIES } from './types'

/** The only place the app reads/writes categories. */
export const CategoryRepository = {
  /** Live categories, ordered. */
  async list(): Promise<Category[]> {
    const cats = await db.categories.filter((c) => c.deletedAt === null).toArray()
    return cats.sort((a, b) => a.order - b.order)
  },

  /** Create the default categories on first run (idempotent). */
  async ensureSeed(): Promise<void> {
    const count = await db.categories.count()
    if (count > 0) return
    const now = new Date().toISOString()
    await db.categories.bulkAdd(
      SEED_CATEGORIES.map((c) => ({
        ...c,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      })),
    )
  },

  async add(name: string): Promise<Category> {
    const trimmed = name.trim()
    const existing = await this.list()
    const now = new Date().toISOString()
    const category: Category = {
      id: crypto.randomUUID(),
      name: trimmed,
      order: existing.length,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
    await db.categories.add(category)
    return category
  },

  /** Live (non-deleted) tasks that belong to a category. */
  async liveTaskCount(categoryId: string): Promise<number> {
    return db.tasks
      .where('categoryId')
      .equals(categoryId)
      .filter((t) => t.deletedAt === null)
      .count()
  },

  /**
   * Soft-delete a category. Its live tasks either move to the default
   * category or get soft-deleted along with it. The default category
   * itself can never be removed.
   */
  async remove(id: string, mode: 'move' | 'deleteTasks'): Promise<void> {
    if (id === DEFAULT_CATEGORY_ID) return
    const now = new Date().toISOString()
    await db.transaction('rw', db.categories, db.tasks, async () => {
      await db.categories.update(id, { deletedAt: now, updatedAt: now })
      const live = db.tasks
        .where('categoryId')
        .equals(id)
        .filter((t) => t.deletedAt === null)
      if (mode === 'move') {
        await live.modify({ categoryId: DEFAULT_CATEGORY_ID, updatedAt: now })
      } else {
        await live.modify({ deletedAt: now, updatedAt: now })
      }
    })
  },
}
