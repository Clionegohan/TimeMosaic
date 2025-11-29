# Spec: Next.js/NestJS 最小スキャフォールド

- Spec ID: SPEC-2025-11-29-scaffold-web-api
- Status: Accepted
- Owners: @your-handle
- Related: Time_Stack.md

## Summary
Time_Stack.md に基づき、`apps/web`（Next.js App Router）と `apps/api`（NestJS）の最小雛形を作成する。

## Requirements
- ディレクトリ: `apps/web`, `apps/api`
- web: Next.js App Router でトップページのみ（`/`）
- api: NestJS で `GET /__ping -> ok`
- 依存は最小限、ビルド/起動スクリプトを追加

## Acceptance Criteria
- [ ] `npm run dev` 相当で web/api の起動が確認できる（ローカル）
- [ ] CI の build ジョブが通る
