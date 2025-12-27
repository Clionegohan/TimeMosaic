/**
 * TimeMosaic ユーティリティ型定義
 */

import type { Event } from '../parser/types';

/**
 * マルチカラム表示の列データ
 */
export interface Column {
  tag: string; // 列のタグ名
  events: Event[]; // その列に表示するイベント（年号順ソート済み）
}
