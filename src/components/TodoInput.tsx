import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Priority } from '../types/todo'

interface Props {
  onAdd: (text: string, priority: Priority) => void
}

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAdd(text, priority)
    setText('')
  }

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="新しいタスクを追加..."
        className="todo-input__text"
        autoFocus
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value as Priority)}
        className="todo-input__priority"
        aria-label="優先度"
      >
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <button type="submit" className="todo-input__button" disabled={!text.trim()}>
        追加
      </button>
    </form>
  )
}
