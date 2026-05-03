import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoFilter } from './TodoFilter'

const defaultProps = {
  filter: 'all' as const,
  onFilterChange: vi.fn(),
  activeCount: 3,
  completedCount: 2,
  allCount: 5,
  onClearCompleted: vi.fn(),
}

describe('TodoFilter', () => {
  it('3つのフィルタータブがすべて表示される', () => {
    render(<TodoFilter {...defaultProps} />)

    expect(screen.getByText('すべて (5)')).toBeInTheDocument()
    expect(screen.getByText('未完了 (3)')).toBeInTheDocument()
    expect(screen.getByText('完了 (2)')).toBeInTheDocument()
  })

  it('各タブに正しいカウントが表示される', () => {
    render(<TodoFilter {...defaultProps} activeCount={7} completedCount={3} allCount={10} />)

    expect(screen.getByText('すべて (10)')).toBeInTheDocument()
    expect(screen.getByText('未完了 (7)')).toBeInTheDocument()
    expect(screen.getByText('完了 (3)')).toBeInTheDocument()
  })

  it('現在のフィルタータブに active クラスが付く', () => {
    render(<TodoFilter {...defaultProps} filter="active" />)

    expect(screen.getByText('未完了 (3)')).toHaveClass('active')
    expect(screen.getByText('すべて (5)')).not.toHaveClass('active')
    expect(screen.getByText('完了 (2)')).not.toHaveClass('active')
  })

  it('「すべて」タブをクリックすると onFilterChange("all") が呼ばれる', async () => {
    const onFilterChange = vi.fn()
    const user = userEvent.setup()
    render(<TodoFilter {...defaultProps} filter="active" onFilterChange={onFilterChange} />)

    await user.click(screen.getByText('すべて (5)'))

    expect(onFilterChange).toHaveBeenCalledWith('all')
  })

  it('「未完了」タブをクリックすると onFilterChange("active") が呼ばれる', async () => {
    const onFilterChange = vi.fn()
    const user = userEvent.setup()
    render(<TodoFilter {...defaultProps} onFilterChange={onFilterChange} />)

    await user.click(screen.getByText('未完了 (3)'))

    expect(onFilterChange).toHaveBeenCalledWith('active')
  })

  it('「完了」タブをクリックすると onFilterChange("completed") が呼ばれる', async () => {
    const onFilterChange = vi.fn()
    const user = userEvent.setup()
    render(<TodoFilter {...defaultProps} onFilterChange={onFilterChange} />)

    await user.click(screen.getByText('完了 (2)'))

    expect(onFilterChange).toHaveBeenCalledWith('completed')
  })

  it('completedCount > 0 のとき「完了済みを削除」ボタンが表示される', () => {
    render(<TodoFilter {...defaultProps} completedCount={1} />)

    expect(screen.getByText('完了済みを削除')).toBeInTheDocument()
  })

  it('completedCount が 0 のとき「完了済みを削除」ボタンは表示されない', () => {
    render(<TodoFilter {...defaultProps} completedCount={0} />)

    expect(screen.queryByText('完了済みを削除')).not.toBeInTheDocument()
  })

  it('「完了済みを削除」ボタンをクリックすると onClearCompleted が呼ばれる', async () => {
    const onClearCompleted = vi.fn()
    const user = userEvent.setup()
    render(<TodoFilter {...defaultProps} completedCount={2} onClearCompleted={onClearCompleted} />)

    await user.click(screen.getByText('完了済みを削除'))

    expect(onClearCompleted).toHaveBeenCalledTimes(1)
  })
})
