/**
 * TimeMosaic Markdown Parser - メインパーサー
 *
 * Markdown全体をパースしてイベントリストを返します。
 */

import type { ParseResult } from './types';

/**
 * Markdownテキストをパースしてイベントリストを返す
 *
 * @param markdown Markdownテキスト
 * @returns パース結果（イベント配列とエラー配列）
 *
 * @example
 * const markdown = `## 1945-08-15 終戦記念日
 * #歴史 #日本
 *
 * 第二次世界大戦の終結。`;
 *
 * const result = parseMarkdown(markdown);
 * console.log(result.events); // [{ id: "...", date: {...}, title: "終戦記念日", ... }]
 */
export function parseMarkdown(_markdown: string): ParseResult {
  // スタブ実装: テストが失敗することを確認するため
  return {
    events: [],
    errors: [],
  };
}
