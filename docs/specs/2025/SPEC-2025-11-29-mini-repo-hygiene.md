# Mini-Spec: リポジトリ整備（.editorconfig / .nvmrc / .gitignore修正）

- Spec ID: SPEC-2025-11-29-mini-repo-hygiene
- Status: Accepted
- Owners: @your-handle
- Related: (none)

## Summary
開発体験と再現性向上のため、エディタ/Nodeの統一設定を追加し、Prismaマイグレーションを追跡対象に変更する。

## Requirements
- `.editorconfig` を追加（改行・インデント・末尾改行の統一）
- `.nvmrc` を追加（Node 20 LTS を推奨）
- `.gitignore` から `prisma/migrations/` を削除（マイグレーションは追跡する）

## Acceptance Criteria
- [ ] 上記ファイルが存在し、期待する内容になっている
- [ ] `git status` で `prisma/migrations/` が追跡候補になる

