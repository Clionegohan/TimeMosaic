/**
 * TimeMosaic Markdown Parser - イベントパーサー
 *
 * 1つのイベントセクションをパースしてEventオブジェクトに変換します。
 */

import type { Event } from './types';

/**
 * イベントパース結果
 */
export interface ParseEventResult {
  success: boolean;
  event?: Event;
  error?: string;
}

/**
 * イベントテキストをパースしてEventオブジェクトに変換
 *
 * @param text イベントのMarkdownテキスト
 * @returns パース結果
 *
 * @example
 * const text = `## 1945-08-15 終戦記念日
 * #歴史 #日本
 *
 * 説明文。`;
 * const result = parseEvent(text);
 * console.log(result.event); // { id: "...", date: {...}, title: "終戦記念日", ... }
 */
export function parseEvent(_text: string): ParseEventResult {
  // スタブ実装: テストが失敗することを確認するため
  return {
    success: false,
    error: 'Not implemented yet',
  };
}
