/**
 * 日付フォーマット関数
 *
 * 部分的な日付情報（年のみ、年月、年月日）をフォーマットします。
 */

/**
 * 日付フォーマット関数
 *
 * @param date - 部分的な日付情報
 * @param format - フォーマット形式 ('iso' | 'ja')
 * @returns フォーマットされた日付文字列
 */
export function formatDate(
  date: { year: number; month?: number; day?: number },
  format: 'iso' | 'ja' = 'iso'
): string {
  if (format === 'ja') {
    if (date.month && date.day) {
      return `${date.year}年${date.month}月${date.day}日`;
    } else if (date.month) {
      return `${date.year}年${date.month}月`;
    }
    return `${date.year}年`;
  }

  // ISO format
  if (date.month && date.day) {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  } else if (date.month) {
    return `${date.year}-${String(date.month).padStart(2, '0')}`;
  }
  return String(date.year);
}
