export interface Category {
  /** Stable id. Seed categories use fixed ids so migrations can reference them. */
  id: string
  name: string
  /** Sort order among categories (lower first). */
  order: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

/** Fixed id of the default category existing tasks are migrated into. */
export const DEFAULT_CATEGORY_ID = 'general'

/** Seeded on first run. Fixed ids keep migration and seeding in sync. */
export const SEED_CATEGORIES: ReadonlyArray<Pick<Category, 'id' | 'name' | 'order'>> = [
  { id: DEFAULT_CATEGORY_ID, name: 'Общее', order: 0 },
  { id: 'personal', name: 'Личное', order: 1 },
  { id: 'work', name: 'Работа', order: 2 },
]
