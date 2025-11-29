# Specs Process

本プロジェクトの開発は、必ず「仕様書（Spec）」から開始します。PR は Spec に基づき小さな粒度で進め、受入基準（Acceptance Criteria）により完了可否を判断します。

## 目的
- 作業の意図・範囲・受入基準を明確化し、PR 粒度を一定に保つ
- 仕様の議論をコードから切り離し、変更理由を将来に残す
- 技術スタック（Time_Stack.md）と整合した設計の維持

## ディレクトリ構成
```
docs/
  specs/
    README.md               # 本ファイル
    templates/
      spec-template.md      # 仕様書テンプレート
    2025/
      SPEC-2025-11-29-sample.md   # 実例（雛形）
```

## 命名規則 / ステータス
- ファイル名: `SPEC-YYYY-MM-DD-<slug>.md`
- 必須メタデータ（冒頭に記載）
  - `Spec ID`: `SPEC-YYYY-MM-DD-<slug>`
  - `Status`: Draft | In Review | Accepted | Rejected | Implemented | Superseded
  - `Owners`: GitHub handles
  - `Related`: Issues/PR/リンク

## 進行フロー
1) Draft: テンプレートから作成 → 下書き
2) In Review: レビュワーを指名して合意形成（Time_Stack.md と矛盾がないか確認）
3) Accepted: 受入基準を凍結し、実装 PR を開始
4) Implemented: 全ての受入基準を満たす PR がマージされたら更新
5) Superseded: 後続 Spec に置き換えられたら記載

## ブランチ/PR ルール
- ブランチ名: `feature/<spec-id>-<short>` 例: `feature/SPEC-2025-11-29-sample-list`
- PR タイトル: `[<spec-id>] 〜` で開始
- PR は Spec の受入基準を“1つの論理単位”で満たす粒度に分割
- すべての PR で Spec へのリンク必須、チェックリストに準拠

## 小粒度の変更
- ドキュメント修正や CI 設定など軽微な変更は「Mini-Spec」を許容
  - ファイル: `docs/specs/<year>/SPEC-YYYY-MM-DD-mini-<slug>.md`
  - 目的/範囲/影響/受入基準のみ簡潔に

## 付録
- 代替設計（Alternatives）は選定理由（Pros/Cons）まで記録
- リスク/移行（Migration）や互換性（Breaking change）は専用節を設ける

