# TimeMosaic

TimeMosaic は、歴史的出来事（Event）をタグで横断整理し、時系列で俯瞰・比較できる年表アプリです。プロトタイプ実装は削除し、本番開発は Time_Stack.md の技術スタックに沿って進めます。

## ドキュメント
- プロダクト概要: `docs/TimeMosaic-Product-Overview.md`
- 技術スタック: `docs/Time_Stack.md`
- MVP 要件ドラフト（概念・モデル案）: `docs/mvp-spec.md`
- 仕様書プロセス: `docs/specs/README.md`（テンプレ: `docs/specs/templates/spec-template.md`）

## 次のステップ（推奨）
1) 仕様書（Spec）を作成（`docs/specs/...`）し、合意（Accepted）を得る
2) `apps/web`（Next.js）と `apps/api`（NestJS） の初期化PR
3) Prisma スキーマ（Event/Tag/User）追加、Neon 接続設定PR
4) Clerk 連携（Next.js 側セッション→API に JWT 付与）PR
5) タイムライン UI（レーン/重複回避）の React 実装移植PR
6) デプロイ（Vercel/Render）と最低限のE2E確認PR
