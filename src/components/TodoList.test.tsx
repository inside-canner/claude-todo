import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from './TodoList'
import type { Todo } from '../types/todo'

const makeTodo = (id: string, text: string, completed = false): Todo => ({
  id,
  text,
  completed,
  priority: 'medium',
  createdAt: new Date().toISOString(),
})

describe('TodoList', () => {
  it('タスクが空のとき「タスクがありません」を表示する', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)

    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('タスクがあるときは空状態メッセージを表示しない', () => {
    const todos = [makeTodo('1', 'タスクA')]
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)

    expect(screen.queryByText('タスクがありません')).not.toBeInTheDocument()
  })

  it('受け取ったタスクをすべて描画する', () => {
    const todos = [
      makeTodo('1', 'タスクA'),
      makeTodo('2', 'タスクB'),
      makeTodo('3', 'タスクC'),
    ]
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)

    expect(screen.getByText('タスクA')).toBeInTheDocument()
    expect(screen.getByText('タスクB')).toBeInTheDocument()
    expect(screen.getByText('タスクC')).toBeInTheDocument()
  })

  it('タスク数と同じ数の削除ボタンが表示される', () => {
    const todos = [makeTodo('1', 'タスクA'), makeTodo('2', 'タスクB')]
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)

    expect(screen.getAllByRole('button', { name: '削除' })).toHaveLength(2)
  })
})
