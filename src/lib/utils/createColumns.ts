/**
 * TimeMosaic イベントユーティリティ - カラム生成
 */

import type { Event } from '../parser/types';
import type { Column } from './types';
import { filterEventsByTag } from './filterEventsByTag';
import { sortEventsByDate } from './sortEventsByDate';

/**
 * 選択タグから列データを生成（メイン関数）
 *
 * @param events イベント配列
 * @param selectedTags 選択されたタグ配列
 * @returns 列データ配列
 */
export function createColumns(events: Event[], selectedTags: string[]): Column[] {
  return selectedTags.map((tag) => {
    const filteredEvents = filterEventsByTag(events, tag);

    return {
      tag,
      events: sortEventsByDate(filteredEvents),
    };
  });
}
