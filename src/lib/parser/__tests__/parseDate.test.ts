/**
 * TimeMosaic Markdown Parser - 日付パーサーのテスト
 */

import { describe, it, expect } from 'vitest';
import { parseDate } from '../parseDate';

describe('parseDate', () => {
  describe('正常系: 年のみ', () => {
    it('4桁の年をパースできる', () => {
      const result = parseDate('1945');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 1945 });
      expect(result.error).toBeUndefined();
    });

    it('1桁の年をパースできる', () => {
      const result = parseDate('1');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 1 });
    });

    it('5桁以上の年をパースできる', () => {
      const result = parseDate('12345');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 12345 });
    });
  });

  describe('正常系: 年月', () => {
    it('年月形式（YYYY-MM）をパースできる', () => {
      const result = parseDate('1945-08');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 1945, month: 8 });
    });

    it('1月をパースできる', () => {
      const result = parseDate('2024-01');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 2024, month: 1 });
    });

    it('12月をパースできる', () => {
      const result = parseDate('2024-12');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 2024, month: 12 });
    });
  });

  describe('正常系: 年月日', () => {
    it('年月日形式（YYYY-MM-DD）をパースできる', () => {
      const result = parseDate('1945-08-15');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 1945, month: 8, day: 15 });
    });

    it('月の初日（1日）をパースできる', () => {
      const result = parseDate('2024-01-01');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 2024, month: 1, day: 1 });
    });

    it('月の末日（31日）をパースできる', () => {
      const result = parseDate('2024-01-31');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 2024, month: 1, day: 31 });
    });

    it('2月29日（うるう年）をパースできる', () => {
      const result = parseDate('2024-02-29');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 2024, month: 2, day: 29 });
    });

    it('2月28日（平年）をパースできる', () => {
      const result = parseDate('2023-02-28');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 2023, month: 2, day: 28 });
    });
  });

  describe('異常系: 空文字列・不正な形式', () => {
    it('空文字列はエラーになる', () => {
      const result = parseDate('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Date string is empty');
    });

    it('空白のみの文字列はエラーになる', () => {
      const result = parseDate('   ');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Date string is empty');
    });

    it('文字列（非数値）はエラーになる', () => {
      const result = parseDate('abc');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid year');
    });

    it('ハイフンのみはエラーになる', () => {
      const result = parseDate('-');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('異常系: 不正な年', () => {
    it('年が0はエラーになる', () => {
      const result = parseDate('0');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid year');
    });

    it('年が負の数はエラーになる', () => {
      const result = parseDate('-1');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid year');
    });
  });

  describe('異常系: 不正な月', () => {
    it('月が0はエラーになる', () => {
      const result = parseDate('2024-00');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid month');
      expect(result.error).toContain('must be 1-12');
    });

    it('月が13はエラーになる', () => {
      const result = parseDate('2024-13');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid month');
      expect(result.error).toContain('must be 1-12');
    });

    it('月が文字列はエラーになる', () => {
      const result = parseDate('2024-abc');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid month');
    });
  });

  describe('異常系: 不正な日', () => {
    it('日が0はエラーになる', () => {
      const result = parseDate('2024-01-00');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid day');
      expect(result.error).toContain('must be 1-31');
    });

    it('日が32はエラーになる', () => {
      const result = parseDate('2024-01-32');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid day');
    });

    it('日が文字列はエラーになる', () => {
      const result = parseDate('2024-01-abc');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid day');
    });

    it('31日が存在しない月（4月31日）はエラーになる', () => {
      const result = parseDate('2024-04-31');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid day');
      expect(result.error).toContain('month 4 has only 30 days');
    });

    it('2月29日（平年）はエラーになる', () => {
      const result = parseDate('2023-02-29');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid day');
      expect(result.error).toContain('month 2 has only 28 days');
    });

    it('2月30日はエラーになる', () => {
      const result = parseDate('2024-02-30');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid day');
    });
  });

  describe('エッジケース', () => {
    it('前後に空白がある場合はトリムされる', () => {
      const result = parseDate('  1945-08-15  ');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 1945, month: 8, day: 15 });
    });

    it('うるう年の判定が正しい（400で割り切れる）', () => {
      const result = parseDate('2000-02-29');
      expect(result.success).toBe(true);
      expect(result.date).toEqual({ year: 2000, month: 2, day: 29 });
    });

    it('うるう年の判定が正しい（100で割り切れるが400で割り切れない）', () => {
      const result = parseDate('1900-02-29');
      expect(result.success).toBe(false);
      expect(result.error).toContain('month 2 has only 28 days');
    });
  });
});
