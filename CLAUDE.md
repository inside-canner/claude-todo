# CLAUDE.md

このファイルは、リポジトリ内のコードを扱う際の Claude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト

React + TypeScript + Vite で作られた ToDo アプリ。バックエンド不要、localStorage で永続化。

## コマンド

```bash
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # 型チェック + プロダクションビルド
npm run preview  # ビルド結果のプレビュー
```

## アーキテクチャ

```
src/
├── types/todo.ts          # Todo, Priority, FilterType 型定義
├── hooks/useTodos.ts      # ロジック全体 (CRUD + localStorage + フィルター)
├── components/
│   ├── TodoApp.tsx        # ルートコンポーネント
│   ├── TodoInput.tsx      # 新規タスク入力フォーム
│   ├── TodoFilter.tsx     # フィルタータブ (すべて/未完了/完了)
│   ├── TodoList.tsx       # タスク一覧
│   └── TodoItem.tsx       # 個別タスク (チェック/インライン編集/削除)
└── index.css              # CSS カスタムプロパティベースのスタイル
```

## 機能

- タスクの追加・完了トグル・削除
- インライン編集 (ダブルクリック → Enter で確定 / Escape でキャンセル)
- 優先度設定 (高/中/低、色付きドットで表示)
- フィルター (すべて / 未完了 / 完了)
- 完了済み一括削除
- localStorage 永続化
