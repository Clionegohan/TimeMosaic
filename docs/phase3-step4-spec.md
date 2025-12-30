# Phase 3 Step 4: 検索機能とソート切り替え - 詳細仕様書

## 概要

Phase 3 Step 4では、ユーザーがイベントをキーワードで検索し、表示順序を切り替えられる機能を実装します。

**実装対象**:
- SearchBar コンポーネント
- SortSelector コンポーネント
- デバウンス処理によるパフォーマンス最適化
- クライアント側フィルタリングロジック
- App.tsx への統合

**実装手法**: ATDD (Acceptance Test Driven Development)
- テストファースト開発
- 受け入れ基準に基づくテストケース作成
- RED → GREEN → REFACTOR サイクル

---

## 受け入れ基準 (Acceptance Criteria)

### AC1: SearchBar コンポーネントの実装

**条件**:
- テキスト入力フィールドを提供する
- プレースホルダーは「イベントを検索...」とする
- 入力値が変更されると onChange コールバックが発火する
- 入力値は親コンポーネントから value プロップで制御される（制御コンポーネント）

**検証方法**:
- SearchBar コンポーネントが正しくレンダリングされる
- プレースホルダーテキストが表示される
- ユーザー入力時に onChange が呼ばれる
- value プロップの値が input 要素に反映される

### AC2: SortSelector コンポーネントの実装

**条件**:
- セレクトボックス（ドロップダウン）を提供する
- 選択肢は「古い順」(asc) と「新しい順」(desc) の2つ
- 選択が変更されると onChange コールバックが発火する
- 選択値は親コンポーネントから value プロップで制御される

**検証方法**:
- SortSelector コンポーネントが正しくレンダリングされる
- 2つの選択肢（古い順、新しい順）が表示される
- ユーザー選択時に onChange が呼ばれる
- value プロップの値が select 要素に反映される

### AC3: デバウンス処理の実装

**条件**:
- ユーザーが検索バーに入力した際、300ms の遅延後にフィルタリングが実行される
- 300ms以内に追加入力があった場合、タイマーがリセットされる
- useEffect でデバウンスロジックを実装する
- クリーンアップ関数でタイマーをクリアする

**検証方法**:
- searchKeyword の変更が即座に debouncedKeyword に反映されない
- 300ms 待機後に debouncedKeyword が更新される
- 連続入力時にタイマーがリセットされる

### AC4: クライアント側フィルタリングの実装

**条件**:
- debouncedKeyword が空の場合、全イベントを表示する
- debouncedKeyword が入力されている場合、以下の条件でフィルタリングする:
  - イベントのタイトルにキーワードが含まれる
  - イベントの説明文にキーワードが含まれる
  - イベントのタグのいずれかにキーワードが含まれる
- useMemo を使用してパフォーマンスを最適化する
- フィルタリングは列構造を維持したまま実行される（各列のイベントのみをフィルタ）

**検証方法**:
- キーワードが空の場合、全イベントが表示される
- キーワードがタイトルに一致するイベントのみが表示される
- キーワードが説明文に一致するイベントのみが表示される
- キーワードがタグに一致するイベントのみが表示される
- 一致しないイベントは表示されない

### AC5: App.tsx への統合

**条件**:
- App.tsx に SearchBar と SortSelector を配置する
- searchKeyword と sortOrder の状態を管理する
- デバウンス処理を App.tsx 内で実装する
- フィルタリングされたイベントを MultiColumnView に渡す
- ソート順の変更時に API を再取得する

**検証方法**:
- SearchBar と SortSelector が App.tsx 内に表示される
- 検索入力時にイベントがフィルタリングされる
- ソート順変更時に API が再取得される
- UI が正しく更新される

---

## コンポーネント設計

### 1. SearchBar コンポーネント

#### Props インターフェース

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
```

#### 実装例

```typescript
/**
 * SearchBar
 *
 * イベント検索用のテキスト入力コンポーネント
 */

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="イベントを検索..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
    />
  );
}
```

#### テストケース

1. ✅ SearchBar が正しくレンダリングされる
2. ✅ プレースホルダーテキスト「イベントを検索...」が表示される
3. ✅ ユーザー入力時に onChange コールバックが呼ばれる
4. ✅ value プロップの値が input 要素に反映される

---

### 2. SortSelector コンポーネント

#### Props インターフェース

```typescript
interface SortSelectorProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
}
```

#### 実装例

```typescript
/**
 * SortSelector
 *
 * イベントの並び順を選択するセレクトボックスコンポーネント
 */

interface SortSelectorProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'asc' | 'desc')}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="asc">古い順</option>
      <option value="desc">新しい順</option>
    </select>
  );
}
```

#### テストケース

1. ✅ SortSelector が正しくレンダリングされる
2. ✅ 「古い順」と「新しい順」の選択肢が表示される
3. ✅ ユーザー選択時に onChange コールバックが呼ばれる
4. ✅ value プロップの値が select 要素に反映される
5. ✅ デフォルト値として 'asc' が選択されている場合、「古い順」が選択状態になる

---

## App.tsx への統合

### 状態管理

```typescript
// 検索キーワード
const [searchKeyword, setSearchKeyword] = useState('');
const [debouncedKeyword, setDebouncedKeyword] = useState('');

// ソート順
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
```

### デバウンス処理

```typescript
// デバウンス処理（300ms遅延）
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedKeyword(searchKeyword);
  }, 300);

  // クリーンアップ: 次の入力があった場合、前のタイマーをクリア
  return () => clearTimeout(timer);
}, [searchKeyword]);
```

**デバウンスの仕組み**:
1. ユーザーが検索バーに入力 → `searchKeyword` が即座に更新
2. 300ms待機（その間に追加入力があればタイマーリセット）
3. 300ms経過 → `debouncedKeyword` が更新される
4. `useMemo` が `debouncedKeyword` の変更を検知してフィルタリング実行

### クライアント側フィルタリング

```typescript
// フィルタリングロジック（クライアント側）
const filteredColumns = useMemo(() => {
  if (!debouncedKeyword) return columns;

  return columns.map(column => ({
    ...column,
    events: column.events.filter(event =>
      event.title.includes(debouncedKeyword) ||
      event.description?.includes(debouncedKeyword) ||
      event.tags.some(tag => tag.includes(debouncedKeyword))
    )
  }));
}, [columns, debouncedKeyword]);
```

### ソート順変更時の処理

```typescript
const handleSortChange = (order: 'asc' | 'desc') => {
  setSortOrder(order);
  // API再取得がトリガーされる（fetchEventsがsortOrderに依存）
};
```

### レイアウト配置

```typescript
<div className="min-h-screen bg-gray-50">
  {/* ヘッダー */}
  <header className="bg-white shadow-sm p-4">
    <h1 className="text-2xl font-bold text-gray-900">TimeMosaic</h1>
  </header>

  {/* コントロールエリア */}
  <div className="bg-white border-b p-4 flex gap-4 items-center">
    <SearchBar value={searchKeyword} onChange={setSearchKeyword} />
    <SortSelector value={sortOrder} onChange={handleSortChange} />
  </div>

  {/* タグ選択エリア */}
  <TagSelector
    selectedTags={selectedTags}
    availableTags={availableTags}
    onAddTag={handleAddTag}
    onRemoveTag={handleRemoveTag}
  />

  {/* マルチカラム表示 */}
  {isLoading ? (
    <div className="p-8 text-center">Loading...</div>
  ) : (
    <MultiColumnView columns={filteredColumns} />
  )}
</div>
```

---

## テストケーススキャフォルド

### SearchBar テスト (`src/components/SearchBar/SearchBar.test.tsx`)

```typescript
/**
 * SearchBar - Test
 *
 * 検索バーコンポーネントのテスト
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('SearchBar が正しくレンダリングされる', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('イベントを検索...');
    expect(input).toBeInTheDocument();
  });

  it('プレースホルダーテキストが表示される', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    expect(screen.getByPlaceholderText('イベントを検索...')).toBeInTheDocument();
  });

  it('ユーザー入力時に onChange コールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('イベントを検索...');
    await user.type(input, 'テスト');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('value プロップの値が input 要素に反映される', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="東京" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('イベントを検索...') as HTMLInputElement;
    expect(input.value).toBe('東京');
  });
});
```

### SortSelector テスト (`src/components/SortSelector/SortSelector.test.tsx`)

```typescript
/**
 * SortSelector - Test
 *
 * ソート順選択コンポーネントのテスト
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortSelector } from './SortSelector';

describe('SortSelector', () => {
  it('SortSelector が正しくレンダリングされる', () => {
    const mockOnChange = vi.fn();
    render(<SortSelector value="asc" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('「古い順」と「新しい順」の選択肢が表示される', () => {
    const mockOnChange = vi.fn();
    render(<SortSelector value="asc" onChange={mockOnChange} />);

    expect(screen.getByText('古い順')).toBeInTheDocument();
    expect(screen.getByText('新しい順')).toBeInTheDocument();
  });

  it('ユーザー選択時に onChange コールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<SortSelector value="asc" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'desc');

    expect(mockOnChange).toHaveBeenCalledWith('desc');
  });

  it('value プロップの値が select 要素に反映される', () => {
    const mockOnChange = vi.fn();
    render(<SortSelector value="desc" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('desc');
  });

  it('デフォルト値として "asc" が選択されている場合、「古い順」が選択状態になる', () => {
    const mockOnChange = vi.fn();
    render(<SortSelector value="asc" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('asc');

    const selectedOption = screen.getByRole('option', { name: '古い順' }) as HTMLOptionElement;
    expect(selectedOption.selected).toBe(true);
  });
});
```

---

## 実装チェックリスト

### Phase 1: SearchBar コンポーネント (ATDD)

- [ ] `src/components/SearchBar/SearchBar.test.tsx` 作成
  - [ ] レンダリングテスト
  - [ ] プレースホルダーテスト
  - [ ] onChange コールバックテスト
  - [ ] value プロップ反映テスト
- [ ] テスト実行 → RED 確認
- [ ] `src/components/SearchBar/SearchBar.tsx` 実装
  - [ ] Props インターフェース定義
  - [ ] input 要素作成
  - [ ] Tailwind CSS スタイリング
- [ ] テスト実行 → GREEN 確認
- [ ] リファクタリング（必要に応じて）

### Phase 2: SortSelector コンポーネント (ATDD)

- [ ] `src/components/SortSelector/SortSelector.test.tsx` 作成
  - [ ] レンダリングテスト
  - [ ] 選択肢表示テスト
  - [ ] onChange コールバックテスト
  - [ ] value プロップ反映テスト
  - [ ] デフォルト値テスト
- [ ] テスト実行 → RED 確認
- [ ] `src/components/SortSelector/SortSelector.tsx` 実装
  - [ ] Props インターフェース定義
  - [ ] select 要素作成
  - [ ] option 要素作成
  - [ ] Tailwind CSS スタイリング
- [ ] テスト実行 → GREEN 確認
- [ ] リファクタリング（必要に応じて）

### Phase 3: App.tsx への統合

- [ ] `src/App.tsx` 修正
  - [ ] SearchBar と SortSelector のインポート
  - [ ] searchKeyword, debouncedKeyword, sortOrder の状態追加
  - [ ] デバウンス処理の useEffect 追加
  - [ ] filteredColumns の useMemo 追加
  - [ ] handleSortChange ハンドラー追加
  - [ ] コントロールエリアのレイアウト追加
  - [ ] MultiColumnView に filteredColumns を渡す
- [ ] `src/hooks/useEvents.ts` 修正（sortOrder 対応）
  - [ ] sortOrder パラメータを API クエリに追加
  - [ ] useEffect 依存配列に sortOrder を追加

### Phase 4: テストと検証

- [ ] 全テスト実行 → すべて PASS 確認
- [ ] 手動テスト
  - [ ] 検索バーに入力してイベントがフィルタされることを確認
  - [ ] 300ms デバウンスが動作することを確認
  - [ ] タイトル検索が機能することを確認
  - [ ] 説明文検索が機能することを確認
  - [ ] タグ検索が機能することを確認
  - [ ] ソート順切り替えが動作することを確認
  - [ ] 古い順 → 新しい順の切り替え確認
  - [ ] 新しい順 → 古い順の切り替え確認
- [ ] パフォーマンス確認
  - [ ] 大量イベント（100件以上）でもスムーズに動作
  - [ ] デバウンスにより入力中の負荷が軽減されている

---

## パフォーマンス考慮事項

### デバウンスの効果

**デバウンスなし**:
- ❌ 1文字入力ごとにフィルタ実行（例: "東京" で2回）
- ❌ 高頻度な再レンダリング
- ❌ CPU負荷増加

**デバウンスあり（300ms）**:
- ✅ 入力完了後に1回だけフィルタ実行
- ✅ 再レンダリング回数削減
- ✅ CPU負荷軽減

### useMemo の効果

```typescript
// ❌ useMemoなし: columns または debouncedKeyword が変わるたびに毎回再計算
const filteredColumns = columns.map(column => ({
  ...column,
  events: column.events.filter(event => /* ... */)
}));

// ✅ useMemoあり: 依存配列の値が変わった時のみ再計算
const filteredColumns = useMemo(() => {
  return columns.map(column => ({
    ...column,
    events: column.events.filter(event => /* ... */)
  }));
}, [columns, debouncedKeyword]);
```

---

## 将来的な改善（Phase 3 Step 4 では実装しない）

以下の機能は Phase 3 Step 4 のスコープ外です。将来のフェーズで検討します。

### 優先度: Medium

- [ ] **大文字小文字を区別しない検索**
  ```typescript
  event.title.toLowerCase().includes(debouncedKeyword.toLowerCase())
  ```

- [ ] **正規表現対応**
  ```typescript
  const regex = new RegExp(debouncedKeyword, 'i');
  regex.test(event.title)
  ```

- [ ] **Fuzzy検索（あいまい検索）**
  - Levenshtein距離を使用した類似度計算
  - fuzzysort ライブラリの導入

- [ ] **検索キーワードのハイライト表示**
  - マッチした部分を背景色で強調
  - `<mark>` タグまたは CSS クラスで実装

### 優先度: Low

- [ ] **検索履歴の保存**
  - localStorage に最近の検索を保存
  - ドロップダウンで履歴表示

- [ ] **AND/OR 検索**
  - スペース区切りで複数キーワード対応
  - 全て含む（AND）または いずれか含む（OR）

---

## 成功基準

Phase 3 Step 4 完了時に以下が達成されていること:

1. ✅ SearchBar コンポーネントが実装されている
2. ✅ SortSelector コンポーネントが実装されている
3. ✅ 検索バーに入力するとイベントがフィルタリングされる
4. ✅ 300ms デバウンスが動作している
5. ✅ タイトル、説明文、タグでの検索がすべて機能する
6. ✅ ソート順の切り替えが動作する
7. ✅ 全テストがパスしている（SearchBar: 4 tests, SortSelector: 5 tests）
8. ✅ パフォーマンスが良好（大量イベントでもスムーズ）
9. ✅ UI/UX が直感的でわかりやすい

---

## 関連ドキュメント

- `docs/frontend-spec.md` - フロントエンド全体仕様
- `docs/phase3-step1-spec.md` - TagSelector 実装仕様
- `docs/phase3-step2-spec.md` - MultiColumnView 実装仕様
- `docs/phase3-step3-spec.md` - EventCard/Modal 実装仕様

---

**更新履歴**:
- 2025-XX-XX: Phase 3 Step 4 仕様書初版作成
