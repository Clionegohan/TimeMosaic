/**
 * TimeMosaic イベントユーティリティ - sortEventsByDate 単体テスト
 */

import { describe, it, expect } from 'vitest';
import { sortEventsByDate } from '../sortEventsByDate';
import type { Event } from '../../parser/types';

describe('sortEventsByDate', () => {
  describe('正常系', () => {
    it('イベントを年号順にソートできる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1989 }, title: 'E1', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: [], raw: '' },
        { id: '3', date: { year: 1964 }, title: 'E3', tags: [], raw: '' },
        { id: '4', date: { year: 1543 }, title: 'E4', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      expect(sorted).toHaveLength(4);
      expect(sorted[0].date.year).toBe(1543);
      expect(sorted[1].date.year).toBe(1945);
      expect(sorted[2].date.year).toBe(1964);
      expect(sorted[3].date.year).toBe(1989);
    });

    it('年月日が混在するイベントを正しくソートできる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945, month: 8, day: 15 }, title: '終戦記念日', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: '1945年のみ', tags: [], raw: '' },
        { id: '3', date: { year: 1945, month: 1 }, title: '1945年1月', tags: [], raw: '' },
        { id: '4', date: { year: 1945, month: 8, day: 6 }, title: '広島原爆', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      // 年のみ（月日未定義 = 0扱い）が最初
      expect(sorted[0].title).toBe('1945年のみ');
      // 1月（日未定義 = 0扱い）が次
      expect(sorted[1].title).toBe('1945年1月');
      // 8月6日
      expect(sorted[2].title).toBe('広島原爆');
      // 8月15日
      expect(sorted[3].title).toBe('終戦記念日');
    });

    it('同じ年で月が異なる場合、月の順でソートされる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1964, month: 10 }, title: '東京オリンピック', tags: [], raw: '' },
        { id: '2', date: { year: 1964, month: 7 }, title: '7月のイベント', tags: [], raw: '' },
        { id: '3', date: { year: 1964, month: 1 }, title: '1月のイベント', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      expect(sorted[0].date.month).toBe(1);
      expect(sorted[1].date.month).toBe(7);
      expect(sorted[2].date.month).toBe(10);
    });

    it('同じ年月で日が異なる場合、日の順でソートされる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945, month: 8, day: 15 }, title: '終戦', tags: [], raw: '' },
        { id: '2', date: { year: 1945, month: 8, day: 6 }, title: '広島', tags: [], raw: '' },
        { id: '3', date: { year: 1945, month: 8, day: 9 }, title: '長崎', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      expect(sorted[0].date.day).toBe(6);
      expect(sorted[1].date.day).toBe(9);
      expect(sorted[2].date.day).toBe(15);
    });
  });

  describe('エッジケース', () => {
    it('空配列を渡すと空配列を返す', () => {
      const sorted = sortEventsByDate([]);

      expect(sorted).toEqual([]);
    });

    it('単一イベントはそのまま返す', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe('1');
    });

    it('元の配列を変更しない（イミュータビリティ）', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1989 }, title: 'E1', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: [], raw: '' },
        { id: '3', date: { year: 1964 }, title: 'E3', tags: [], raw: '' },
      ];

      const original = [...events];

      sortEventsByDate(events);

      // 元の配列は変更されていない
      expect(events).toEqual(original);
      expect(events[0].date.year).toBe(1989);
    });

    it('同じ日付のイベントは元の順序を保持する（安定ソート）', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: [], raw: '' },
        { id: '3', date: { year: 1945 }, title: 'E3', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });
  });

  describe('日付比較ロジック', () => {
    it('月が未定義の場合は0として扱われる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945, month: 8 }, title: '8月', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: '年のみ', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      // 年のみ（月 = undefined = 0）が先
      expect(sorted[0].title).toBe('年のみ');
      expect(sorted[1].title).toBe('8月');
    });

    it('日が未定義の場合は0として扱われる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945, month: 8, day: 15 }, title: '8月15日', tags: [], raw: '' },
        { id: '2', date: { year: 1945, month: 8 }, title: '8月のみ', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      // 8月のみ（日 = undefined = 0）が先
      expect(sorted[0].title).toBe('8月のみ');
      expect(sorted[1].title).toBe('8月15日');
    });

    it('デフォルトのソート順は昇順', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1989 }, title: 'E1', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      expect(sorted[0].date.year).toBe(1945);
      expect(sorted[1].date.year).toBe(1989);
    });

    it('完全に同じ日付のイベントは元の順序を保持する', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945, month: 8, day: 15 }, title: 'Event A', tags: [], raw: '' },
        { id: '2', date: { year: 1945, month: 8, day: 15 }, title: 'Event B', tags: [], raw: '' },
        { id: '3', date: { year: 1945, month: 8, day: 15 }, title: 'Event C', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events);

      // 元の順序を保持
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });

  });
});
