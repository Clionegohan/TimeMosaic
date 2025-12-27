/**
 * TimeMosaic イベントユーティリティ関数
 *
 * マルチカラム年表表示のためのデータ処理関数群
 */

import type { Event } from '../parser/types';
import type { Column } from './types';

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

/**
 * 選択タグから列データを生成（メイン関数）
 *
 * @param events イベント配列
 * @param selectedTags 選択されたタグ配列
 * @param sortOrder ソート順（'asc': 古い順、'desc': 新しい順）
 * @returns 列データ配列
 */
export function createColumns(
  events: Event[],
  selectedTags: string[],
  sortOrder: 'asc' | 'desc' = 'asc'
): Column[] {
  return selectedTags.map((tag) => {
    // タグでフィルタリング
    const filteredEvents = filterEventsByTag(events, tag);

    // ソート
    const sortedEvents = sortEventsByDate(filteredEvents, sortOrder);

    return {
      tag,
      events: sortedEvents,
    };
  });
}
