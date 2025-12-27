/**
 * TimeMosaic イベントユーティリティ - filterEventsByTag 単体テスト
 */

import { describe, it, expect } from 'vitest';
import { filterEventsByTag } from '../filterEventsByTag';
import type { Event } from '../../parser/types';

describe('filterEventsByTag', () => {
  describe('正常系', () => {
    it('特定のタグを持つイベントをフィルタリングできる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: '終戦記念日', tags: ['歴史', '日本'], raw: '' },
        { id: '2', date: { year: 1964 }, title: '東京オリンピック', tags: ['スポーツ', '日本'], raw: '' },
        { id: '3', date: { year: 1914 }, title: '第一次世界大戦', tags: ['歴史', '戦争'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '歴史');

      expect(filtered).toHaveLength(2);
      expect(filtered[0].title).toBe('終戦記念日');
      expect(filtered[1].title).toBe('第一次世界大戦');
    });

    it('複数のイベントから正しくフィルタリングできる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['日本', '歴史'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['日本', 'スポーツ'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['歴史'], raw: '' },
        { id: '4', date: { year: 1989 }, title: 'E4', tags: ['ドイツ'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '日本');

      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('1');
      expect(filtered[1].id).toBe('2');
    });

    it('複数タグを持つイベントから正しくフィルタリングできる', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'E1',
          tags: ['歴史', '日本', '第二次世界大戦', '戦争'],
          raw: '',
        },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['スポーツ', '日本'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['歴史', '戦争'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '戦争');

      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('1');
      expect(filtered[1].id).toBe('3');
    });

    it('タグ名は完全一致でフィルタリングされる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['歴史学'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['日本史'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '歴史');

      // 完全一致のみ
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });
  });

  describe('エッジケース', () => {
    it('空配列を渡すと空配列を返す', () => {
      const filtered = filterEventsByTag([], '歴史');

      expect(filtered).toEqual([]);
    });

    it('一致するイベントがない場合は空配列を返す', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史', '日本'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['スポーツ'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '存在しないタグ');

      expect(filtered).toEqual([]);
    });

    it('元の配列を変更しない（イミュータビリティ）', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['スポーツ'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['歴史'], raw: '' },
      ];

      const original = [...events];

      filterEventsByTag(events, '歴史');

      // 元の配列は変更されていない
      expect(events).toEqual(original);
      expect(events).toHaveLength(3);
    });

    it('タグが空配列のイベントは除外される', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: [], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['歴史'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '歴史');

      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('1');
      expect(filtered[1].id).toBe('3');
    });

    it('全イベントが一致する場合は全て返す', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['歴史'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['歴史'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '歴史');

      expect(filtered).toHaveLength(3);
      expect(filtered).toEqual(events);
    });
  });

  describe('特殊ケース', () => {
    it('大文字小文字を区別する', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['History'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['history'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['HISTORY'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, 'History');

      // 完全一致のみ
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('日本語タグでフィルタリングできる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史', '日本'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['スポーツ', '日本'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['歴史', '世界'], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '日本');

      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('1');
      expect(filtered[1].id).toBe('2');
    });

    it('空文字列のタグでフィルタリングした場合は空配列を返す', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: [''], raw: '' },
      ];

      const filtered = filterEventsByTag(events, '');

      // 空文字列タグを持つイベントを返す
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });
  });
});
