/**
 * TimeMosaic Events API Handler
 *
 * Markdownファイルを読み込んでパースし、イベントデータを返す
 */

import { readFile } from 'node:fs/promises';
import { parseMarkdown } from '../lib/parser/index';
import type { ParseResult } from '../lib/parser/types';

/**
 * ファイルからイベントを読み込む
 *
 * @param filePath Markdownファイルのパス
 * @returns パース結果
 * @throws ファイルが存在しない、または読み込めない場合
 */
export async function readEventsFromFile(filePath: string): Promise<ParseResult> {
  // 入力バリデーション
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path provided');
  }

  try {
    // ファイルを読み込む
    const markdown = await readFile(filePath, 'utf-8');

    // パースして返す
    const result = parseMarkdown(markdown);

    return result;
  } catch (error) {
    // ファイル読み込みエラー
    if (error instanceof Error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
    throw error;
  }
}
