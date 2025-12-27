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
 *
 * @remarks
 * 空文字列やホワイトスペースのみのタグは、実際にイベントが持っている場合のみマッチします。
 * これにより、意図しない空タグによる全イベント取得を防ぎます。
 */
export function filterEventsByTag(events: Event[], tag: string): Event[] {
  // 空文字列やホワイトスペースのみのタグもイベントが持っていればマッチさせる
  // （テストケースとの互換性を保つため）
  return events.filter((event) => event.tags.includes(tag));
}
