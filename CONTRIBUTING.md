# Contributing Guide

本プロジェクトへの貢献手順をまとめます。開発は Spec‑First（仕様書起点）で進めます。

## 1) 仕様書（Spec）
- テンプレ: `docs/specs/templates/spec-template.md`
- 置き場所: `docs/specs/<year>/SPEC-YYYY-MM-DD-<slug>.md`
- ステータス: Draft → In Review → Accepted → Implemented/Superseded

## 2) ブランチ/PR ルール
- ブランチ名: `feature/<spec-id>-<short>`（英語）
- PR タイトル: `[<spec-id>] ...`
- PR 粒度: 1つの論理単位（受入基準単位）に分割。巨大PRは分割
- 参照: `.github/pull_request_template.md`

## 3) コミットメッセージ
- 端的な日本語で記述（例: `feat: レーン折りたたみを追加`）
- 責務単位で commit を分け、無理に 1 つにまとめない
- 形式（任意）: `<type>: <要約>`（type 例: feat, fix, refactor, chore, docs, test）

## 4) スタック整合
- `docs/Time_Stack.md` に従う（Next.js / NestJS / Prisma / Neon / Clerk）
- 矛盾や逸脱が必要な場合は、まず Spec の議論で合意を得る

## 5) 秘密情報/生成物
- `.env*` はコミット禁止。`.env.example` にキーのみ追記
- 生成物（`node_modules`, `.next`, `dist`, `coverage`, `.turbo`, `.vercel`）は追跡しない

## 6) 参考
- AI向け運用ルール: `AGENTS.md`
- 仕様書プロセス: `docs/specs/README.md`

