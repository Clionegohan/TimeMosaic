# TimeMosaic - 技術スタック

## アーキテクチャ概要

```
[既存メモファイル(.md)]
         ↓
[Vite Dev Server (Node.js API)]
         ↓
[React Frontend (Vite + React)]
         ↓
[ブラウザ表示]
```

## フロントエンド

### Vite + React
- **Vite**: 高速な開発サーバーとビルドツール
- **React**: UI コンポーネント構築
- **TypeScript**: 型安全性の確保

### UI ライブラリ（候補）
- **Tailwind CSS**: ユーティリティファーストの CSS フレームワーク
- **Headless UI / Radix UI**: アクセシブルな UI コンポーネント

### 状態管理
- **React Hooks**: useState, useEffect など標準的な Hook
- **必要に応じて**: Zustand や Jotai などの軽量状態管理

## バックエンド / データ層

### ファイル読み込み
- **Vite カスタムプラグイン**: ファイルシステムへのアクセス
- **Node.js fs モジュール**: Markdown ファイルの読み込み
- **Chokidar**: ファイル監視と自動リロード

### Markdown パーサー
- **markdown-it** または **remark**: Markdown のパース
- **gray-matter**: Front Matter の解析（将来拡張用）

## データフォーマット

- **入力**: Markdown (.md) ファイル
- **保存場所**: ユーザー指定のローカルディレクトリ
- **フォーマット**: 独自の Markdown 形式（後述）

## 開発環境

- **Node.js**: v18 以上
- **パッケージマネージャー**: npm または pnpm
- **エディタ**: VS Code 推奨

## デプロイ

- **ローカルホスト専用**: デプロイ不要
- **起動方法**: `npm run dev` でローカルサーバー起動
- **アクセス**: `http://localhost:5173` など

## 将来的な拡張可能性

- Electron 化によるデスクトップアプリ化
- エクスポート機能（PDF、画像など）
- 複数ファイル対応
- Git 統合（履歴管理）
