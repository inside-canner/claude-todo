import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from './TodoItem'
import type { Todo } from '../types/todo'

const baseTodo: Todo = {
  id: 'test-id-1',
  text: 'テストタスク',
  completed: false,
  priority: 'medium',
  createdAt: new Date().toISOString(),
}

const renderItem = (overrides: Partial<Todo> = {}, handlers = {}) => {
  const props = {
    todo: { ...baseTodo, ...overrides },
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    ...handlers,
  }
  return { ...render(<TodoItem {...props} />), props }
}

describe('TodoItem', () => {
  // ── 表示 ────────────────────────────────────────────────────────────

  it('タスクのテキストが表示される', () => {
    renderItem()
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('未完了タスクは completed クラスを持たない', () => {
    const { container } = renderItem()
    expect(container.firstChild).not.toHaveClass('completed')
  })

  it('完了済みタスクは completed クラスを持つ', () => {
    const { container } = renderItem({ completed: true })
    expect(container.firstChild).toHaveClass('completed')
  })

  it('priority-medium クラスが中優先度で付く', () => {
    const { container } = renderItem({ priority: 'medium' })
    expect(container.querySelector('.priority-medium')).toBeInTheDocument()
  })

  it('priority-high クラスが高優先度で付く', () => {
    const { container } = renderItem({ priority: 'high' })
    expect(container.querySelector('.priority-high')).toBeInTheDocument()
  })

  it('priority-low クラスが低優先度で付く', () => {
    const { container } = renderItem({ priority: 'low' })
    expect(container.querySelector('.priority-low')).toBeInTheDocument()
  })

  it('未完了タスクのチェックボックスは「完了にする」ラベルを持つ', () => {
    renderItem()
    expect(screen.getByRole('button', { name: '完了にする' })).toBeInTheDocument()
  })

  it('完了済みタスクのチェックボックスは「未完了にする」ラベルを持つ', () => {
    renderItem({ completed: true })
    expect(screen.getByRole('button', { name: '未完了にする' })).toBeInTheDocument()
  })

  // ── インタラクション ─────────────────────────────────────────────────

  it('チェックボックスをクリックすると onToggle がタスクIDで呼ばれる', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    renderItem({}, { onToggle })

    await user.click(screen.getByRole('button', { name: '完了にする' }))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('test-id-1')
  })

  it('削除ボタンをクリックすると onDelete がタスクIDで呼ばれる', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    renderItem({}, { onDelete })

    await user.click(screen.getByRole('button', { name: '削除' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith('test-id-1')
  })

  // ── インライン編集 ───────────────────────────────────────────────────

  it('未完了タスクのテキストをダブルクリックすると編集モードに入る', async () => {
    const user = userEvent.setup()
    renderItem()

    await user.dblClick(screen.getByText('テストタスク'))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByText('テストタスク')).not.toBeInTheDocument()
  })

  it('完了済みタスクはダブルクリックしても編集モードに入らない', async () => {
    const user = userEvent.setup()
    renderItem({ completed: true })

    await user.dblClick(screen.getByText('テストタスク'))

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('編集モードで Enter を押すと onEdit が新しいテキストで呼ばれる', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    renderItem({}, { onEdit })

    await user.dblClick(screen.getByText('テストタスク'))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '更新後のタスク{Enter}')

    expect(onEdit).toHaveBeenCalledWith('test-id-1', '更新後のタスク')
  })

  it('編集モードで Escape を押すと変更がキャンセルされ onEdit は呼ばれない', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    renderItem({}, { onEdit })

    await user.dblClick(screen.getByText('テストタスク'))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '途中で止める{Escape}')

    expect(onEdit).not.toHaveBeenCalled()
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('編集モードで入力欄がフォーカスを失うと onEdit が呼ばれる', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    renderItem({}, { onEdit })

    await user.dblClick(screen.getByText('テストタスク'))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'ブラーで確定')
    await user.tab() // フォーカスを外す

    expect(onEdit).toHaveBeenCalledWith('test-id-1', 'ブラーで確定')
  })
})
