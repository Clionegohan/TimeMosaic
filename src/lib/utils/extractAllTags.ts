/**
 * TimeMosaic イベントユーティリティ - タグ抽出
 */

import type { Event } from '../parser/types';

/**
 * 全イベントからタグ一覧を抽出（重複なし、出現数降順・同数は出現順）
 *
 * @param events イベント配列
 * @returns タグ一覧
 */
export function extractAllTags(events: Event[]): string[] {
  const tagStats = new Map<string, { count: number; order: number }>();
  let order = 0;

  for (const event of events) {
    for (const tag of event.tags) {
      const existing = tagStats.get(tag);
      if (existing) {
        existing.count += 1;
      } else {
        tagStats.set(tag, { count: 1, order });
        order += 1;
      }
    }
  }

  return Array.from(tagStats.entries())
    .sort(([, a], [, b]) => {
      if (a.count !== b.count) {
        return b.count - a.count;
      }
      return a.order - b.order;
    })
    .map(([tag]) => tag);
}
