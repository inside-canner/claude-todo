import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types/todo'

const PRIORITY_LABEL: Record<Todo['priority'], string> = {
  high: '高',
  medium: '中',
  low: '低',
}

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commitEdit = () => {
    onEdit(todo.id, editText)
    setEditing(false)
  }

  const cancelEdit = () => {
    setEditText(todo.text)
    setEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  return (
    <div className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <button
        className="todo-item__checkbox"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了にする' : '完了にする'}
      >
        {todo.completed && '✓'}
      </button>

      <span
        className={`todo-item__priority priority-${todo.priority}`}
        title={`優先度: ${PRIORITY_LABEL[todo.priority]}`}
      />

      {editing ? (
        <input
          ref={inputRef}
          className="todo-item__edit"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="todo-item__text"
          onDoubleClick={() => !todo.completed && setEditing(true)}
          title={todo.completed ? undefined : 'ダブルクリックで編集'}
        >
          {todo.text}
        </span>
      )}

      <button
        className="todo-item__delete"
        onClick={() => onDelete(todo.id)}
        aria-label="削除"
      >
        ×
      </button>
    </div>
  )
}
