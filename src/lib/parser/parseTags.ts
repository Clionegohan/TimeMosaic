/**
 * TimeMosaic Markdown Parser - タグパーサー
 *
 * タグ文字列を配列にパースする機能を提供します。
 */

/**
 * タグパース結果
 */
export interface ParseTagsResult {
  success: boolean;
  tags?: string[];
  error?: string;
}

/**
 * タグ文字列をタグ配列にパースする
 *
 * @param tagsStr タグ文字列 (例: "#歴史 #日本 #第二次世界大戦")
 * @returns パース結果
 *
 * @example
 * parseTags("#歴史 #日本") // { success: true, tags: ["歴史", "日本"] }
 * parseTags("#歴史") // { success: true, tags: ["歴史"] }
 * parseTags("歴史") // { success: false, error: "Tags must start with #" }
 */
export function parseTags(_tagsStr: string): ParseTagsResult {
  // スタブ実装: テストが失敗することを確認するため
  return {
    success: false,
    error: 'Not implemented yet',
  };
}
