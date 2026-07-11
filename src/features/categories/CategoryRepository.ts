import { db } from '../../db/database'
import type { Category } from './types'
import { SEED_CATEGORIES } from './types'

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
}
