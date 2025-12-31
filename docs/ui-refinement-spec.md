# TimeMosaic - UI 洗練仕様書（Cinematic Dark Theme）

## 概要

このドキュメントは、MVPとして完成したTimeMosaicのUIを**シネマティック・ダークテーマ**で洗練させるための仕様書です。
`TimeMosaicUISpec.png`を参考デザインとし、宇宙の歴史を見つめてきたような壮大でスタイリッシュなUIを実現します。

**対象フェーズ**: Phase 6 - UI Refinement
**前提**: Phase 3, Phase 5 完了（全MVP機能実装済み）
**参考デザイン**: `docs/TimeMosaicUISpec.png`

---

## デザインコンセプト

### コアアイデア

**"歴史を見つめてきた宇宙"**

- **中央に光る金色のタイムライン**: 時間の流れを象徴する垂直の軸
- **星空背景**: 歴史を見守ってきた宇宙の広がり
- **カテゴリー別の色分けカード**: 半透明で背景が透ける、浮遊感のあるデザイン
- **左右対称の配置**: 2カラムの場合はタイムラインを中心に左右に配置

### デザイン原則

1. **スタイリッシュさ (Stylish)**: 映画的な世界観、洗練された配色とタイポグラフィ
2. **壮大さ (Epic)**: 宇宙と歴史のスケール感を視覚的に表現
3. **視認性 (Visibility)**: ダークテーマでも読みやすいコントラストと階層
4. **没入感 (Immersive)**: 背景エフェクト、グロー、アニメーションで引き込む
5. **一貫性 (Consistency)**: 色、間隔、エフェクトを統一

---

## デザインシステム

### カラーパレット（Cinematic Dark）

```css
:root {
  /* ===== 背景色 ===== */
  --bg-space: #0B1120;              /* 宇宙の深い青黒 */
  --bg-nebula: rgba(30, 60, 114, 0.3); /* 青いオーロラ/星雲 */

  /* ===== タイムライン ===== */
  --timeline-gold: #F4C542;         /* 金色（メイン） */
  --timeline-gold-dark: #D4A574;    /* 金色（暗め） */
  --timeline-glow: rgba(244, 197, 66, 0.5); /* グロー効果 */

  /* ===== イベントカードカテゴリー色 ===== */
  /* Conflict（戦争、紛争） */
  --card-conflict-bg: rgba(107, 56, 56, 0.75);
  --card-conflict-border: rgba(180, 100, 100, 0.3);
  --card-conflict-glow: rgba(180, 100, 100, 0.2);

  /* Discovery（発見、科学） */
  --card-discovery-bg: rgba(45, 74, 107, 0.75);
  --card-discovery-border: rgba(70, 120, 170, 0.3);
  --card-discovery-glow: rgba(70, 120, 170, 0.2);

  /* Culture/Art（文化、芸術） */
  --card-culture-bg: rgba(90, 74, 58, 0.75);
  --card-culture-border: rgba(140, 120, 90, 0.3);
  --card-culture-glow: rgba(140, 120, 90, 0.2);

  /* General（一般） */
  --card-general-bg: rgba(70, 60, 50, 0.75);
  --card-general-border: rgba(110, 95, 80, 0.3);
  --card-general-glow: rgba(110, 95, 80, 0.2);

  /* Politics（政治） */
  --card-politics-bg: rgba(80, 60, 90, 0.75);
  --card-politics-border: rgba(130, 100, 150, 0.3);
  --card-politics-glow: rgba(130, 100, 150, 0.2);

  /* ===== テキスト色 ===== */
  --text-primary: #FFFFFF;              /* タイトル */
  --text-secondary: rgba(255, 255, 255, 0.8);  /* サブタイトル */
  --text-tertiary: rgba(255, 255, 255, 0.5);   /* タグ、補足情報 */

  /* ===== UI要素 ===== */
  --ui-overlay: rgba(15, 20, 30, 0.95);  /* ヘッダー背景 */
  --ui-border: rgba(255, 255, 255, 0.05); /* 薄いボーダー */
  --ui-highlight: rgba(255, 255, 255, 0.1); /* カード上部ハイライト */
}
```

### Tailwind CSS対応

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 背景
        space: '#0B1120',
        nebula: 'rgba(30, 60, 114, 0.3)',

        // タイムライン
        timeline: {
          gold: '#F4C542',
          'gold-dark': '#D4A574',
        },

        // カードカテゴリー
        card: {
          conflict: {
            DEFAULT: 'rgba(107, 56, 56, 0.75)',
            border: 'rgba(180, 100, 100, 0.3)',
          },
          discovery: {
            DEFAULT: 'rgba(45, 74, 107, 0.75)',
            border: 'rgba(70, 120, 170, 0.3)',
          },
          culture: {
            DEFAULT: 'rgba(90, 74, 58, 0.75)',
            border: 'rgba(140, 120, 90, 0.3)',
          },
          general: {
            DEFAULT: 'rgba(70, 60, 50, 0.75)',
            border: 'rgba(110, 95, 80, 0.3)',
          },
          politics: {
            DEFAULT: 'rgba(80, 60, 90, 0.75)',
            border: 'rgba(130, 100, 150, 0.3)',
          },
        },
      },

      backdropBlur: {
        xs: '2px',
      },

      boxShadow: {
        'timeline-glow': '0 0 20px rgba(244, 197, 66, 0.5)',
        'card-glow': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
  },
};
```

### タイポグラフィ

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### スペーシングシステム

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### シャドウとエレベーション

```css
:root {
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;
}
```

### トランジション

```css
:root {
  /* Duration */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;

  /* Easing */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 星空背景の実装

### 方法1: CSS Background（軽量・推奨）

```css
.space-background {
  position: fixed;
  inset: 0;
  background-color: #0B1120;
  background-image:
    /* 大きな星 */
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 60%, white, transparent),
    radial-gradient(1px 1px at 33% 80%, white, transparent),
    radial-gradient(1px 1px at 70% 40%, white, transparent),
    /* 小さな星（多数） */
    radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(1px 1px at 40% 60%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(1px 1px at 75% 25%, rgba(255, 255, 255, 0.3), transparent);
  background-size: 200% 200%;
  background-position: 0% 0%;
  animation: starTwinkle 100s linear infinite;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* オーロラ/星雲エフェクト */
.nebula-effect {
  position: absolute;
  top: 20%;
  left: 30%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(30, 60, 114, 0.3) 0%,
    transparent 70%
  );
  filter: blur(100px);
  pointer-events: none;
}
```

### 方法2: Canvas（高度な表現）

将来的により動的な星空を実装する場合に検討。
ランダムな星の配置、キラキラアニメーション、流れ星などが可能。

---

## レイアウト戦略

### 全体構成

```
┌──────────────────────────────────────────────────────────┐
│  TimeMosaic                         [検索] [並び順]       │ ← ヘッダー
│  [選択タグ: #日本 ×] [#西洋美術 ×]  [利用可能なタグ...]  │ ← コントロール
├──────────────────────────────────────────────────────────┤
│                                                          │
│                  ┌── 金色タイムライン ──┐                 │
│                  │        ●           │                 │
│   [イベント]  ───┤        │           ├───  [イベント]   │
│                  │        ●           │                 │
│                  │        │           │                 │
│   [イベント]  ───┤        ●           │                 │
│                  │        │           ├───  [イベント]   │
│                  │        ●           │                 │
│                  └────────────────────┘                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 中央タイムライン

**実装:**
```tsx
<div className="timeline-container">
  {/* 金色の縦線 */}
  <div className="
    absolute left-1/2 -translate-x-1/2
    w-1 h-full
    bg-gradient-to-b from-timeline-gold-dark via-timeline-gold to-timeline-gold-dark
    shadow-timeline-glow
  " />

  {/* 年ノード */}
  {years.map((year, index) => (
    <div
      key={year}
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: `${calculateYearPosition(year)}px` }}
    >
      {/* ノード（光る円） */}
      <div className="
        w-4 h-4 rounded-full
        bg-timeline-gold
        border-2 border-space
        shadow-[0_0_10px_rgba(244,197,66,0.8),0_0_20px_rgba(244,197,66,0.5)]
      " />
    </div>
  ))}
</div>
```

### カラム配置戦略

#### ケース1: 1カラム

```
┌─────────────────────────┐
│      タイムライン        │
│          ●              │
│          │              │
│          ● ─── [カード]  │
│          │              │
│          ● ─── [カード]  │
│          │              │
└─────────────────────────┘
```

タイムラインを左寄せ、カードを右側に配置。

#### ケース2: 2カラム（左右対称・推奨）

```
┌────────────────────────────────┐
│  [カード] ───●                 │
│             │                  │
│             ●─── [カード]      │
│             │                  │
│  [カード] ───●                 │
│             │                  │
│             ●─── [カード]      │
└────────────────────────────────┘
```

タイムラインを中央に配置、奇数イベントを左、偶数イベントを右に交互配置。

**実装:**
```tsx
{columns.map((column, colIndex) => (
  <div
    key={column.tag}
    className={`
      absolute
      ${colIndex === 0 ? 'right-1/2 pr-12' : 'left-1/2 pl-12'}
      w-[400px]
    `}
  >
    {column.events.map((event, eventIndex) => {
      const side = eventIndex % 2 === 0 ? 'left' : 'right';
      const shouldShow = (colIndex === 0 && side === 'left') ||
                        (colIndex === 1 && side === 'right');

      return shouldShow && (
        <EventCard
          key={event.id}
          event={event}
          style={{ top: `${calculateYearPosition(event.date.year)}px` }}
        />
      );
    })}
  </div>
))}
```

#### ケース3: 3カラム以上（要検討）

**戦略A: 中央タイムライン + 横スクロール**

```
┌────────────┬──────────┬──────────┬──────────┐
│  [カード1] │   ●      │ [カード2]│[カード3] │ → スクロール
│            │   │      │          │          │
│  [カード1] │   ●      │ [カード2]│          │
│            │   │      │          │[カード3] │
└────────────┴──────────┴──────────┴──────────┘
```

タイムラインを固定位置（例: 左から30%の位置）に配置し、
カラムを横スクロール可能にする。

**戦略B: タイムラインを左端に固定 + 横スクロール**

```
┌──────┬────────┬────────┬────────┐
│  ●   │[カード1]│[カード2]│[カード3]│ → スクロール
│  │   │        │        │        │
│  ●   │[カード1]│[カード2]│        │
│  │   │        │        │[カード3]│
└──────┴────────┴────────┴────────┘
```

タイムラインを左端に固定（sticky）、カラムを横スクロール。
シンプルで実装しやすい。

**推奨**: 戦略B（左端固定）
- 実装が単純
- Timeline列が常に見える
- 3カラム以上でも破綻しない

---

## コンポーネント別UI仕様

### 1. Header（ヘッダー）

**改善版（シンプル・ダーク）:**
```tsx
<header className="bg-space/95 backdrop-blur-md border-b border-white/5 shadow-lg">
  <div className="max-w-7xl mx-auto py-6 px-6">
    <h1 className="text-4xl font-bold text-white tracking-tight">
      TimeMosaic
    </h1>
    <p className="mt-2 text-white/60 text-sm">
      歴史的出来事を時系列で可視化するタイムラインビューア
    </p>
  </div>
</header>
```

**デザインポイント:**
- 宇宙背景と調和する半透明ダークヘッダー
- シンプルで邪魔にならないデザイン
- タイムラインが主役になるよう控えめに

---

### 2. コントロールエリア（検索バー + ソート）

**改善版:**
```tsx
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  <div className="flex flex-col sm:flex-row gap-4">
    {/* 検索バー */}
    <div className="flex-1">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
        キーワード検索
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="search"
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="イベントを検索..."
          className="
            block w-full pl-10 pr-3 py-3
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            placeholder:text-gray-400
          "
        />
        {searchKeyword && (
          <button
            onClick={() => setSearchKeyword('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="検索をクリア"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>

    {/* ソートセレクター */}
    <div className="sm:w-48">
      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
        並び順
      </label>
      <select
        id="sort"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        className="
          block w-full px-4 py-3
          border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          bg-white
        "
      >
        <option value="asc">古い順 ↑</option>
        <option value="desc">新しい順 ↓</option>
      </select>
    </div>
  </div>

  {/* 検索結果表示（オプション） */}
  {debouncedKeyword && (
    <div className="mt-4 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
      <p className="text-sm text-primary-800">
        「<span className="font-semibold">{debouncedKeyword}</span>」で検索中...
      </p>
    </div>
  )}
</div>
```

**デザインポイント:**
- ラベル追加で何のコントロールか明確に
- 検索アイコンの追加
- クリアボタンの追加（UX改善）
- フォーカス時のリング効果
- 検索中の状態表示

---

### 3. TagSelector（タグ選択UI）

**改善版:**
```tsx
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">
    タグ選択
  </h2>

  {/* 選択済みタグ */}
  <div className="mb-6">
    <h3 className="text-sm font-medium text-gray-700 mb-3">
      選択中のタグ
      <span className="ml-2 text-xs text-gray-500">
        ({selectedTags.length}/5)
      </span>
    </h3>

    {selectedTags.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onRemoveTag(tag)}
            className="
              inline-flex items-center gap-2 px-4 py-2
              bg-primary-100 hover:bg-primary-200
              text-primary-800 font-medium
              rounded-lg
              transition-all duration-200
              border border-primary-300
              group
            "
            aria-label={`${tag}を削除`}
          >
            <span>#{tag}</span>
            <svg
              className="w-4 h-4 text-primary-600 group-hover:text-primary-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500 italic">
        下のタグ一覧から選択してください
      </p>
    )}
  </div>

  {/* 利用可能なタグ */}
  <div>
    <h3 className="text-sm font-medium text-gray-700 mb-3">
      利用可能なタグ
    </h3>

    {loading ? (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    ) : error ? (
      <div className="px-4 py-3 bg-error-50 border border-error-200 rounded-lg">
        <p className="text-sm text-error-800">エラー: {error}</p>
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            disabled={selectedTags.length >= 5}
            className="
              px-4 py-2
              bg-gray-100 hover:bg-gray-200
              text-gray-700 font-medium
              rounded-lg
              transition-all duration-200
              border border-gray-300
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-sm
            "
            aria-label={`${tag}を選択`}
          >
            #{tag}
          </button>
        ))}
      </div>
    )}

    {selectedTags.length >= 5 && (
      <div className="mt-4 px-4 py-3 bg-warning-50 border border-warning-200 rounded-lg">
        <p className="text-sm text-warning-800">
          最大5つまで選択できます。追加するには、選択済みのタグを削除してください。
        </p>
      </div>
    )}
  </div>
</div>
```

**デザインポイント:**
- セクション見出しで情報階層を明確化
- 選択数の表示（5/5）
- ローディング状態とエラー状態の表示
- 選択済みタグと利用可能なタグの視覚的区別
- 削除ボタンのホバー効果
- 最大数到達時の警告表示

---

### 4. EventCard（イベントカード - Cinematic Dark）

**カテゴリーマッピング:**
```typescript
// タグからカテゴリーを推定する関数
function getCardCategory(tags: string[]): 'conflict' | 'discovery' | 'culture' | 'politics' | 'general' {
  // タグに基づいてカテゴリーを判定
  if (tags.some(tag => ['戦争', '紛争', '軍事'].includes(tag))) return 'conflict';
  if (tags.some(tag => ['科学', '発見', '発明', '宇宙'].includes(tag))) return 'discovery';
  if (tags.some(tag => ['芸術', '文化', '美術', '音楽'].includes(tag))) return 'culture';
  if (tags.some(tag => ['政治', '革命', '独立'].includes(tag))) return 'politics';
  return 'general';
}
```

**改善版（画像なし・カテゴリー色分け）:**
```tsx
const category = getCardCategory(event.tags);

<div
  className="
    group relative
    w-[280px] rounded-xl
    p-5
    cursor-pointer
    backdrop-blur-md
    transition-all duration-300
    hover:scale-105
  "
  style={{
    background: `var(--card-${category}-bg)`,
    border: `1px solid var(--card-${category}-border)`,
    boxShadow: 'var(--shadow-card-glow), var(--shadow-card-inner)',
  }}
  onClick={() => setShowModal(true)}
>
  {/* グロー効果（ホバー時） */}
  <div className="
    absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
    transition-opacity duration-300
    pointer-events-none
  " style={{
    boxShadow: `0 0 30px var(--card-${category}-glow)`,
  }} />

  {/* タイトル */}
  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
    {event.title}
  </h3>

  {/* サブタイトル（年月日） */}
  {event.description && (
    <p className="text-base text-white/80 mb-3 line-clamp-1">
      {event.description.split('\n')[0].slice(0, 30)}...
    </p>
  )}

  {/* タグ/カテゴリー */}
  <div className="flex flex-wrap gap-1.5">
    {event.tags.slice(0, 3).map((tag) => (
      <span
        key={tag}
        className="
          text-xs font-normal text-white/50
          uppercase tracking-wide
        "
      >
        {tag}
      </span>
    ))}
  </div>
</div>
```

**デザインポイント:**
- **半透明背景**: `backdrop-filter: blur(10px)` で背後の星空が透ける
- **カテゴリー別色分け**: タグに基づいて自動的に色を変更
- **グロー効果**: ホバー時にカードの周りが光る
- **スケールアップ**: ホバー時に1.05倍に拡大
- **テキスト階層**: タイトル（白）、サブタイトル（80%白）、タグ（50%白）

**画像対応（将来のTODO）:**
```tsx
{/* TODO: Phase 7以降で実装 */}
{/*
{event.imageUrl && (
  <img
    src={event.imageUrl}
    alt={event.title}
    className="
      absolute top-5 right-5
      w-16 h-16 rounded-lg object-cover
      border border-white/20
    "
    loading="lazy"
  />
)}
*/}
```

---

### 5. EventDetailModal（詳細モーダル）

**改善版:**
```tsx
<div
  className="
    fixed inset-0 z-50
    bg-gray-900/50 backdrop-blur-sm
    flex items-center justify-center p-4
    animate-fadeIn
  "
  onClick={onClose}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <div
    className="
      bg-white rounded-2xl shadow-2xl
      max-w-2xl w-full max-h-[90vh]
      overflow-hidden
      animate-slideUp
    "
    onClick={(e) => e.stopPropagation()}
  >
    {/* ヘッダー */}
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">
            {event.title}
          </h2>
          <div className="flex items-center gap-2 text-primary-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={formatDateISO(event.date)}>
              {formatDate(event.date)}
            </time>
          </div>
        </div>

        <button
          onClick={onClose}
          className="
            ml-4 p-2 rounded-lg
            text-white/80 hover:text-white
            hover:bg-white/10
            transition-colors duration-200
          "
          aria-label="閉じる"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    {/* コンテンツ */}
    <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
      {/* タグ */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">タグ</h3>
        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="
                inline-block px-3 py-1.5
                bg-primary-100 text-primary-800
                border border-primary-300
                rounded-lg text-sm font-medium
              "
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 説明文 */}
      {event.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">詳細</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      )}

      {event.description === undefined && (
        <p className="text-gray-500 italic">説明文はありません</p>
      )}
    </div>

    {/* フッター */}
    <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
      <button
        onClick={onClose}
        className="
          px-6 py-2.5
          bg-gray-200 hover:bg-gray-300
          text-gray-800 font-medium
          rounded-lg
          transition-colors duration-200
        "
      >
        閉じる
      </button>
    </div>
  </div>
</div>
```

**アニメーション（Tailwind設定に追加）:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out',
        slideUp: 'slideUp 300ms ease-out',
      },
    },
  },
};
```

**デザインポイント:**
- グラデーションヘッダーで視覚的インパクト
- バックドロップブラー効果
- スライドアップアニメーション
- セクション分け（タグ、詳細）
- スクロール可能なコンテンツエリア

---

### 6. TimelineColumn（タイムライン列）

**改善版:**
```tsx
<div className="
  sticky left-0 z-10
  bg-gradient-to-b from-gray-50 to-gray-100
  border-r-2 border-gray-300
  min-w-[120px]
">
  {/* ヘッダー */}
  <div className="
    h-16 flex items-center justify-center
    bg-gray-200 border-b-2 border-gray-300
  ">
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
        Timeline
      </h2>
    </div>
  </div>

  {/* 年表示 */}
  <div className="py-4">
    {years.map((year, index) => (
      <div
        key={year}
        className="relative px-4 py-6 flex flex-col items-center"
      >
        {/* 年号 */}
        <div className="
          relative z-10
          bg-white rounded-full
          px-4 py-2
          border-2 border-gray-300
          shadow-sm
        ">
          <span className="text-lg font-bold text-gray-800">
            {year}
          </span>
        </div>

        {/* 縦線（次の年まで） */}
        {index < years.length - 1 && (
          <div className="
            absolute top-16 left-1/2 -translate-x-1/2
            w-0.5 h-full
            bg-gradient-to-b from-gray-400 to-gray-300
          " />
        )}
      </div>
    ))}
  </div>
</div>
```

**デザインポイント:**
- グラデーション背景で奥行き感
- 年号を円形バッジで強調
- 縦線をグラデーションで表現
- sticky positionで左端固定

---

### 7. TagColumn（タグ列）

**改善版:**
```tsx
<div className="min-w-[320px] bg-white">
  {/* 列ヘッダー */}
  <div className="
    h-16 px-4 flex items-center justify-between
    bg-gradient-to-r from-primary-500 to-primary-600
    border-b-2 border-primary-700
  ">
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-white">
        #{column.tag}
      </span>
      <span className="
        px-2 py-0.5 rounded-full
        bg-white/20 text-xs font-medium text-white
      ">
        {column.events.length}
      </span>
    </div>

    <button
      onClick={() => onRemoveColumn(column.tag)}
      className="
        p-1.5 rounded-lg
        text-white/80 hover:text-white
        hover:bg-white/10
        transition-colors duration-200
      "
      aria-label={`${column.tag}列を削除`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  {/* イベントカード */}
  <div className="p-4 space-y-4">
    {column.events.map((event) => (
      <EventCard
        key={event.id}
        event={event}
        highlightTag={column.tag}
      />
    ))}

    {column.events.length === 0 && (
      <div className="py-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">
          該当するイベントがありません
        </p>
      </div>
    )}
  </div>
</div>
```

**デザインポイント:**
- グラデーションヘッダー
- イベント数のバッジ表示
- 列削除ボタンの追加
- 空状態の表示

---

## レスポンシブデザイン

### ブレークポイント戦略

```css
/* Mobile First アプローチ */

/* Extra Small: < 640px (モバイル) */
@media (max-width: 639px) {
  /* 縦1列スタック表示 */
  .multi-column-view {
    display: flex;
    flex-direction: column;
  }

  .timeline-column {
    display: none; /* タイムライン非表示 */
  }

  .tag-column {
    width: 100%;
    min-width: unset;
  }
}

/* Small: 640px ~ 767px (大きめのモバイル) */
@media (min-width: 640px) and (max-width: 767px) {
  /* 2列表示（Timeline + 1列） */
}

/* Medium: 768px ~ 1023px (タブレット) */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 3列表示（Timeline + 2列） */
}

/* Large: 1024px ~ 1279px (小さめのデスクトップ) */
@media (min-width: 1024px) and (max-width: 1279px) {
  /* 横スクロール表示 */
}

/* Extra Large: >= 1280px (デスクトップ) */
@media (min-width: 1280px) {
  /* フル機能表示 */
}
```

---

## アクセシビリティ

### キーボードナビゲーション

```tsx
// 例: EventCard
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowModal(true);
    }
  }}
  className="..."
>
  {/* ... */}
</div>
```

### ARIA属性

```tsx
// 検索バー
<input
  type="search"
  role="searchbox"
  aria-label="イベント検索"
  aria-describedby="search-hint"
/>
<span id="search-hint" className="sr-only">
  タイトル、説明文、タグから検索できます
</span>

// モーダル
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  {/* ... */}
</div>

// ボタン
<button
  aria-label="タグ 日本 を削除"
  aria-pressed={selected}
>
  {/* ... */}
</button>
```

### スクリーンリーダー専用テキスト

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## パフォーマンス最適化

### 1. CSS最適化

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // 未使用のスタイルを削除（本番ビルド時）
};
```

### 2. コンポーネントのメモ化

```tsx
import { memo } from 'react';

export const EventCard = memo(({ event, highlightTag }: EventCardProps) => {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.event.id === nextProps.event.id &&
         prevProps.highlightTag === nextProps.highlightTag;
});
```

### 3. 画像の遅延ロード（将来版）

```tsx
<img
  src={event.imageUrl}
  alt={event.title}
  loading="lazy"
  className="..."
/>
```

---

## 実装ステップ（Cinematic Dark Theme）

### Phase 1: 基盤準備（1日目）

#### Step 1.1: デザインシステム導入
- [ ] Tailwind設定に Cinematic Dark カラーパレット追加
  - 宇宙背景色
  - タイムライン金色
  - カテゴリー別カード色（5種類）
- [ ] カスタムシャドウ（glow効果）追加
- [ ] backdrop-blur 設定

#### Step 1.2: 星空背景実装
- [ ] CSS radial-gradient で星空パターン作成
- [ ] オーロラ/星雲エフェクト追加
- [ ] アニメーション（twinkle）実装

### Phase 2: コアコンポーネント（2日目）

#### Step 2.1: 中央タイムライン実装
- [ ] 金色の縦線（グラデーション）
- [ ] 年ノード（光る円）配置
- [ ] グロー効果追加
- [ ] 接続線の実装

#### Step 2.2: EventCard Cinematic化
- [ ] カテゴリー判定関数実装
- [ ] 半透明背景 + backdrop-blur
- [ ] ホバー時のグロー効果
- [ ] スケールアップアニメーション

### Phase 3: レイアウト調整（3日目）

#### Step 3.1: 2カラム左右対称レイアウト
- [ ] タイムライン中央配置
- [ ] 左右交互配置ロジック
- [ ] 接続線の動的生成

#### Step 3.2: 3+カラム対応
- [ ] タイムライン左端固定
- [ ] 横スクロール実装
- [ ] sticky positioning

### Phase 4: UI洗練（4日目）

#### Step 4.1: Header & Controlsダーク化
- [ ] ヘッダー背景を半透明ダークに
- [ ] 検索バー・セレクターのダークテーマ化
- [ ] TagSelectorダーク化

#### Step 4.2: 詳細モーダルダーク化
- [ ] モーダル背景をダークに
- [ ] アニメーション追加
- [ ] グロー効果

### Phase 5: 仕上げ（5日目）

#### Step 5.1: レスポンシブ対応
- [ ] モバイル: 縦1列 + Timeline左寄せ
- [ ] タブレット: 2カラム
- [ ] デスクトップ: フル機能

#### Step 5.2: アクセシビリティ
- [ ] ARIA属性追加
- [ ] キーボードナビゲーション
- [ ] フォーカス表示（ダークテーマ対応）

#### Step 5.3: パフォーマンス最適化
- [ ] コンポーネントメモ化
- [ ] CSS最適化
- [ ] アニメーション軽量化

#### Step 5.4: 最終調整
- [ ] 全体的なバランス確認
- [ ] ブラウザ互換性テスト
- [ ] スクリーンショット撮影

---

## 成功基準

### ビジュアル

- [ ] 星空背景が美しく表示される
- [ ] 中央タイムラインが金色に光っている
- [ ] イベントカードがカテゴリー別に色分けされている
- [ ] カードの半透明背景が星空を透かしている
- [ ] ホバー時のグロー効果が機能している
- [ ] アニメーションがスムーズ（60fps）

### レイアウト

- [ ] 2カラム時: タイムラインが中央、左右対称配置
- [ ] 3+カラム時: タイムライン左端固定、横スクロール可能
- [ ] モバイル: 縦1列で破綻しない
- [ ] タブレット: 適切な表示
- [ ] デスクトップ: フル機能表示

### 機能

- [ ] タグ選択でカラムが追加/削除される
- [ ] 検索・ソート機能が動作する
- [ ] モーダル表示が適切に動作する
- [ ] ファイル自動リロードが動作する
- [ ] すべてのインタラクションが直感的

### 品質

- [ ] Cinematic Dark テーマが一貫している
- [ ] `TimeMosaicUISpec.png` のクオリティに近い
- [ ] パフォーマンス: 1000イベントでも快適
- [ ] アクセシビリティ: キーボード操作可能
- [ ] ブラウザ互換性: Chrome, Firefox, Safari

### スタイリッシュさ

- [ ] 全体的に映画的・シネマティックな雰囲気
- [ ] 歴史と宇宙のスケール感が表現されている
- [ ] ユーザーが「おお！」と感じる視覚体験

---

## 将来のTODO（Phase 7以降）

### 画像対応
- [ ] イベントカードに画像を表示
- [ ] 画像の遅延ロード
- [ ] 画像のフォールバック処理

### 高度なアニメーション
- [ ] Canvas による動的な星空
- [ ] 流れ星エフェクト
- [ ] タイムラインスクロール時のパララックス

### インタラクション改善
- [ ] タイムラインのズーム機能
- [ ] 年代ジャンプ機能
- [ ] カードのドラッグ&ドロップ並び替え

---

## 参考リソース

- **参考デザイン**: `docs/TimeMosaicUISpec.png`
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/) - アイコンライブラリ
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - アクセシビリティ
- [Framer Motion](https://www.framer.com/motion/) - 高度なアニメーション（将来版）
