import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from './TodoApp'

describe('TodoApp (統合テスト)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('ヘッダーとタイトルが表示される', () => {
    render(<TodoApp />)
    expect(screen.getByText('Claude Todo')).toBeInTheDocument()
  })

  it('初期状態で空状態メッセージが表示される', () => {
    render(<TodoApp />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('初期状態でフィルターバーは表示されない', () => {
    render(<TodoApp />)
    expect(screen.queryByText(/すべて/)).not.toBeInTheDocument()
  })

  it('タスクを追加するとリストに表示される', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '新しいタスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(screen.getByText('新しいタスク')).toBeInTheDocument()
  })

  it('タスクを追加するとフィルターバーが表示される', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), 'タスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(screen.getByText(/すべて/)).toBeInTheDocument()
  })

  it('チェックボックスをクリックするとタスクが完了状態になる', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), 'タスク')
    await user.click(screen.getByRole('button', { name: '追加' }))
    await user.click(screen.getByRole('button', { name: '完了にする' }))

    expect(screen.getByText('タスク').closest('.todo-item')).toHaveClass('completed')
  })

  it('削除ボタンをクリックするとタスクがリストから消える', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '削除するタスク')
    await user.click(screen.getByRole('button', { name: '追加' }))
    await user.click(screen.getByRole('button', { name: '削除' }))

    expect(screen.queryByText('削除するタスク')).not.toBeInTheDocument()
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('「未完了」フィルターで完了済みタスクが非表示になる', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), 'アクティブ')
    await user.click(screen.getByRole('button', { name: '追加' }))
    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '完了済み')
    await user.click(screen.getByRole('button', { name: '追加' }))

    // 「完了済み」は先頭に来る（新しい順）→ 最初のチェックボックスをクリック
    const checkboxes = screen.getAllByRole('button', { name: '完了にする' })
    await user.click(checkboxes[0])

    await user.click(screen.getByText(/未完了/))

    expect(screen.getByText('アクティブ')).toBeInTheDocument()
    expect(screen.queryByText('完了済み')).not.toBeInTheDocument()
  })

  it('「完了」フィルターで未完了タスクが非表示になる', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), 'アクティブ')
    await user.click(screen.getByRole('button', { name: '追加' }))
    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '完了済み')
    await user.click(screen.getByRole('button', { name: '追加' }))

    const checkboxes = screen.getAllByRole('button', { name: '完了にする' })
    await user.click(checkboxes[0])

    await user.click(screen.getByText(/^完了 \(/))

    expect(screen.queryByText('アクティブ')).not.toBeInTheDocument()
    expect(screen.getByText('完了済み')).toBeInTheDocument()
  })

  it('「完了済みを削除」で完了タスクだけ削除される', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '残すタスク')
    await user.click(screen.getByRole('button', { name: '追加' }))
    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '消すタスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    const checkboxes = screen.getAllByRole('button', { name: '完了にする' })
    await user.click(checkboxes[0]) // 「消すタスク」を完了に

    await user.click(screen.getByText('完了済みを削除'))

    expect(screen.getByText('残すタスク')).toBeInTheDocument()
    expect(screen.queryByText('消すタスク')).not.toBeInTheDocument()
  })

  it('タスク追加後、カウントが正しく更新される', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), 'タスクA')
    await user.click(screen.getByRole('button', { name: '追加' }))
    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), 'タスクB')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(screen.getByText('すべて (2)')).toBeInTheDocument()
    expect(screen.getByText('未完了 (2)')).toBeInTheDocument()
    expect(screen.getByText('完了 (0)')).toBeInTheDocument()
  })
})
