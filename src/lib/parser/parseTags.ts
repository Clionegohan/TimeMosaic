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
export function parseTags(tagsStr: string): ParseTagsResult {
  // 空文字列チェック
  if (!tagsStr || tagsStr.trim() === '') {
    return {
      success: false,
      error: 'Tags string is empty',
    };
  }

  const trimmed = tagsStr.trim();

  // #で始まるかチェック
  if (!trimmed.startsWith('#')) {
    return {
      success: false,
      error: 'Tags must start with #',
    };
  }

  // 空白文字（スペース、タブ等）で分割
  const parts = trimmed.split(/\s+/);

  // 全てが#で始まるかチェック
  const invalidParts = parts.filter((part) => !part.startsWith('#'));
  if (invalidParts.length > 0) {
    return {
      success: false,
      error: 'All tags must start with #',
    };
  }

  // #を除去してタグ名を抽出
  const tags = parts
    .map((part) => part.substring(1)) // #を除去
    .filter((tag) => tag.length > 0); // 空のタグを除外

  // 有効なタグがない場合
  if (tags.length === 0) {
    return {
      success: false,
      error: 'No valid tags found',
    };
  }

  // 重複を削除（順序を保持）
  const uniqueTags = Array.from(new Set(tags));

  return {
    success: true,
    tags: uniqueTags,
  };
}
