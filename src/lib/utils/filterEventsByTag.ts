/**
 * TimeMosaic イベントユーティリティ - タグフィルタリング
 */

import type { Event } from '../parser/types';

/**
 * 特定のタグを持つイベントを抽出
 *
 * @param events イベント配列
 * @param tag タグ名
 * @returns フィルタリングされたイベント配列
 */
export function filterEventsByTag(events: Event[], tag: string): Event[] {
  return events.filter((event) => event.tags.includes(tag));
}
