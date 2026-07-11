import { useLiveQuery } from 'dexie-react-hooks'
import { TaskRepository } from './TaskRepository'

/**
 * Reactive list of live tasks. Re-renders automatically whenever the tasks
 * table changes (add / toggle / delete), from any part of the app.
 */
export function useTasks() {
  return useLiveQuery(() => TaskRepository.list(), [], undefined)
}
