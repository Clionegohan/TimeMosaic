/**
 * extractTimelineYears
 *
 * カラムデータから Timeline 用の年リストを抽出
 */

import type { Column } from './types';

/**
 * カラムデータから Timeline 用の年リストを抽出
 *
 * @param columns カラムデータ
 * @param sortOrder ソート順
 * @returns 重複なしの年リスト（ソート済み）
 */
export function extractTimelineYears(
  columns: Column[],
  sortOrder: 'asc' | 'desc'
): number[] {
  // 全イベントから年を抽出
  const allYears = columns.flatMap((column) =>
    column.events.map((event) => event.date.year)
  );

  // 重複削除
  const uniqueYears = Array.from(new Set(allYears));

  // ソート
  uniqueYears.sort((a, b) => (sortOrder === 'asc' ? a - b : b - a));

  return uniqueYears;
}
