import { useLiveQuery } from 'dexie-react-hooks'
import { CategoryRepository } from './CategoryRepository'

/** Reactive list of live categories, ordered. */
export function useCategories() {
  return useLiveQuery(() => CategoryRepository.list(), [], undefined)
}
