# TimeMosaic ファイル読み込みAPI仕様書

## 概要

ViteカスタムプラグインでMarkdownファイルを読み込み、パースしたイベントデータをJSON形式で返すAPIを実装します。

## API仕様

### エンドポイント

```
GET /api/events
```

### レスポンス形式

```typescript
{
  events: Event[];  // パースに成功したイベント配列
  errors: ParseError[];  // パースエラー配列
}
```

### Event型

```typescript
interface Event {
  id: string;              // UUID v4
  date: PartialDate;       // 日付情報
  title: string;           // タイトル
  tags: string[];          // タグ配列
  description?: string;    // 説明文（オプション）
  raw: string;             // 元のMarkdownテキスト
}

interface PartialDate {
  year: number;
  month?: number;  // 1-12
  day?: number;    // 1-31
}
```

### ParseError型

```typescript
interface ParseError {
  line?: number;      // エラー発生行番号
  message: string;    // エラーメッセージ
  raw?: string;       // エラー発生元テキスト
}
```

## 受け入れ基準（Acceptance Criteria）

### AC1: サンプルファイルの読み込み
- ✅ `/api/events` にGETリクエストすると、サンプルファイル（`sample/events.md`）を読み込む
- ✅ ファイルが存在しない場合、適切なエラーレスポンスを返す

### AC2: 正常なイベントのパース
- ✅ サンプルファイル内の正しい形式のイベントを全てパースできる
- ✅ パースされたイベントは`events`配列に格納される
- ✅ 各イベントにはUUID v4が割り当てられる

### AC3: エラーハンドリング
- ✅ パースに失敗したイベントは`errors`配列に格納される
- ✅ エラーには行番号とメッセージが含まれる
- ✅ パースエラーがあっても、正常なイベントは返される

### AC4: レスポンス形式
- ✅ レスポンスはJSON形式
- ✅ Content-Typeは`application/json`
- ✅ ステータスコードは200（ファイル読み込み成功時）

### AC5: パフォーマンス
- ✅ サンプルファイル（10イベント程度）のパースは100ms以内に完了
- ✅ レスポンスタイムは500ms以内

## サンプルレスポンス

```json
{
  "events": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "date": { "year": 1945, "month": 8, "day": 15 },
      "title": "終戦記念日",
      "tags": ["歴史", "日本", "第二次世界大戦"],
      "description": "第二次世界大戦の終結を告げる玉音放送が流れた日。\n日本は連合国に対して無条件降伏を受け入れた。",
      "raw": "## 1945-08-15 終戦記念日\n#歴史 #日本 #第二次世界大戦\n\n第二次世界大戦の終結を告げる玉音放送が流れた日。\n日本は連合国に対して無条件降伏を受け入れた。"
    }
  ],
  "errors": []
}
```

## 実装要件

### ファイルパス設定
- サンプルファイルのパスは`sample/events.md`（固定）
- 将来的には環境変数で設定可能にする予定

### Viteプラグイン実装
- `vite.config.ts`にカスタムプラグインを追加
- `configureServer`フックで`/api/events`エンドポイントを追加
- Node.jsの`fs`モジュールでファイルを読み込み
- `parseMarkdown`関数でパース
- JSONレスポンスを返す

### エラーハンドリング
- ファイル読み込みエラー（404、permission denied等）
- パースエラー（不正な形式のイベント）
- 適切なHTTPステータスコードとエラーメッセージ

## テスト方針

### 統合テスト
1. サンプルファイルが正しくパースされることを確認
2. レスポンス形式が仕様通りであることを確認
3. エラーケースが正しく処理されることを確認

### 手動テスト
1. `npm run dev`でサーバー起動
2. ブラウザで`http://localhost:5173/api/events`にアクセス
3. JSONレスポンスが表示されることを確認

## 成功基準

- [ ] `/api/events`エンドポイントが実装されている
- [ ] サンプルファイルを正しくパースしてJSONで返す
- [ ] 全ての受け入れ基準を満たす
- [ ] 統合テストが全てパスする
- [ ] 手動テストで期待通りのレスポンスが得られる
