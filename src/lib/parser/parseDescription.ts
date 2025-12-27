/**
 * TimeMosaic Markdown Parser - 説明文パーサー
 *
 * 説明文の行配列を結合して文字列として返します。
 */

/**
 * 説明文の行配列をパースして文字列に変換
 *
 * @param lines 説明文の行配列
 * @returns パースされた説明文（空の場合はundefined）
 *
 * @example
 * parseDescription(['説明1行目', '説明2行目']) // "説明1行目\n説明2行目"
 * parseDescription([]) // undefined
 * parseDescription(['---']) // undefined
 */
export function parseDescription(_lines: string[]): string | undefined {
  // スタブ実装: テストが失敗することを確認するため
  return undefined;
}
