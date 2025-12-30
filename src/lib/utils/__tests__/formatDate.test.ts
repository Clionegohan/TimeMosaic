/**
 * formatDate - Test
 *
 * 日付フォーマット関数のテスト
 */

import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatDate';

describe('formatDate', () => {
  it('年月日を ISO 形式でフォーマットする', () => {
    expect(formatDate({ year: 1945, month: 8, day: 15 })).toBe('1945-08-15');
  });

  it('年月を ISO 形式でフォーマットする', () => {
    expect(formatDate({ year: 1945, month: 8 })).toBe('1945-08');
  });

  it('年のみを ISO 形式でフォーマットする', () => {
    expect(formatDate({ year: 1945 })).toBe('1945');
  });

  it('年月日を日本語形式でフォーマットする', () => {
    expect(formatDate({ year: 1945, month: 8, day: 15 }, 'ja')).toBe('1945年8月15日');
  });

  it('年月を日本語形式でフォーマットする', () => {
    expect(formatDate({ year: 1945, month: 8 }, 'ja')).toBe('1945年8月');
  });

  it('年のみを日本語形式でフォーマットする', () => {
    expect(formatDate({ year: 1945 }, 'ja')).toBe('1945年');
  });
});
