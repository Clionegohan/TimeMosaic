/**
 * TimeMosaic API Handlers
 *
 * 各APIエンドポイントのビジネスロジックを実装
 */

import { readEventsFromFile } from './eventsHandler';
import { extractAllTags, createColumns } from '../lib/utils';
import type { ParseResult } from '../lib/parser/types';
import type { Column } from '../lib/utils/types';

/**
 * GET /api/events のレスポンス型
 */
export interface EventsResponse {
  events: ParseResult['events'];
  errors: ParseResult['errors'];
}

/**
 * GET /api/tags のレスポンス型
 */
export interface TagsResponse {
  tags: string[];
  count: number;
}

/**
 * GET /api/columns のレスポンス型
 */
export interface ColumnsResponse {
  columns: Column[];
  metadata: {
    selectedTags: string[];
    sortOrder: 'asc' | 'desc';
    totalEvents: number;
  };
}

/**
 * 全イベントを取得
 *
 * @param filePath Markdownファイルのパス
 * @returns イベントとエラーの配列
 */
export async function getEvents(filePath: string): Promise<EventsResponse> {
  const result = await readEventsFromFile(filePath);

  return {
    events: result.events,
    errors: result.errors,
  };
}

/**
 * 全タグ一覧を取得
 *
 * @param filePath Markdownファイルのパス
 * @returns タグ配列とタグ数
 */
export async function getTags(filePath: string): Promise<TagsResponse> {
  const result = await readEventsFromFile(filePath);
  const tags = extractAllTags(result.events);

  return {
    tags,
    count: tags.length,
  };
}

/**
 * カラムデータを取得
 *
 * @param filePath Markdownファイルのパス
 * @param selectedTags 選択タグ配列
 * @param sortOrder ソート順（'asc' または 'desc'）
 * @returns カラム配列とメタデータ
 */
export async function getColumns(
  filePath: string,
  selectedTags: string[],
  sortOrder: 'asc' | 'desc'
): Promise<ColumnsResponse> {
  const result = await readEventsFromFile(filePath);
  const columns = createColumns(result.events, selectedTags, sortOrder);

  return {
    columns,
    metadata: {
      selectedTags,
      sortOrder,
      totalEvents: result.events.length,
    },
  };
}
