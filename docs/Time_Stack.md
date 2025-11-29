# TimeMosaic — 技術スタックドキュメント

本ドキュメントは TimeMosaic（歴史タイムライン管理アプリ）の  
**フロント〜バックエンド〜インフラの全技術選定理由** を明文化する。

---

# 1. 構成概要（アーキテクチャ）

```
[Browser]
   │
   ▼
[Next.js Frontend] (Vercel)
   │ (REST Fetch)
   ▼
[NestJS API] (Render)
   │ (TCP)
   ▼
[Postgres DB - Neon]

[Authentication - Clerk (SaaS)]
```

---

# 2. 採用技術一覧（Why × What）

---

## 🖥 フロントエンド — **Next.js（React）**

- 理由
  - UI構築のしやすさ、Reactエコシステム
  - Clerk 公式サポート
  - Vercel との圧倒的相性
  - 画像最適化/ルーティング/SSR/ISRが標準搭載
- バージョン方針
  - Next.js 15+
  - App Router 前提
- 備考
  - タイムラインUIの操作性が肝 → Reactの再レンダリング最適化が重要

---

## 🔐 認証 — **Clerk**

- 理由
  - メールアドレス検証（存在しないメールは登録不可）
  - Googleログイン等のソーシャル認証も数行で導入可能
  - UIコンポーネントが完成度高く、脆弱な自前認証を避けられる
  - JWTベースで NestJS と簡単連携
- 実装方針
  - SignUp: メール認証（Magic Link）必須
  - `requireAuth()` を Next.js サーバーアクションやmiddlewareに利用

---

## 🧠 バックエンドAPI — **NestJS（TypeScript）**

- 理由
  - 型安全＋DI＋モジュール構造＝中長期的に拡張しやすい
  - Prisma との相性が良い
  - アプリ固有ロジック（検索、タグのレーン計算など）を整理しやすい
  - API の長期メンテに適している
- 主な役割
  - Event / Tag / User 関連のREST API提供
  - Clerk JWTの検証（AuthGuard実装）
  - Prisma経由でDBへアクセス
  - タイムライン整列アルゴリズムの実行

---

## 🗄 OR Mapper — **Prisma**

- 理由
  - 圧倒的なDX（schema.prisma → 自動型生成）
  - Postgresと親和性高い
  - マイグレーション管理がしやすい
- 役割
  - Event / Tag / User / EventTag モデル管理
  - DBマイグレーション
  - NestJSとの型安全なデータ連携

---

## 🛢 データベース — **Neon（Serverless Postgres）**

- 理由
  - Postgresをそのまま使える
  - サーバレス — 無料枠でも十分動く（低トラフィック向け）
  - ブランチ機能で staging / dev DB の作成が容易
- 備考
  - Prisma から接続 → `DATABASE_URL` で管理

---

## ☁️ ホスティング / デプロイ

### 1. **Vercel（Next.js）**
- 最適解
  - Next.js の標準デプロイ先
  - Clerkとの連携がシンプル
  - GitHub push → 自動デプロイ

### 2. **Render（NestJS）**
- 無料枠あり
- Nodeサーバーの常時稼働に適している
- 環境変数の設定が簡単
- CORS設定で Next.js のURLを許可

### 3. **Neon（DB）**
- ネットワーク的には Render（Nest）から接続する

---

# 3. `.env` 必要変数一覧（定義）

## Next.js（Vercel側）
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_API_BASE_URL=https://timemosaic-api.onrender.com
```

## NestJS（Render側）
```
DATABASE_URL=postgres://...
CLERK_JWKS_URL=https://clerk.yourdomain/jwks
CLERK_ISSUER=https://clerk.yourdomain
PORT=8080
```

---

# 4. 主要機能を支える技術領域

### 📌 タイムライン表示（縦スクロール・多タグレーン）
- React（レンダリング）
- カスタムフックでレーン配置アルゴリズム（重複避け）
- NestJS で年・タグ・ソートロジック提供

### 📌 タグフィルタ・複数カテゴリ比較
- Next.js のサーバーアクション（高速）
- NestJS 絞り込みAPI

### 📌 メール認証 + Googleログイン
- Clerk のSDK＋UIコンポーネント

### 📌 Stateful UI（サイドバー、タグ選択）
- Zustand or Jotai など軽量State管理（候補）
- URLクエリに状態を部分的に反映

---

# 5. 今後の拡張に備えた余白

- ElasticSearch（全文検索）  
- WebSockets / SSE（リアルタイム共有）  
- 検索ログの蓄積（おすすめ年表の生成）  
- プレミアム機能（いいね／共有用リンク）

---

# 6. まとめ

**この技術構成は「本格的なAPI・しっかりした認証・高速なUI表示」を両立させるための最適バランス。**

- フロント：Next.js（Vercel）
- 認証：Clerk
- API：NestJS（Render）
- DB：Neon
- ORM：Prisma

これにより：

- セキュア  
- 拡張性高い  
- 無料枠で開始可能  
- フロントとバックが明確に分離  
- 後にモバイルアプリにも展開可能（APIがあるため）

TimeMosaic のような「タイムライン × 知識整理アプリ」に最適化された構成。
