import { useTodos } from '../hooks/useTodos'
import { TodoInput } from './TodoInput'
import { TodoFilter } from './TodoFilter'
import { TodoList } from './TodoList'

export function TodoApp() {
  const {
    todos,
    allTodosCount,
    activeCount,
    completedCount,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
  } = useTodos()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Claude Todo</h1>
        <p className="app-subtitle">タスクを管理しよう</p>
      </header>
      <main className="app-main">
        <TodoInput onAdd={addTodo} />
        {allTodosCount > 0 && (
          <TodoFilter
            filter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            allCount={allTodosCount}
            onClearCompleted={clearCompleted}
          />
        )}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </main>
    </div>
  )
}
