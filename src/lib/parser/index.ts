/**
 * TimeMosaic Markdown Parser - メインパーサー
 *
 * Markdown全体をパースしてイベントリストを返します。
 */

import type { ParseResult } from './types';
import { parseEvent } from './parseEvent';

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
export function parseMarkdown(markdown: string): ParseResult {
  // 空文字列チェック
  if (!markdown || markdown.trim() === '') {
    return {
      events: [],
      errors: [],
    };
  }

  const events: ParseResult['events'] = [];
  const errors: ParseResult['errors'] = [];

  // イベントセクションに分割
  // ## で始まる行を基準に分割
  const lines = markdown.split('\n');
  let currentSection: string[] = [];
  let currentSectionStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 見出し行(##)を検出
    if (line.trim().startsWith('##')) {
      // 前のセクションがあればパース
      if (currentSection.length > 0) {
        const sectionText = currentSection.join('\n');
        const result = parseEvent(sectionText);

        if (result.success && result.event) {
          events.push(result.event);
        } else if (result.error) {
          errors.push({
            line: currentSectionStart + 1, // 1-indexed
            message: result.error,
            raw: sectionText,
          });
        }
      }

      // 新しいセクション開始
      currentSection = [line];
      currentSectionStart = i;
    } else if (currentSection.length > 0) {
      // 既存セクションに追加
      currentSection.push(line);
    }
  }

  // 最後のセクションをパース
  if (currentSection.length > 0) {
    const sectionText = currentSection.join('\n');
    const result = parseEvent(sectionText);

    if (result.success && result.event) {
      events.push(result.event);
    } else if (result.error) {
      errors.push({
        line: currentSectionStart + 1,
        message: result.error,
        raw: sectionText,
      });
    }
  }

  return {
    events,
    errors,
  };
}
