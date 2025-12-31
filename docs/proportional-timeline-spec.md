# 比例タイムライン表示機能 仕様書

## 概要

タイムラインを一本の縦線として表示し、イベントがある年だけをマーカーとして配置する。
年と年の間隔は実際の年数差に比例させる。

**デザインコンセプト:**
```
Timeline列          タグ列
┌─────────┐       ┌─────────┐
│Timeline │       │  科学   │
├─────────┤       ├─────────┤
│ 1965 ━━━│━━━━━━▶│イベント │
│    │    │       ├─────────┤
│    │    │       │         │
│    │    │  (19年分の空間)
│    │    │       │         │
│ 1984 ━━━│━━━━━━▶│イベント │
│    │    │       ├─────────┤
│    │    │  (6年分の空間)
│ 1990 ━━━│━━━━━━▶│イベント │
└─────────┘       └─────────┘
```

---

## 受入基準（Acceptance Criteria）

### AC1: 一本の縦線タイムラインが表示される

**Given**: タグを1つ以上選択している

**When**: MultiColumnViewを表示する

**Then**:
- Timeline列に縦の線（border-left または div要素）が表示される
- 線は上から下まで連続している

### AC2: イベントがある年だけが表示される

**Given**: 選択したタグに以下の年のイベントがある
- 1965年
- 1984年
- 1990年

**When**: Timeline列を確認する

**Then**:
- 1965, 1984, 1990のみが年ラベルとして表示される
- 1966-1983, 1985-1989は表示されない（線のみ）

### AC3: 年間隔が実際の年数に比例している

**Given**: 以下の年がタイムラインに表示されている
- 1965年
- 1984年（1965から19年後）
- 1990年（1984から6年後）

**When**: Timeline列の各年の位置を確認する

**Then**:
- 1965と1984の間の距離が、1984と1990の間の距離の約3倍（19÷6≈3.17）である
- CSS の `position: absolute` + `top` または `margin-top` で比例配置されている

### AC4: イベントカードが年と横並びに配置される

**Given**: 1984年にイベントが1つある

**When**: MultiColumnViewを表示する

**Then**:
- Timeline列の「1984」ラベルとイベントカードが同じ高さに配置される
- 水平線または矢印でタイムラインとイベントが視覚的に結ばれている

### AC5: 最小間隔が確保されている

**Given**: 連続する年（2020, 2021）にイベントがある

**When**: Timeline列を表示する

**Then**:
- 1年差でも最低80pxの間隔が確保されている
- イベントカードが重ならない

---

## 技術仕様

### 1. デザイン変更のポイント

#### 現在の実装（Grid方式）
- CSS Grid で行ごとに年を配置
- すべての年が行として存在
- `gridTemplateRows` で等間隔

#### 新しい実装（Absolute方式）
- Timeline列は `position: relative` のコンテナ
- 各年は `position: absolute` で縦方向に配置
- `top` の値を年数差に基づいて計算

### 2. Timeline列の構造

```tsx
<div className="relative min-h-screen border-r bg-gray-50" style={{ width: '120px' }}>
  {/* ヘッダー */}
  <div className="p-4 font-semibold text-gray-700 border-b bg-gray-50">
    Timeline
  </div>

  {/* 縦線 */}
  <div
    className="absolute left-1/2 border-l-2 border-gray-300"
    style={{
      top: '60px',
      bottom: '0',
      transform: 'translateX(-50%)'
    }}
  />

  {/* 年マーカー */}
  {years.map((year, index) => {
    const topPosition = calculateYearPosition(year, years, index);
    return (
      <div
        key={year}
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{ top: `${topPosition}px` }}
      >
        <div className="bg-white border-2 border-gray-300 rounded-full px-3 py-1 font-bold text-gray-800">
          {year}
        </div>
        {/* 水平線（タイムラインからイベントへの矢印） */}
        <div className="absolute left-full w-4 border-t-2 border-gray-300" />
      </div>
    );
  })}
</div>
```

### 3. 年位置の計算ロジック

```tsx
const PIXELS_PER_YEAR = 10; // 1年あたり10px
const MIN_YEAR_SPACING = 80; // 最小年間隔（px）
const HEADER_HEIGHT = 60; // ヘッダー高さ

function calculateYearPosition(
  year: number,
  allYears: number[],
  index: number
): number {
  if (index === 0) {
    // 最初の年はヘッダー直下
    return HEADER_HEIGHT + MIN_YEAR_SPACING / 2;
  }

  const previousYear = allYears[index - 1];
  const yearDiff = Math.abs(year - previousYear);
  const spacing = Math.max(yearDiff * PIXELS_PER_YEAR, MIN_YEAR_SPACING);

  // 前の年の位置 + 間隔
  const previousPosition = calculateYearPosition(previousYear, allYears, index - 1);
  return previousPosition + spacing;
}

// または累積方式
function calculateAllYearPositions(years: number[]): number[] {
  const positions: number[] = [];
  let currentTop = HEADER_HEIGHT + MIN_YEAR_SPACING / 2;

  for (let i = 0; i < years.length; i++) {
    positions.push(currentTop);

    if (i < years.length - 1) {
      const yearDiff = Math.abs(years[i + 1] - years[i]);
      const spacing = Math.max(yearDiff * PIXELS_PER_YEAR, MIN_YEAR_SPACING);
      currentTop += spacing;
    }
  }

  return positions;
}
```

### 4. タグ列の対応

タグ列も同様に `position: absolute` でイベントを配置する必要がある。

```tsx
// TagColumn.tsx
{column.events.map((event) => {
  const yearIndex = years.indexOf(event.year);
  const topPosition = yearPositions[yearIndex];

  return (
    <div
      key={event.id}
      className="absolute left-0 right-0 px-2"
      style={{ top: `${topPosition - 30}px` }} // 年ラベルの中心に合わせる
    >
      <EventCard event={event} />
    </div>
  );
})}
```

### 5. 定数

| 定数名 | 値 | 説明 |
|--------|-----|------|
| `PIXELS_PER_YEAR` | 10 | 1年あたりのピクセル数 |
| `MIN_YEAR_SPACING` | 80 | 最小年間隔（px） |
| `HEADER_HEIGHT` | 60 | ヘッダー行の高さ（固定） |
| `YEAR_MARKER_HEIGHT` | 32 | 年マーカーの高さ |

---

## 実装手順

### Step 1: 仕様書のコミット
- [x] `docs/proportional-timeline-spec.md` を作成
- [ ] コミット: `docs: 比例タイムライン表示の仕様書を追加`

### Step 2: 年位置計算ユーティリティの作成
- [ ] `src/lib/utils/timeline.ts` を作成
- [ ] `calculateYearPositions(years: number[]): number[]` 関数を実装
- [ ] コミット: `feat: タイムライン年位置計算ユーティリティを追加`

### Step 3: TimelineColumn の書き直し
- [ ] `src/components/TimelineColumn/TimelineColumn.tsx` を開く
- [ ] Grid方式 → Absolute方式に変更
- [ ] 縦線、年マーカー、水平線を実装
- [ ] コミット: `feat: TimelineColumnを一本線の比例表示に変更`

### Step 4: TagColumn の調整
- [ ] `src/components/TagColumn/TagColumn.tsx` を開く
- [ ] イベントカードを `position: absolute` で配置
- [ ] `yearPositions` を props で受け取る
- [ ] コミット: `feat: TagColumnを絶対配置に対応`

### Step 5: MultiColumnView の調整
- [ ] `src/components/MultiColumnView/MultiColumnView.tsx` を開く
- [ ] Grid レイアウト → Flexbox または relative コンテナに変更
- [ ] `yearPositions` を計算して子コンポーネントに渡す
- [ ] コミット: `refactor: MultiColumnViewのレイアウトを調整`

### Step 6: テスト実施
- [ ] 手動テストをすべて実施
- [ ] 問題があれば修正
- [ ] コミット: `fix: [問題内容]`

### Step 7: スタイリング調整
- [ ] 縦線の色、太さ調整
- [ ] 年マーカーのデザイン調整
- [ ] コミット: `style: タイムラインのビジュアル調整`

### Step 8: PR作成
- [ ] ブランチをプッシュ
- [ ] PRを作成

---

## 手動テスト手順

### テスト1: 基本的な比例間隔

1. タグ「科学」を選択
2. Timeline列を確認
   - 縦線が上から下まで表示されている
   - イベントがある年だけがマーカーで表示されている
3. 年の間隔を目視で確認
   - 19年間の間隔が6年間の間隔より明らかに広い

### テスト2: イベントとの横並び

1. 任意のタグを選択
2. 年マーカーとイベントカードが横並びになっていることを確認
3. 水平線または矢印で視覚的に結ばれていることを確認

### テスト3: 最小間隔

1. 連続した年を持つタグを選択（例: 2020, 2021, 2022）
2. 各年の間隔が最低80px確保されていることを確認
3. イベントカードが重なっていないことを確認

### テスト4: ソート順

1. 昇順（asc）で表示
2. 降順（desc）に切り替え
3. どちらでも正しく比例間隔で表示されることを確認

### テスト5: 複数タグ

1. 2つ以上のタグを選択
2. すべてのタグ列のイベントが正しい年の高さに配置されていることを確認

---

## 成功基準

- [ ] 一本の縦線タイムラインが表示される
- [ ] イベントがある年だけが表示される
- [ ] 年間隔が実際の年数に比例している
- [ ] イベントカードが年と横並びに配置される
- [ ] 最小間隔（80px）が確保されている
- [ ] ソート順（asc/desc）で正しく動作する
- [ ] すべての手動テストが合格

---

## 注意事項

### レイアウト方式の変更
- CSS Grid → `position: absolute` への大きな変更
- 各コンポーネントの props インターフェースが変わる可能性

### スクロール
- 年数が非常に離れている場合、縦スクロールが長くなる
- `overflow-y: auto` で対応

### パフォーマンス
- 年位置の計算は `useMemo` でキャッシュ
- `timelineYears` が変更されない限り再計算されない

### アクセシビリティ
- 年マーカーは十分なコントラストとサイズを確保
- タイムラインの構造は意味的に正しい（年リスト）

---

## 参考リソース

- [CSS Position - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [Timeline Design Patterns](https://csslayout.io/patterns/timeline/)
