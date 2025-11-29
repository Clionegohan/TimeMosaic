#!/usr/bin/env markdown
# Mini-Spec: CIブートストラップ（Spec Gate / Build / Lint）

- Spec ID: SPEC-2025-11-29-mini-ci-bootstrap
- Status: Accepted
- Owners: @your-handle
- Related: (none)

## Summary
PRに対して仕様書の存在/状態を検証し、将来のビルド/リントの足場となるGitHub Actionsを追加する。

## Requirements
- Spec Gate: PRの本文/タイトルに含まれる Spec ID のファイルが docs/specs に存在し、Status が Accepted であることをチェック（`spec-exempt` ラベルで回避可）
- Build/Lint: `package.json` が存在するときのみ実行（現状はスキップ）

## Acceptance Criteria
- [ ] PR に Spec ID が無い場合は失敗（`spec-exempt` ラベルを付与すると通過）
- [ ] Spec ID のファイルが存在し、`Status: Accepted` 含むとき成功
- [ ] ルートに package.json が無い場合、ビルド/リントはスキップ

