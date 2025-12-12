# TimeMosaic - アーキテクチャ設計書

## システム全体構成

```
┌─────────────────────────────────────────┐
│   既存メモファイル (Markdown)           │
│   ~/Documents/Notes/history-events.md   │
└──────────────┬──────────────────────────┘
               │ ファイル監視 (Chokidar)
               ↓
┌─────────────────────────────────────────┐
│   Vite Dev Server (Node.js)             │
│   ┌─────────────────────────────────┐   │
│   │ カスタムプラグイン              │   │
│   │  - ファイル読み込み             │   │
│   │  - Markdown パース              │   │
│   │  - API エンドポイント提供       │   │
│   └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ HTTP (JSON)
               ↓
┌─────────────────────────────────────────┐
│   React Frontend (Vite + React + TS)    │
│   ┌─────────────────────────────────┐   │
│   │ UI Components                   │   │
│   │  - TimelineGrid (マルチカラム)  │   │
│   │  - EventCard                    │   │
│   │  - TagSelector                  │   │
│   │  - SearchBar                    │   │
│   └─────────────────────────────────┘   │
│   ┌─────────────────────────────────┐   │
│   │ State Management (React Hooks)  │   │
│   │  - events: Event[]              │   │
│   │  - selectedTags: string[]       │   │
│   │  - searchQuery: string          │   │
│   └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               ↓
         ブラウザ表示
      (localhost:5173)
```

## ディレクトリ構成

```
TimeMosaic/
├── docs/                      # ドキュメント
│   ├── product-overview.md
│   ├── tech-stack.md
│   ├── data-format-spec.md
│   ├── mvp-spec.md
│   └── architecture.md        # 本ファイル
├── src/                       # フロントエンドソース
│   ├── main.tsx               # エントリーポイント
│   ├── App.tsx                # メインコンポーネント
│   ├── components/            # UI コンポーネント
│   │   ├── TimelineGrid.tsx   # マルチカラム年表
│   │   ├── TimelineColumn.tsx # 各列
│   │   ├── EventCard.tsx      # イベントカード
│   │   ├── TagSelector.tsx    # タグ選択 UI
│   │   └── SearchBar.tsx      # 検索バー
│   ├── hooks/                 # カスタムフック
│   │   ├── useEvents.ts       # イベントデータ取得
│   │   └── useFileWatcher.ts  # ファイル監視
│   ├── types/                 # 型定義
│   │   └── event.ts           # Event 型など
│   └── utils/                 # ユーティリティ
│       └── dateParser.ts      # 日付パース
├── server/                    # バックエンド（Vite プラグイン）
│   ├── plugins/
│   │   └── eventsPlugin.ts    # カスタムプラグイン
│   ├── parser/
│   │   └── markdownParser.ts  # Markdown パーサー
│   └── watcher/
│       └── fileWatcher.ts     # ファイル監視
├── public/                    # 静的ファイル
├── .env.example               # 環境変数テンプレート
├── .env                       # 環境変数（Git 無視）
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## データフロー

### 1. 初期ロード

```
[ブラウザ起動]
     ↓
[React App 起動]
     ↓
[useEvents フックで API 呼び出し]
     ↓
[GET /api/events]
     ↓
[Vite プラグインがファイル読み込み]
     ↓
[Markdown パース → Event[] 生成]
     ↓
[JSON レスポンス返却]
     ↓
[React State に保存]
     ↓
[UI レンダリング]
```

### 2. ファイル更新時

```
[ユーザーがメモファイル編集]
     ↓
[Chokidar がファイル変更検知]
     ↓
[WebSocket で変更通知]
     ↓
[React が再度 API 呼び出し]
     ↓
[最新データ取得 → State 更新]
     ↓
[UI 再レンダリング]
```

### 3. タグ選択時

```
[ユーザーがタグをクリック]
     ↓
[selectedTags State を更新]
     ↓
[TimelineGrid が再レンダリング]
     ↓
[選択タグ分の列を生成]
     ↓
[各列に該当イベントをフィルタリング]
```

## コアロジック詳細

### Markdown パーサー

```typescript
// server/parser/markdownParser.ts

interface Event {
  id: string;
  date: PartialDate;
  title: string;
  tags: string[];
  description?: string;
  raw: string;
}

type PartialDate = {
  year: number;
  month?: number;
  day?: number;
}

function parseMarkdown(content: string): Event[] {
  const events: Event[] = [];

  // ## で分割してイベント候補を抽出
  const sections = content.split(/^##\s+/m).slice(1);

  for (const section of sections) {
    const lines = section.split('\n');
    const headerLine = lines[0];

    // 見出しから日付とタイトルを抽出
    const match = headerLine.match(/^(\d{4}(?:-\d{2}(?:-\d{2})?)?)\s+(.+)$/);
    if (!match) continue;

    const [, dateStr, title] = match;
    const date = parseDateString(dateStr);

    // タグ行を探す
    const tagLine = lines.find(line => line.trim().startsWith('#'));
    const tags = tagLine ? extractTags(tagLine) : [];

    if (tags.length === 0) {
      console.warn(`イベント "${title}" にタグがありません`);
    }

    // 説明文を抽出
    const descriptionLines = lines
      .slice(1)
      .filter(line => !line.trim().startsWith('#') && line.trim() !== '---')
      .join('\n')
      .trim();

    events.push({
      id: generateId(dateStr, title),
      date,
      title,
      tags,
      description: descriptionLines || undefined,
      raw: section
    });
  }

  return events;
}

function parseDateString(dateStr: string): PartialDate {
  const parts = dateStr.split('-').map(Number);
  return {
    year: parts[0],
    month: parts[1],
    day: parts[2]
  };
}

function extractTags(line: string): string[] {
  return (line.match(/#[\w\u4e00-\u9faf]+/g) || [])
    .map(tag => tag.slice(1)); // # を除去
}

function generateId(dateStr: string, title: string): string {
  return `${dateStr}-${title}`.replace(/\s+/g, '-');
}
```

### マルチカラム振り分けロジック

```typescript
// src/components/TimelineGrid.tsx

interface TimelineGridProps {
  events: Event[];
  selectedTags: string[];
  searchQuery: string;
}

function TimelineGrid({ events, selectedTags, searchQuery }: TimelineGridProps) {
  // 検索フィルター適用
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;

    const query = searchQuery.toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [events, searchQuery]);

  // 各列に表示するイベントを計算
  const columnData = useMemo(() => {
    return selectedTags.map(tag => {
      const columnEvents = filteredEvents.filter(event =>
        event.tags.includes(tag)
      );

      // 時系列でソート（古い順）
      columnEvents.sort((a, b) => compareDates(a.date, b.date));

      return {
        tag,
        events: columnEvents
      };
    });
  }, [filteredEvents, selectedTags]);

  if (selectedTags.length === 0) {
    return <EmptyState message="タグを選択してください" />;
  }

  return (
    <div className="grid grid-cols-auto gap-4 overflow-x-auto">
      {columnData.map(({ tag, events }) => (
        <TimelineColumn key={tag} tag={tag} events={events} />
      ))}
    </div>
  );
}

function compareDates(a: PartialDate, b: PartialDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return (a.month || 0) - (b.month || 0);
  return (a.day || 0) - (b.day || 0);
}
```

### ファイル監視

```typescript
// server/watcher/fileWatcher.ts

import chokidar from 'chokidar';
import { WebSocketServer } from 'ws';

export function setupFileWatcher(filePath: string, wss: WebSocketServer) {
  const watcher = chokidar.watch(filePath, {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', (path) => {
    console.log(`File changed: ${path}`);

    // 全クライアントに変更通知
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'file-changed' }));
      }
    });
  });

  return watcher;
}
```

```typescript
// src/hooks/useFileWatcher.ts

export function useFileWatcher(onFileChange: () => void) {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5173');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'file-changed') {
        onFileChange();
      }
    };

    return () => ws.close();
  }, [onFileChange]);
}
```

## パフォーマンス最適化

### 1. メモ化
- `useMemo` でフィルタリングとソート結果をキャッシュ
- `React.memo` でコンポーネントの再レンダリング抑制

### 2. 仮想スクロール（将来版）
- `react-window` や `react-virtual` 導入
- 1000+ イベントでも快適に

### 3. デバウンス
- 検索入力は 300ms デバウンス
- 過剰な再計算を防ぐ

## セキュリティ考慮事項

### ファイルアクセス制限
- `.env` で指定されたパス以外は読み込まない
- パストラバーサル攻撃対策

### XSS 対策
- React のデフォルトエスケープに依存
- `dangerouslySetInnerHTML` は使用しない（将来 Markdown レンダリング時は sanitize）

## 環境変数

```env
# .env.example

# メモファイルのパス（絶対パス）
VITE_EVENTS_FILE_PATH=/Users/username/Documents/Notes/history-events.md

# ポート番号（デフォルト: 5173）
VITE_PORT=5173
```

## 開発・運用

### 開発モード
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### 本番起動
```bash
npm run preview
```

## 将来的な拡張

1. **複数ファイル対応**
   - ディレクトリ指定で全 `.md` 読み込み

2. **Electron 化**
   - デスクトップアプリとして配布

3. **エクスポート**
   - PDF、PNG、JSON 形式でエクスポート

4. **カスタムテーマ**
   - ダークモード、カラースキーム選択

5. **イベント編集**
   - アプリ内で直接編集可能に
