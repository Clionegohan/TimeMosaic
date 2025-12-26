/**
 * TimeMosaic Markdown Parser - 日付パーサー
 *
 * 日付文字列をPartialDate型にパースする機能を提供します。
 */

import type { PartialDate } from './types';

/**
 * 日付パース結果
 */
export interface ParseDateResult {
  success: boolean;
  date?: PartialDate;
  error?: string;
}

/**
 * 日付文字列をPartialDateにパースする
 *
 * @param dateStr 日付文字列 (例: "1945", "1945-08", "1945-08-15")
 * @returns パース結果
 *
 * @example
 * parseDate("1945") // { success: true, date: { year: 1945 } }
 * parseDate("1945-08-15") // { success: true, date: { year: 1945, month: 8, day: 15 } }
 * parseDate("abc") // { success: false, error: "Invalid date format: abc" }
 */
export function parseDate(_dateStr: string): ParseDateResult {
  // スタブ実装: テストが失敗することを確認するため
  return {
    success: false,
    error: 'Not implemented yet',
  };
}
