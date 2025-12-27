# TimeMosaic マルチカラムロジック仕様書

## 概要

マルチカラム年表表示のコアロジックを実装します。選択されたタグごとに列を生成し、各列にそのタグを持つイベントを年号順に表示するためのデータ処理ユーティリティ関数群を提供します。

## ゴール

UIから独立したピュアな関数として実装し、テストが容易で再利用可能なロジック層を構築します。

## 入力データ

### Event型（既存）
```typescript
interface Event {
  id: string;
  date: PartialDate;
  title: string;
  tags: string[];
  description?: string;
  raw: string;
}

interface PartialDate {
  year: number;
  month?: number;
  day?: number;
}
```

## 出力データ

### Column型（新規）
```typescript
interface Column {
  tag: string;           // 列のタグ名
  events: Event[];       // この列に表示するイベント（年号順ソート済み）
}
```

## 実装する関数

### 1. extractAllTags

**目的**: 全イベントからタグ一覧を抽出（重複なし）

**シグネチャ**:
```typescript
function extractAllTags(events: Event[]): string[]
```

**仕様**:
- 全イベントの`tags`配列から重複を除いたタグ一覧を返す
- 順序: アルファベット順（日本語は文字コード順）
- 空配列の場合は空配列を返す

**例**:
```typescript
const events = [
  { tags: ['歴史', '日本'] },
  { tags: ['スポーツ', '日本'] },
];
extractAllTags(events) // => ['スポーツ', '日本', '歴史']
```

---

### 2. sortEventsByDate

**目的**: イベントを年号順にソート

**シグネチャ**:
```typescript
function sortEventsByDate(
  events: Event[],
  order: 'asc' | 'desc' = 'asc'
): Event[]
```

**仕様**:
- `order: 'asc'` - 古い順（デフォルト）
- `order: 'desc'` - 新しい順
- ソートキー: `year` > `month` > `day`
- `month`や`day`がない場合は0として扱う
- 元の配列は変更しない（新しい配列を返す）

**例**:
```typescript
const events = [
  { date: { year: 1945, month: 8, day: 15 } },
  { date: { year: 1945, month: 8, day: 6 } },
  { date: { year: 1945 } },
];
sortEventsByDate(events, 'asc')
// => [
//   { date: { year: 1945 } },           // 1945-00-00
//   { date: { year: 1945, month: 8 } }, // 1945-08-00 (注: month: 6が先)
//   { date: { year: 1945, month: 8, day: 15 } },
// ]
```

---

### 3. filterEventsByTag

**目的**: 特定のタグを持つイベントを抽出

**シグネチャ**:
```typescript
function filterEventsByTag(events: Event[], tag: string): Event[]
```

**仕様**:
- `tags`配列に指定されたタグを含むイベントを返す
- 大文字小文字を区別する
- 見つからない場合は空配列を返す
- 元の配列は変更しない

**例**:
```typescript
const events = [
  { tags: ['歴史', '日本'] },
  { tags: ['スポーツ', '日本'] },
];
filterEventsByTag(events, '日本') // => 両方のイベント
filterEventsByTag(events, '歴史') // => 最初のイベントのみ
```

---

### 4. createColumns

**目的**: 選択タグから列データを生成（メイン関数）

**シグネチャ**:
```typescript
function createColumns(
  events: Event[],
  selectedTags: string[],
  sortOrder: 'asc' | 'desc' = 'asc'
): Column[]
```

**仕様**:
- 各選択タグに対して1つの列を生成
- 各列には、そのタグを持つイベントを年号順に格納
- 同じイベントが複数の列に表示される可能性がある
- 選択タグの順序で列を返す
- `selectedTags`が空の場合は空配列を返す

**例**:
```typescript
const events = [
  { id: '1', date: { year: 1945 }, tags: ['歴史', '日本'] },
  { id: '2', date: { year: 1964 }, tags: ['スポーツ', '日本'] },
  { id: '3', date: { year: 1914 }, tags: ['歴史'] },
];

createColumns(events, ['歴史', '日本'])
// => [
//   {
//     tag: '歴史',
//     events: [
//       { id: '3', ... }, // 1914
//       { id: '1', ... }, // 1945
//     ]
//   },
//   {
//     tag: '日本',
//     events: [
//       { id: '1', ... }, // 1945
//       { id: '2', ... }, // 1964
//     ]
//   }
// ]
```

---

## 受け入れ基準（Acceptance Criteria）

### AC1: タグ抽出
- ✅ 全イベントから重複なしのタグ一覧を取得できる
- ✅ ソート済み（アルファベット順）で返される
- ✅ 空配列を渡すと空配列が返る

### AC2: 日付ソート
- ✅ 古い順（asc）と新しい順（desc）の両方でソートできる
- ✅ 年のみ、年月、年月日の混在データを正しくソートできる
- ✅ 元の配列は変更されない（イミュータブル）

### AC3: タグフィルタリング
- ✅ 指定されたタグを持つイベントを正しく抽出できる
- ✅ 複数タグを持つイベントも正しく抽出される
- ✅ 存在しないタグで検索すると空配列が返る

### AC4: 列生成（コア機能）
- ✅ 選択されたタグごとに列が生成される
- ✅ 各列には該当タグを持つイベントが年号順に格納される
- ✅ 同じイベントが複数の列に表示される
- ✅ 選択タグの順序で列が返される
- ✅ 空の選択タグリストで空配列が返る

### AC5: エッジケース
- ✅ 空のイベント配列でも正しく動作する
- ✅ 存在しないタグを選択しても正しく動作する（空の列）
- ✅ 全ての関数がイミュータブル（元データを変更しない）

## ATDD開発アプローチ

このフェーズでは**ATDD（Acceptance Test-Driven Development）**で進めます。

### 開発フロー

```
Step 1: 統合テスト作成（RED）
  ↓ 実際のユースケースシナリオを定義

Step 2: 単体テスト作成（RED）
  ↓ 各関数を個別にテスト

Step 3: 実装（GREEN）
  ↓ 単体テスト → 統合テストの順でパス

Step 4: コミット
```

### なぜ統合テスト → 単体テストの順？

1. **ゴールを明確にする**: 最初に達成すべきユーザーシナリオを定義
2. **受け入れ基準の確認**: 統合テストが仕様の受け入れ基準を表現
3. **実装の方向性**: 単体テストは統合テストを満たすための手段

## 実装方針

### ディレクトリ構成
```
src/lib/utils/
  ├── eventUtils.ts                  # ユーティリティ関数
  ├── types.ts                       # Column型定義
  └── __tests__/
      ├── integration.test.ts        # 統合テスト（先に作成）
      └── eventUtils.test.ts         # 単体テスト
```

### TDDサイクル
1. **RED (統合)**: 統合テストを先に書く（実際のシナリオ）
2. **RED (単体)**: 単体テストを書く（各関数）
3. **GREEN**: 実装してテストをパス（単体 → 統合）
4. **REFACTOR**: リファクタリング
5. **COMMIT**: コミット

## 統合テストシナリオ

統合テストでは、実際のsample/events.mdのデータを使用してユーザーシナリオをテストします。

### シナリオ1: 基本的なマルチカラム表示

**ユーザーストーリー**:
ユーザーが「歴史」と「日本」の2つのタグを選択したとき、それぞれのタグに対応する列が生成され、各列に該当するイベントが年号順に表示される。

**テストコード例**:
```typescript
describe('マルチカラムロジック統合テスト', () => {
  // sample/events.mdのデータを読み込む
  const sampleEvents: Event[] = [
    { id: '1', date: { year: 1543 }, title: '鉄砲伝来', tags: ['歴史', '日本', '貿易'], ... },
    { id: '2', date: { year: 1868 }, title: '明治維新', tags: ['歴史', '日本', '政治'], ... },
    { id: '3', date: { year: 1914 }, title: '第一次世界大戦勃発', tags: ['歴史', '戦争', '世界'], ... },
    { id: '4', date: { year: 1945, month: 8, day: 15 }, title: '終戦記念日', tags: ['歴史', '日本', '第二次世界大戦'], ... },
    { id: '5', date: { year: 1964, month: 10, day: 10 }, title: '東京オリンピック開会', tags: ['スポーツ', '日本', 'オリンピック'], ... },
    // ... 他のイベント
  ];

  it('シナリオ1: ユーザーが「歴史」と「日本」を選択したときに正しい列が生成される', () => {
    const selectedTags = ['歴史', '日本'];
    const columns = createColumns(sampleEvents, selectedTags, 'asc');

    // 2つの列が生成される
    expect(columns).toHaveLength(2);
    expect(columns[0].tag).toBe('歴史');
    expect(columns[1].tag).toBe('日本');

    // 歴史列の検証
    const historyColumn = columns[0];
    expect(historyColumn.events.length).toBeGreaterThan(0);

    const historyTitles = historyColumn.events.map(e => e.title);
    expect(historyTitles).toContain('鉄砲伝来');
    expect(historyTitles).toContain('明治維新');
    expect(historyTitles).toContain('終戦記念日');
    expect(historyTitles).toContain('第一次世界大戦勃発');

    // 年号順にソートされている
    for (let i = 0; i < historyColumn.events.length - 1; i++) {
      const current = historyColumn.events[i].date.year;
      const next = historyColumn.events[i + 1].date.year;
      expect(current).toBeLessThanOrEqual(next);
    }

    // 日本列の検証
    const japanColumn = columns[1];
    const japanTitles = japanColumn.events.map(e => e.title);
    expect(japanTitles).toContain('鉄砲伝来');
    expect(japanTitles).toContain('明治維新');
    expect(japanTitles).toContain('終戦記念日');
    expect(japanTitles).toContain('東京オリンピック開会');

    // 第一次世界大戦は日本タグを持たないので含まれない
    expect(japanTitles).not.toContain('第一次世界大戦勃発');

    // 同じイベントが両方の列に表示される
    const endOfWar = historyColumn.events.find(e => e.title === '終戦記念日');
    const endOfWarInJapan = japanColumn.events.find(e => e.title === '終戦記念日');
    expect(endOfWar).toBeDefined();
    expect(endOfWarInJapan).toBeDefined();
    expect(endOfWar!.id).toBe(endOfWarInJapan!.id);
  });
});
```

### シナリオ2: タグ抽出とソート順

**ユーザーストーリー**:
アプリケーション起動時に、全てのイベントから利用可能なタグ一覧を抽出し、ソート済みで表示する。ユーザーが「新しい順」を選択した場合、各列のイベントが新しい順にソートされる。

**テストコード例**:
```typescript
it('シナリオ2: タグ一覧を抽出し、新しい順でソートできる', () => {
  // 全タグを抽出
  const allTags = extractAllTags(sampleEvents);

  // タグが重複なく抽出される
  expect(allTags.length).toBeGreaterThan(0);
  const uniqueTags = [...new Set(allTags)];
  expect(allTags).toEqual(uniqueTags);

  // ソート済み
  const sortedTags = [...allTags].sort();
  expect(allTags).toEqual(sortedTags);

  // 新しい順でカラム生成
  const columns = createColumns(sampleEvents, ['歴史', '日本'], 'desc');

  // 新しい順にソートされている
  const historyColumn = columns[0];
  for (let i = 0; i < historyColumn.events.length - 1; i++) {
    const current = historyColumn.events[i].date.year;
    const next = historyColumn.events[i + 1].date.year;
    expect(current).toBeGreaterThanOrEqual(next);
  }
});
```

### シナリオ3: エッジケース

**ユーザーストーリー**:
存在しないタグを選択した場合でも、エラーにならず空の列が生成される。

**テストコード例**:
```typescript
it('シナリオ3: 存在しないタグを選択しても正しく動作する', () => {
  const columns = createColumns(sampleEvents, ['存在しないタグ', '歴史'], 'asc');

  expect(columns).toHaveLength(2);

  // 存在しないタグの列は空
  expect(columns[0].tag).toBe('存在しないタグ');
  expect(columns[0].events).toHaveLength(0);

  // 歴史列は正常に生成される
  expect(columns[1].tag).toBe('歴史');
  expect(columns[1].events.length).toBeGreaterThan(0);
});
```

## 単体テストケース例

### extractAllTags
```typescript
describe('extractAllTags', () => {
  it('全イベントから重複なしのタグ一覧を抽出できる', () => {
    const events = [
      { tags: ['歴史', '日本'] },
      { tags: ['スポーツ', '日本'] },
      { tags: ['歴史'] },
    ];
    const tags = extractAllTags(events);
    expect(tags).toEqual(['スポーツ', '日本', '歴史']);
  });

  it('空配列を渡すと空配列を返す', () => {
    expect(extractAllTags([])).toEqual([]);
  });
});
```

### sortEventsByDate
```typescript
describe('sortEventsByDate', () => {
  it('古い順にソートできる', () => {
    const events = [
      { date: { year: 1964 } },
      { date: { year: 1945 } },
    ];
    const sorted = sortEventsByDate(events, 'asc');
    expect(sorted[0].date.year).toBe(1945);
  });

  it('年月日の混在データを正しくソートできる', () => {
    const events = [
      { date: { year: 1945, month: 8, day: 15 } },
      { date: { year: 1945, month: 8, day: 6 } },
      { date: { year: 1945 } },
    ];
    const sorted = sortEventsByDate(events, 'asc');
    expect(sorted[0].date).toEqual({ year: 1945 });
    expect(sorted[1].date).toEqual({ year: 1945, month: 8, day: 6 });
  });
});
```

### createColumns
```typescript
describe('createColumns', () => {
  it('選択タグごとに列を生成する', () => {
    const events = [
      { tags: ['歴史', '日本'], date: { year: 1945 } },
      { tags: ['スポーツ', '日本'], date: { year: 1964 } },
    ];
    const columns = createColumns(events, ['歴史', '日本']);

    expect(columns).toHaveLength(2);
    expect(columns[0].tag).toBe('歴史');
    expect(columns[0].events).toHaveLength(1);
    expect(columns[1].tag).toBe('日本');
    expect(columns[1].events).toHaveLength(2);
  });

  it('同じイベントが複数の列に表示される', () => {
    const events = [
      { id: '1', tags: ['歴史', '日本'], date: { year: 1945 } },
    ];
    const columns = createColumns(events, ['歴史', '日本']);

    expect(columns[0].events[0].id).toBe('1');
    expect(columns[1].events[0].id).toBe('1');
  });
});
```

## 成功基準

### 統合テスト
- [ ] シナリオ1: 基本的なマルチカラム表示が動作する
- [ ] シナリオ2: タグ抽出とソート順が正しく動作する
- [ ] シナリオ3: エッジケースが正しく処理される

### 単体テスト
- [ ] 全ての関数（extractAllTags, sortEventsByDate, filterEventsByTag, createColumns）がカバーされている
- [ ] 全ての受け入れ基準（AC1〜AC5）を満たす
- [ ] テストが全てパスする（GREEN）

### コード品質
- [ ] 型安全性が保たれている（TypeScript）
- [ ] 関数がイミュータブル（副作用なし）
- [ ] コードがシンプルで読みやすい

## 開発の進め方（実践）

1. **統合テスト作成** (`integration.test.ts`)
   - シナリオ1〜3のテストを作成
   - **RED**: 全て失敗することを確認

2. **単体テスト作成** (`eventUtils.test.ts`)
   - 各関数のテストを作成
   - **RED**: 全て失敗することを確認

3. **型定義作成** (`types.ts`)
   - `Column`型を定義

4. **実装** (`eventUtils.ts`)
   - 各関数を実装
   - **GREEN**: 単体テスト → 統合テストの順でパス

5. **コミット**
   - 各ステップごとにコミット

## 次のステップ

このロジック層が完成したら、次のPhase（UI実装）でこれらの関数を使用してマルチカラム表示を実装します。
