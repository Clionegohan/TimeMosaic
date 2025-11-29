# AI Working Agreement

本リポジトリで AI（エージェント/自動化ツール）が作業する際の必読ガイドです。すべての変更はここに定めるルールと、Time_Stack.md・仕様書（Spec）運用に従ってください。

## 参照の優先順位（必ず最初に読む）
1. `docs/specs/README.md`（仕様書プロセス）
2. `docs/Time_Stack.md`（技術スタックの基準）
3. 対応する Accepted な仕様書（`docs/specs/**/SPEC-*-<slug>.md` のうち `Status: Accepted`）
4. `docs/TimeMosaic-Product-Overview.md`（製品概要と方針）

上記のいずれかに矛盾がある場合は、Time_Stack.md と Accepted Spec を優先します。

## 守るべき原則
- Spec‑First: 仕様書が無い作業は開始しない。Draft を作成 → Review → Accepted を得てから実装に着手する。
- 小さく確実に: PR は“1つの論理単位の受入基準”を満たす最小粒度に分割する。
- 一貫性: Time_Stack.md と整合する実装・依存・配置を行う（Next.js / NestJS / Prisma / Neon / Clerk）。
- 痕跡の可視化: 仕様変更・設計判断は Spec の該当節（Alternatives/Risks/Changelog）に追記する。
- 秘密を扱わない: `.env*` をコミットしない。必要な値は `.env.example` にキーのみ追記。

## 変更手順（AI Checklist）
1) 前提確認
   - [ ] 該当 Spec（Accepted）を特定（なければ Draft を作成して処理を停止）
   - [ ] Time_Stack.md と矛盾がないか確認
2) 計画
   - [ ] 実装対象ファイル/生成物/マイグレーションの一覧化
   - [ ] 影響範囲（破壊的変更の有無）を明記
3) 実装
   - [ ] 作業開始前に適切なブランチを作成（例: `feature/SPEC-YYYY-MM-DD-slug-short`）
   - [ ] 仕様の受入基準を満たす最小限の差分に留める（巨大PR禁止）
   - [ ] 生成物や一時ファイルは `.gitignore` に従って非追跡
   - [ ] ドキュメント（Spec/README/補助ドキュメント）を必要に応じ更新
4) テスト/検証
   - [ ] Lint/Build/最低限の実行確認（可能な範囲）
   - [ ] マイグレーションの安全性/ロールバック手順の記載（必要な場合）
5) PR 作成
   - [ ] ブランチ名: `feature/<spec-id>-<short>`
   - [ ] タイトル: `[<spec-id>] ...`
   - [ ] PR テンプレのチェック項目を満たす

## PR/コミットの粒度
- PR は“1つの論理単位の受入基準”を満たす範囲に限定（大きくなりすぎる場合は分割）。
- コミットは責務ごとに分割し、無理に 1 つへ潰さない（Rebase squash の強制なし）。
- コミットメッセージは端的な日本語で記述（例: `feat: レーン折りたたみを追加`）。

## 触って良い/ダメな領域
- 触って良い
  - `apps/web`（Next.js）: UI/ルーティング/サーバーアクション/設定
  - `apps/api`（NestJS）: コントローラ/サービス/モジュール/設定
  - `prisma/schema.prisma` と関連の `.env.example`（キーのみ）
  - `docs/**`（Spec/設計/README/テンプレート類）
- 原則触らない
  - `.env*`（秘密の値）
  - 生成物（`node_modules`, `.next`, `dist`, `coverage`, `.turbo`, `.vercel`）

## 命名・コミット規約
- ブランチ: `feature/<spec-id>-<short>` / `chore/<spec-id>-<short>` / `fix/<spec-id>-<short>`（英語）
- コミットメッセージ: 端的な日本語。必要に応じて `<type>:` を先頭に付与
  - 例: `feat: レーン折りたたみを追加`、`refactor: 衝突回避の列割り当てを最適化`

## 逸脱時の対応
- Time_Stack.md と矛盾する要求が来た場合: 作業を保留し、Spec（Draft）を作成して合意を得る。
- 仕様の曖昧点: Spec の Open Questions に追記し、PR では仮実装にしない。

## 補助情報
- PR/Issue テンプレートは `.github/` を参照。
- 仕様書テンプレートは `docs/specs/templates/spec-template.md`。
