/**
 * TimeMosaic イベントユーティリティ - タグ抽出
 */

import type { Event } from '../parser/types';

/**
 * 全イベントからタグ一覧を抽出（重複なし、ソート済み）
 *
 * @param events イベント配列
 * @returns タグ一覧
 */
export function extractAllTags(events: Event[]): string[] {
  // 全イベントからタグを抽出
  const allTags = events.flatMap((event) => event.tags);

  // 重複を削除
  const uniqueTags = Array.from(new Set(allTags));

  // ソートして返す
  return uniqueTags.sort();
}
