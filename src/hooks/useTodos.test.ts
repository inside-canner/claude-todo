import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from './useTodos'
import type { Todo } from '../types/todo'

const STORAGE_KEY = 'claude-todos'

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // ── addTodo ──────────────────────────────────────────────────────────

  describe('addTodo', () => {
    it('テキストと優先度を指定してタスクを追加できる', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('牛乳を買う', 'high') })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].text).toBe('牛乳を買う')
      expect(result.current.todos[0].priority).toBe('high')
      expect(result.current.todos[0].completed).toBe(false)
    })

    it('追加されたタスクは一意なIDを持つ', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('タスクA', 'medium')
        result.current.addTodo('タスクB', 'medium')
      })
      const ids = result.current.todos.map(t => t.id)
      expect(new Set(ids).size).toBe(2)
    })

    it('テキストの前後の空白をトリムして保存する', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('  スペースあり  ', 'low') })

      expect(result.current.todos[0].text).toBe('スペースあり')
    })

    it('空文字のタスクは追加しない', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('', 'medium') })

      expect(result.current.todos).toHaveLength(0)
    })

    it('空白のみのテキストはタスクを追加しない', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('   ', 'medium') })

      expect(result.current.todos).toHaveLength(0)
    })

    it('新しいタスクはリストの先頭に追加される', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('最初', 'medium')
        result.current.addTodo('2番目', 'medium')
      })

      expect(result.current.todos[0].text).toBe('2番目')
      expect(result.current.todos[1].text).toBe('最初')
    })
  })

  // ── toggleTodo ───────────────────────────────────────────────────────

  describe('toggleTodo', () => {
    it('未完了のタスクを完了に切り替える', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('タスク', 'medium') })
      const id = result.current.todos[0].id

      act(() => { result.current.toggleTodo(id) })

      expect(result.current.todos[0].completed).toBe(true)
    })

    it('完了済みのタスクを未完了に戻す', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('タスク', 'medium') })
      const id = result.current.todos[0].id

      act(() => { result.current.toggleTodo(id) })
      act(() => { result.current.toggleTodo(id) })

      expect(result.current.todos[0].completed).toBe(false)
    })

    it('指定したタスクだけが切り替わり他は影響を受けない', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('タスクA', 'medium')
        result.current.addTodo('タスクB', 'medium')
      })
      const idB = result.current.todos[0].id // 新しい方が先頭

      act(() => { result.current.toggleTodo(idB) })

      expect(result.current.todos[0].completed).toBe(true)   // タスクB
      expect(result.current.todos[1].completed).toBe(false)  // タスクA
    })
  })

  // ── deleteTodo ───────────────────────────────────────────────────────

  describe('deleteTodo', () => {
    it('指定したIDのタスクを削除する', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('タスクA', 'medium')
        result.current.addTodo('タスクB', 'medium')
      })
      const idA = result.current.todos[1].id // 古い方が末尾

      act(() => { result.current.deleteTodo(idA) })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].text).toBe('タスクB')
    })

    it('存在しないIDを指定しても他のタスクは変わらない', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('タスク', 'medium') })

      act(() => { result.current.deleteTodo('nonexistent-id') })

      expect(result.current.todos).toHaveLength(1)
    })
  })

  // ── editTodo ─────────────────────────────────────────────────────────

  describe('editTodo', () => {
    it('タスクのテキストを更新する', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('元のテキスト', 'medium') })
      const id = result.current.todos[0].id

      act(() => { result.current.editTodo(id, '更新後のテキスト') })

      expect(result.current.todos[0].text).toBe('更新後のテキスト')
    })

    it('更新テキストの前後の空白をトリムする', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('元のテキスト', 'medium') })
      const id = result.current.todos[0].id

      act(() => { result.current.editTodo(id, '  前後スペース  ') })

      expect(result.current.todos[0].text).toBe('前後スペース')
    })

    it('空文字を渡した場合はテキストを変更しない', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('元のテキスト', 'medium') })
      const id = result.current.todos[0].id

      act(() => { result.current.editTodo(id, '') })

      expect(result.current.todos[0].text).toBe('元のテキスト')
    })

    it('空白のみのテキストを渡した場合はテキストを変更しない', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('元のテキスト', 'medium') })
      const id = result.current.todos[0].id

      act(() => { result.current.editTodo(id, '   ') })

      expect(result.current.todos[0].text).toBe('元のテキスト')
    })
  })

  // ── clearCompleted ───────────────────────────────────────────────────

  describe('clearCompleted', () => {
    it('完了済みのタスクをすべて削除する', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('タスクA', 'medium')
        result.current.addTodo('タスクB', 'medium')
        result.current.addTodo('タスクC', 'medium')
      })
      // タスクCとタスクAを完了にする（リストは C,B,A の順）
      act(() => {
        result.current.toggleTodo(result.current.todos[0].id) // タスクC
        result.current.toggleTodo(result.current.todos[2].id) // タスクA
      })

      act(() => { result.current.clearCompleted() })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].text).toBe('タスクB')
    })

    it('完了済みがない場合はタスクを削除しない', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('アクティブ', 'medium') })

      act(() => { result.current.clearCompleted() })

      expect(result.current.todos).toHaveLength(1)
    })
  })

  // ── filter ───────────────────────────────────────────────────────────

  describe('filter', () => {
    it('デフォルトフィルターは "all" でアクティブと完了の両方が表示される', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('アクティブ', 'medium')
        result.current.addTodo('完了', 'medium')
      })
      act(() => { result.current.toggleTodo(result.current.todos[0].id) })

      expect(result.current.todos).toHaveLength(2)
    })

    it('"active" フィルターで未完了タスクのみ表示される', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('アクティブ', 'medium')
        result.current.addTodo('完了', 'medium')
      })
      act(() => { result.current.toggleTodo(result.current.todos[0].id) })

      act(() => { result.current.setFilter('active') })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].completed).toBe(false)
    })

    it('"completed" フィルターで完了済みタスクのみ表示される', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('アクティブ', 'medium')
        result.current.addTodo('完了', 'medium')
      })
      act(() => { result.current.toggleTodo(result.current.todos[0].id) })

      act(() => { result.current.setFilter('completed') })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].completed).toBe(true)
    })

    it('フィルター中でも allTodosCount は全タスク数を返す', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('タスクA', 'medium')
        result.current.addTodo('タスクB', 'medium')
      })
      act(() => { result.current.toggleTodo(result.current.todos[0].id) })
      act(() => { result.current.setFilter('active') })

      expect(result.current.allTodosCount).toBe(2)
      expect(result.current.todos).toHaveLength(1)
    })
  })

  // ── counts ───────────────────────────────────────────────────────────

  describe('counts', () => {
    it('activeCount と completedCount が正確に計算される', () => {
      const { result } = renderHook(() => useTodos())
      act(() => {
        result.current.addTodo('タスクA', 'medium')
        result.current.addTodo('タスクB', 'medium')
        result.current.addTodo('タスクC', 'medium')
      })
      act(() => { result.current.toggleTodo(result.current.todos[0].id) })

      expect(result.current.activeCount).toBe(2)
      expect(result.current.completedCount).toBe(1)
    })

    it('初期状態では activeCount と completedCount がともに 0', () => {
      const { result } = renderHook(() => useTodos())

      expect(result.current.activeCount).toBe(0)
      expect(result.current.completedCount).toBe(0)
    })
  })

  // ── localStorage ─────────────────────────────────────────────────────

  describe('localStorage 永続化', () => {
    it('タスク追加後に localStorage に保存される', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('永続化タスク', 'high') })

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Todo[]
      expect(stored).toHaveLength(1)
      expect(stored[0].text).toBe('永続化タスク')
      expect(stored[0].priority).toBe('high')
    })

    it('初期化時に localStorage からタスクを読み込む', () => {
      const saved: Todo[] = [
        { id: '1', text: '保存済みタスク', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))

      const { result } = renderHook(() => useTodos())

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].text).toBe('保存済みタスク')
    })

    it('localStorage のデータが壊れている場合は空の配列で開始する', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid_json')

      const { result } = renderHook(() => useTodos())

      expect(result.current.todos).toHaveLength(0)
    })
  })
})
