import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoInput } from './TodoInput'

describe('TodoInput', () => {
  it('テキスト入力・優先度セレクト・追加ボタンが描画される', () => {
    render(<TodoInput onAdd={vi.fn()} />)

    expect(screen.getByPlaceholderText('新しいタスクを追加...')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '優先度' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('入力が空のとき追加ボタンは無効', () => {
    render(<TodoInput onAdd={vi.fn()} />)

    expect(screen.getByRole('button', { name: '追加' })).toBeDisabled()
  })

  it('テキストを入力すると追加ボタンが有効になる', async () => {
    const user = userEvent.setup()
    render(<TodoInput onAdd={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), 'タスク')

    expect(screen.getByRole('button', { name: '追加' })).toBeEnabled()
  })

  it('空白のみの入力では追加ボタンが無効のまま', async () => {
    const user = userEvent.setup()
    render(<TodoInput onAdd={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '   ')

    expect(screen.getByRole('button', { name: '追加' })).toBeDisabled()
  })

  it('フォーム送信時に onAdd がテキストと優先度で呼ばれる', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoInput onAdd={onAdd} />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '新しいタスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith('新しいタスク', 'medium')
  })

  it('送信後に入力欄がクリアされる', async () => {
    const user = userEvent.setup()
    render(<TodoInput onAdd={vi.fn()} />)
    const input = screen.getByPlaceholderText('新しいタスクを追加...')

    await user.type(input, 'タスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(input).toHaveValue('')
  })

  it('優先度を「高」に変更して送信すると high で呼ばれる', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoInput onAdd={onAdd} />)

    await user.selectOptions(screen.getByRole('combobox', { name: '優先度' }), 'high')
    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '重要タスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).toHaveBeenCalledWith('重要タスク', 'high')
  })

  it('優先度を「低」に変更して送信すると low で呼ばれる', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoInput onAdd={onAdd} />)

    await user.selectOptions(screen.getByRole('combobox', { name: '優先度' }), 'low')
    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '低優先度タスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).toHaveBeenCalledWith('低優先度タスク', 'low')
  })

  it('Enter キーでもフォームを送信できる', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoInput onAdd={onAdd} />)

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), 'エンターで追加{Enter}')

    expect(onAdd).toHaveBeenCalledWith('エンターで追加', 'medium')
  })
})
