/**
 * TimeMosaic イベントユーティリティ - 日付ソート
 */

import type { Event } from '../parser/types';

/**
 * イベントを年号順にソート
 *
 * @param events イベント配列
 * @param order ソート順（'asc': 古い順、'desc': 新しい順）
 * @returns ソート済みイベント配列（新しい配列）
 */
export function sortEventsByDate(events: Event[], order: 'asc' | 'desc' = 'asc'): Event[] {
  // イミュータビリティのため、配列をコピー
  const sortedEvents = [...events];

  // 日付比較関数
  const compareDate = (a: Event, b: Event): number => {
    // 年の比較
    if (a.date.year !== b.date.year) {
      return a.date.year - b.date.year;
    }

    // 月の比較（未定義は0として扱う）
    const aMonth = a.date.month ?? 0;
    const bMonth = b.date.month ?? 0;
    if (aMonth !== bMonth) {
      return aMonth - bMonth;
    }

    // 日の比較（未定義は0として扱う）
    const aDay = a.date.day ?? 0;
    const bDay = b.date.day ?? 0;
    return aDay - bDay;
  };

  // ソート実行
  sortedEvents.sort(compareDate);

  // 降順の場合は反転
  if (order === 'desc') {
    sortedEvents.reverse();
  }

  return sortedEvents;
}
