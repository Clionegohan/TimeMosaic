# TimeMosaic - API 仕様書

## 概要

TimeMosaic のバックエンド API エンドポイント仕様。
Vite カスタムプラグインによる開発サーバー上での API 提供。

**対象フェーズ**: Phase 3 - API 整備

## 目的

フロントエンドがマルチカラム年表を表示するために必要な、以下の機能を API として提供する：

1. 全イベントデータの取得
2. 利用可能なタグ一覧の取得
3. 選択タグに基づくカラムデータの取得

## API エンドポイント一覧

| メソッド | エンドポイント | 説明 | 実装状況 |
|---------|--------------|------|---------|
| GET | `/api/events` | 全イベントを取得 | ✅ Phase 2 実装済み |
| GET | `/api/tags` | 全タグ一覧を取得 | ❌ 新規実装 |
| GET | `/api/columns` | カラムデータを取得 | ❌ 新規実装 |

---

## 1. GET /api/events

### 概要

全イベントデータを取得する。

### リクエスト

```http
GET /api/events
```

**クエリパラメータ**: なし

### レスポンス

**成功時（200 OK）:**

```json
{
  "events": [
    {
      "id": "1",
      "date": { "year": 1945, "month": 8, "day": 15 },
      "title": "終戦記念日",
      "tags": ["歴史", "日本", "第二次世界大戦"],
      "description": "第二次世界大戦の終結を告げる玉音放送が流れた日。",
      "raw": "# 1945-08-15 | 終戦記念日 | #歴史 #日本 #第二次世界大戦\n..."
    },
    {
      "id": "2",
      "date": { "year": 1964, "month": 10, "day": 10 },
      "title": "東京オリンピック開会",
      "tags": ["スポーツ", "日本", "オリンピック"],
      "raw": "# 1964-10-10 | 東京オリンピック開会 | #スポーツ #日本 #オリンピック"
    }
  ],
  "errors": []
}
```

**エラー時（500 Internal Server Error）:**

```json
{
  "error": "Failed to read file: ENOENT: no such file or directory"
}
```

### 仕様

- Phase 2 で実装済み
- `sample/events.md` からイベントを読み込む
- `parseMarkdown` 関数でパース
- パースエラーがあっても正常なイベントは返す（`errors` 配列に詳細）

---

## 2. GET /api/tags

### 概要

全イベントから抽出した利用可能なタグ一覧を取得する。

### リクエスト

```http
GET /api/tags
```

**クエリパラメータ**: なし

### レスポンス

**成功時（200 OK）:**

```json
{
  "tags": [
    "アメリカ",
    "オリンピック",
    "スポーツ",
    "ドイツ",
    "フランス",
    "歴史",
    "日本",
    "disaster",
    "科学",
    "文化"
  ],
  "count": 10
}
```

**エラー時（500 Internal Server Error）:**

```json
{
  "error": "Failed to read file: ENOENT: no such file or directory"
}
```

### 仕様

- `sample/events.md` からイベントを読み込む
- `extractAllTags` 関数で全タグを抽出
- 重複なし、ソート済みの配列を返す
- 空配列の場合も正常レスポンス（`{ "tags": [], "count": 0 }`）

### 使用例

フロントエンドでタグ選択 UI を表示する際に使用：

```typescript
// タグ一覧を取得
const response = await fetch('/api/tags');
const { tags } = await response.json();

// UI に表示
tags.forEach(tag => {
  // タグ選択ボタンを生成
});
```

---

## 3. GET /api/columns

### 概要

選択されたタグに基づいてカラムデータを生成し、取得する。

### リクエスト

```http
GET /api/columns?tags=歴史,日本&order=asc
```

**クエリパラメータ:**

| パラメータ | 必須 | 型 | 説明 | デフォルト |
|----------|-----|----|----|----------|
| `tags` | ✅ 必須 | string | カンマ区切りのタグ一覧（例: `歴史,日本`） | - |
| `order` | ⬜ 任意 | string | ソート順（`asc` または `desc`） | `asc` |

### レスポンス

**成功時（200 OK）:**

```json
{
  "columns": [
    {
      "tag": "歴史",
      "events": [
        {
          "id": "1",
          "date": { "year": 1543 },
          "title": "鉄砲伝来",
          "tags": ["歴史", "日本", "貿易"],
          "description": "種子島にポルトガル人が漂着...",
          "raw": "..."
        },
        {
          "id": "2",
          "date": { "year": 1868 },
          "title": "明治維新",
          "tags": ["歴史", "日本", "政治"],
          "raw": "..."
        }
      ]
    },
    {
      "tag": "日本",
      "events": [
        {
          "id": "1",
          "date": { "year": 1543 },
          "title": "鉄砲伝来",
          "tags": ["歴史", "日本", "貿易"],
          "raw": "..."
        },
        {
          "id": "2",
          "date": { "year": 1868 },
          "title": "明治維新",
          "tags": ["歴史", "日本", "政治"],
          "raw": "..."
        }
      ]
    }
  ],
  "metadata": {
    "selectedTags": ["歴史", "日本"],
    "sortOrder": "asc",
    "totalEvents": 10
  }
}
```

**バリデーションエラー時（400 Bad Request）:**

```json
{
  "error": "Missing required parameter: tags",
  "example": "/api/columns?tags=歴史,日本&order=asc"
}
```

**エラー時（500 Internal Server Error）:**

```json
{
  "error": "Failed to read file: ENOENT: no such file or directory"
}
```

### 仕様

- `sample/events.md` からイベントを読み込む
- `tags` パラメータは必須（空の場合は 400 エラー）
- タグはカンマ区切り、前後の空白は自動トリム
- 存在しないタグを指定した場合、そのカラムは空配列（`events: []`）
- `order` パラメータは `asc`/`desc` のみ有効（それ以外は `asc` として扱う）
- 各カラムのイベントは `sortEventsByDate` でソート済み
- 同じイベントが複数のカラムに表示される（イベントが複数タグを持つ場合）

### 使用例

```typescript
// ユーザーが「歴史」と「日本」を選択
const selectedTags = ['歴史', '日本'];
const order = 'asc';

// カラムデータを取得
const response = await fetch(
  `/api/columns?tags=${selectedTags.join(',')}&order=${order}`
);
const { columns, metadata } = await response.json();

// マルチカラム表示
columns.forEach(column => {
  // 列を描画
  column.events.forEach(event => {
    // イベントカードを描画
  });
});
```

---

## 受け入れ基準（Acceptance Criteria）

### AC1: 全イベント取得

- [ ] `GET /api/events` が正常に動作する
- [ ] レスポンスに全イベントが含まれる
- [ ] ファイル読み込みエラー時に 500 エラーを返す

### AC2: タグ一覧取得

- [ ] `GET /api/tags` が正常に動作する
- [ ] レスポンスに重複なしのタグ配列が含まれる
- [ ] タグはソート済みである
- [ ] イベントが0件の場合、空配列を返す
- [ ] ファイル読み込みエラー時に 500 エラーを返す

### AC3: カラムデータ取得

- [ ] `GET /api/columns?tags=歴史,日本&order=asc` が正常に動作する
- [ ] 選択タグごとにカラムが生成される
- [ ] 各カラムのイベントは選択タグでフィルタされている
- [ ] 各カラムのイベントは指定順（asc/desc）でソートされている
- [ ] 同じイベントが複数カラムに表示される（複数タグ保持時）
- [ ] 存在しないタグを指定しても正常動作する（空カラム）
- [ ] `tags` パラメータなしの場合、400 エラーを返す
- [ ] ファイル読み込みエラー時に 500 エラーを返す

### AC4: エッジケース

- [ ] 空文字列タグ（`tags=`）の場合、400 エラーを返す
- [ ] 不正な `order` パラメータ（`order=invalid`）の場合、`asc` として扱う
- [ ] タグ名に空白を含む場合（`tags= 歴史 , 日本 `）、トリムして処理

---

## 開発フロー（ATDD）

```text
Step 1: API仕様書作成（このドキュメント）
  ↓ エンドポイント定義、受け入れ基準を明確化

Step 2: 統合テスト作成（RED）
  ↓ 受け入れ基準に基づくAPIテストを作成
  ↓ テストを実行して RED（失敗）を確認

Step 3: 実装（GREEN）
  ↓ vitePlugin.ts にエンドポイントを実装
  ↓ テストを実行して GREEN（成功）を確認

Step 4: 手動テスト
  ↓ curl等で実際にAPIを叩いて動作確認

Step 5: コミット＆PR作成
```

---

## 技術詳細

### 使用ライブラリ・関数

- `readEventsFromFile` - ファイル読み込みとパース
- `extractAllTags` - タグ抽出
- `createColumns` - カラム生成

### エラーハンドリング

- ファイル読み込みエラー → 500 エラー
- バリデーションエラー → 400 エラー
- パースエラー → イベント配列に含めつつ `errors` 配列に詳細

### レスポンス形式

- すべて JSON 形式
- `Content-Type: application/json`
- インデント付き（`JSON.stringify(data, null, 2)`）

---

## 将来の拡張

- キーワード検索エンドポイント（`GET /api/search?q=keyword`）
- 複数ファイル対応
- ページネーション
- キャッシュ機能
