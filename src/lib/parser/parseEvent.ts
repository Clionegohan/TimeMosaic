/**
 * TimeMosaic Markdown Parser - イベントパーサー
 *
 * 1つのイベントセクションをパースしてEventオブジェクトに変換します。
 */

import { v4 as uuidv4 } from 'uuid';
import type { Event } from './types';
import { parseDate } from './parseDate';
import { parseTags } from './parseTags';
import { parseDescription } from './parseDescription';

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
export function parseEvent(text: string): ParseEventResult {
  // 空チェック
  if (!text || text.trim() === '') {
    return {
      success: false,
      error: 'Event text is empty',
    };
  }

  const lines = text.split('\n');

  // 見出し行を探す
  const headingLine = lines.find((line) => line.trim().startsWith('##'));

  if (!headingLine) {
    return {
      success: false,
      error: 'No heading found (must start with ##)',
    };
  }

  // 見出しから日付とタイトルを抽出
  const headingContent = headingLine.trim().substring(2).trim(); // ## を除去
  const parts = headingContent.split(/\s+/);

  if (parts.length < 2) {
    return {
      success: false,
      error: 'Heading must contain both date and title',
    };
  }

  const dateStr = parts[0];
  const title = parts.slice(1).join(' ');

  // 日付をパース
  const dateResult = parseDate(dateStr);
  if (!dateResult.success) {
    return {
      success: false,
      error: `Invalid date: ${dateResult.error}`,
    };
  }

  // タグ行を探す（見出し行の次の行以降で#で始まる行）
  const headingIndex = lines.findIndex((line) => line.trim().startsWith('##'));
  const tagLine = lines
    .slice(headingIndex + 1)
    .find((line) => line.trim().startsWith('#') && !line.trim().startsWith('##'));

  if (!tagLine) {
    return {
      success: false,
      error: 'No tags found (must have at least one tag starting with #)',
    };
  }

  // タグをパース
  const tagsResult = parseTags(tagLine);
  if (!tagsResult.success) {
    return {
      success: false,
      error: `Invalid tags: ${tagsResult.error}`,
    };
  }

  // 説明文を抽出（タグ行以降）
  const tagLineIndex = lines.findIndex(
    (line, idx) => idx > headingIndex && line.trim().startsWith('#') && !line.trim().startsWith('##')
  );
  const descriptionLines = tagLineIndex >= 0 ? lines.slice(tagLineIndex + 1) : [];

  const description = parseDescription(descriptionLines);

  // Eventオブジェクトを作成
  const event: Event = {
    id: uuidv4(),
    date: dateResult.date!,
    title,
    tags: tagsResult.tags!,
    description,
    raw: text,
  };

  return {
    success: true,
    event,
  };
}
