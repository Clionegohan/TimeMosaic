/**
 * TimeMosaic Events API Handler
 *
 * Markdownファイルを読み込んでパースし、イベントデータを返す
 */

import type { ParseResult } from '../lib/parser/types';

/**
 * ファイルからイベントを読み込む
 *
 * @param filePath Markdownファイルのパス
 * @returns パース結果
 */
export async function readEventsFromFile(_filePath: string): Promise<ParseResult> {
  // スタブ実装: テストが失敗することを確認するため
  return {
    events: [],
    errors: [],
  };
}
