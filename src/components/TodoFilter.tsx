import type { FilterType } from '../types/todo'

const LABELS: Record<FilterType, string> = {
  all: 'すべて',
  active: '未完了',
  completed: '完了',
}

interface Props {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  activeCount: number
  completedCount: number
  allCount: number
  onClearCompleted: () => void
}

export function TodoFilter({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  allCount,
  onClearCompleted,
}: Props) {
  const counts: Record<FilterType, number> = {
    all: allCount,
    active: activeCount,
    completed: completedCount,
  }

  return (
    <div className="todo-filter">
      <div className="todo-filter__tabs">
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            className={`todo-filter__tab${filter === f ? ' active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {LABELS[f]} ({counts[f]})
          </button>
        ))}
      </div>
      {completedCount > 0 && (
        <button className="todo-filter__clear" onClick={onClearCompleted}>
          完了済みを削除
        </button>
      )}
    </div>
  )
}
