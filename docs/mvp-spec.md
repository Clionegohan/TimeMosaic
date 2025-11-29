# TimeMosaic MVP 要件ドラフト（簡素化版）

本ドラフトは、ユーザーが日々の読書や美術館巡りで得た知識を、
「時代」という軸で横断的に理解・比較できるようにするための最小構成を定義する。

本アプリでは、歴史的な出来事を「ひとつの時代の断片（Time Fragment）」として扱い、
それらをカテゴリ（文化・政治・文学・科学技術など）とタグで整理する。
これによりユーザーは、ある人物が生きた時代に他の分野では何が起きていたか、
特定の年代に世界の複数領域でどんな動きがあったか、といった
“分野横断的な時代の見通し” を直感的に得られる。

本ドキュメントは、そのために必要なデータ構造・機能・概念の「最小で破綻しない土台」を示し、
初期実装の出発点および将来的な見直しの基準として利用されることを目的とする。

---

## 目的と前提

### ゴール
ユーザーが、自分の興味や視点に基づいて歴史的イベントを整理し、
複数のタグを組み合わせることで、時代を横断して比較・発見できるようにする。

### ミニマム構成（MVP）
- **Event（必須）**
  - 年代（Start）は必須。  
  - End（終了年）は長期間の出来事のみ任意で設定可能。
  - タイトル・説明文・タグを持つ最小単位。
- **Tag（自由付与・複数）**
  - ユーザーの興味ベースで自由に追加できる。  
  - 例：`#ゴッホ`, `#西洋美術`, `#死`, `#文豪`, `#象徴主義` など。
  - タグを組み合わせて視点を切り替えられる（例：#西洋美術 × #死）。

### 方針
- **カテゴリという固定化された枠は採用しない。**
  - ユーザーが自分の興味に沿ってタグを設計することで、  
    “その人だけの歴史地図”を作れる体験を重視する。
- **Start（開始年）は必須、End（終了年）は任意。**
  - 単発イベントは Start のみ。
  - 戦争や運動のような期間的な現象は Start–End で表現。
- **出典（Source）や人物（Person）はMVPでは除外。**
  - コア体験は「歴史的イベント × タグ × 時系列」であり、  
    まずはこの軸の価値検証を優先する。

---

## 用語と命名（Domain の見直し）
- UI/DB名ともに「Category（カテゴリ）」を採用することを推奨。
  - 理由: 一般ユーザに直感的（IT史・日本史・美術史などの“分類”）。
  - 代替: Discipline（学術分野）, Field（分野）。ただし「カテゴリ」のほうが伝わりやすい。
- タグ: 「Tag」または日本語UIでは「タグ」。自由記述/複数付与。
- イベント: 「Event」。タイトル・説明・開始年・任意の終了年。

---

## データモデル（最小 Prisma 案）

// prisma/schema.prisma（提案）
// 4モデル構成：User / Event / Tag / EventTag（暗黙M:N）
// 「個人の歴史イベント × グローバルタグ」を最小で成立させる案

datasource db {
  provider = "postgresql" // 開発時だけ sqlite でもOK
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?

  events    Event[]  // 1ユーザーが複数イベントを持つ

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  startYear   Int      // 必須
  endYear     Int?     // 任意
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 所有者（ユーザー）への紐付け（必須）
  user        User     @relation(fields: [userId], references: [id])
  userId      String

  // 複数タグ（暗黙 M:N）
  tags        Tag[]

  @@index([startYear])
  @@index([userId])
  @@index([startYear, endYear])
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique       // グローバル唯一
  slug      String?  @unique       // URL用など任意

  events    Event[]                // 暗黙 M:N で Event と結びつく

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

erDiagram
  User ||--o{ Event : "owns"
  Event }o--o{ Tag : "tagged-with"

  User {
    String id PK
    String email UNIQUE
    String name
    DateTime createdAt
    DateTime updatedAt
  }

  Event {
    String id PK
    String title
    String description OPTIONAL
    Int startYear
    Int endYear OPTIONAL
    String userId FK >-- User.id
    DateTime createdAt
    DateTime updatedAt
  }

  Tag {
    String id PK
    String name UNIQUE
    String slug UNIQUE OPTIONAL
    DateTime createdAt
    DateTime updatedAt
  }

---

## API の雛形（最小）

本システムは「Event（歴史的出来事）」と「Tag（特徴ラベル）」を中心とした構成とする。  
全てのイベントはログインユーザーに紐づく（userId 前提）。


---

# Events

## GET /events
自分のイベント一覧を取得する。  
タグ・年代による絞り込みが可能。

**クエリパラメータ**
- `tags=a,b,c`
- `fromYear=YYYY`
- `toYear=YYYY`

**レスポンス例**
```json
[
  {
    "id": "ev1",
    "title": "ゴッホが自殺した",
    "description": "オーヴェル＝シュル＝オワーズ",
    "startYear": 1890,
    "endYear": null,
    "tags": ["ゴッホ", "西洋美術", "死"]
  }
]
```

---

## GET /events/:id
単一イベントを取得する。


---

## POST /events
イベントを作成する。  
指定されたタグが存在しなければ自動で作成する。

**リクエスト例**
```json
{
  "title": "ゴッホが自殺した",
  "description": "オーヴェル＝シュル＝オワーズ",
  "startYear": 1890,
  "endYear": null,
  "tags": ["ゴッホ", "西洋美術", "死"]
}
```


---

## PATCH /events/:id
イベントの内容を更新する。  
タグの再設定もここで行う。

**リクエスト例**
```json
{
  "title": "ゴッホの死",
  "startYear": 1890,
  "tags": ["ゴッホ", "死"]
}
```


---

## DELETE /events/:id
イベントを削除する。


---

# Tags

## GET /tags
現在のユーザーのイベントで使用されているタグ一覧を返す。

**レスポンス例**
```json
[
  { "id": "t1", "name": "西洋美術" },
  { "id": "t2", "name": "死" },
  { "id": "t3", "name": "ゴッホ" }
]
```


---

# 画面（最小）

## 1. 年表画面（タイムライン）
- 自分の Event 一覧を年順に表示
- タグフィルタ ON/OFF
- 複数タグを横並びレーンとして重ねて表示（UI側の責務）

## 2. イベント作成画面
- タイトル
- 説明（任意）
- 開始年・終了年
- タグ入力（複数）

## 3. イベント編集画面
- イベント内容の修正
- タグの追加・削除

## 4. タグ一覧画面
- 自分が使っているタグ一覧
- タグでイベント一覧へ遷移
