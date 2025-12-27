/**
 * TimeMosaic Markdown Parser - 日付パーサー
 *
 * 日付文字列をPartialDate型にパースする機能を提供します。
 */

import type { PartialDate } from './types';

/**
 * 日付パース結果
 */
export interface ParseDateResult {
  success: boolean;
  date?: PartialDate;
  error?: string;
}

/**
 * 日付文字列をPartialDateにパースする
 *
 * @param dateStr 日付文字列 (例: "1945", "1945-08", "1945-08-15")
 * @returns パース結果
 *
 * @example
 * parseDate("1945") // { success: true, date: { year: 1945 } }
 * parseDate("1945-08-15") // { success: true, date: { year: 1945, month: 8, day: 15 } }
 * parseDate("abc") // { success: false, error: "Invalid date format: abc" }
 */
export function parseDate(dateStr: string): ParseDateResult {
  if (!dateStr || dateStr.trim() === '') {
    return {
      success: false,
      error: 'Date string is empty',
    };
  }

  const trimmed = dateStr.trim();
  const parts = trimmed.split('-');

  // パート数が1〜3でない場合はエラー
  if (parts.length === 0 || parts.length > 3) {
    return {
      success: false,
      error: `Invalid date format: ${dateStr}`,
    };
  }

  // 年のパース
  const year = parseInt(parts[0], 10);
  if (isNaN(year) || year < 1) {
    return {
      success: false,
      error: `Invalid year: ${parts[0]}`,
    };
  }

  // 年のみの場合
  if (parts.length === 1) {
    return {
      success: true,
      date: { year },
    };
  }

  // 月のパース
  const month = parseInt(parts[1], 10);
  if (isNaN(month) || month < 1 || month > 12) {
    return {
      success: false,
      error: `Invalid month: ${parts[1]} (must be 1-12)`,
    };
  }

  // 年月の場合
  if (parts.length === 2) {
    return {
      success: true,
      date: { year, month },
    };
  }

  // 日のパース
  const day = parseInt(parts[2], 10);
  if (isNaN(day) || day < 1 || day > 31) {
    return {
      success: false,
      error: `Invalid day: ${parts[2]} (must be 1-31)`,
    };
  }

  // 月ごとの日数チェック（簡易版）
  const daysInMonth = getDaysInMonth(year, month);
  if (day > daysInMonth) {
    return {
      success: false,
      error: `Invalid day: ${day} (month ${month} has only ${daysInMonth} days)`,
    };
  }

  // 年月日の場合
  return {
    success: true,
    date: { year, month, day },
  };
}

/**
 * 指定された年月の日数を取得
 *
 * @param year 年
 * @param month 月 (1-12)
 * @returns 日数
 */
function getDaysInMonth(year: number, month: number): number {
  // 月ごとの日数（1月=31日、2月=28/29日、...）
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // うるう年の判定
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }

  return daysInMonths[month - 1];
}

/**
 * うるう年かどうかを判定
 *
 * @param year 年
 * @returns うるう年の場合true
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
