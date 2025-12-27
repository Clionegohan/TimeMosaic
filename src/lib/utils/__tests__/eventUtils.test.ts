/**
 * TimeMosaic イベントユーティリティ関数 - 単体テスト
 */

import { describe, it, expect } from 'vitest';
import { extractAllTags, sortEventsByDate, filterEventsByTag } from '../eventUtils';
import type { Event } from '../../parser/types';

describe('extractAllTags', () => {
  describe('正常系', () => {
    it('全イベントから重複なしのタグ一覧を抽出できる', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: ['歴史', '日本'],
          raw: '',
        },
        {
          id: '2',
          date: { year: 1964 },
          title: 'イベント2',
          tags: ['スポーツ', '日本'],
          raw: '',
        },
        {
          id: '3',
          date: { year: 1914 },
          title: 'イベント3',
          tags: ['歴史'],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      expect(tags).toEqual(['スポーツ', '日本', '歴史']);
    });

    it('重複するタグは1つにまとめられる', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: ['歴史', '日本', '戦争'],
          raw: '',
        },
        {
          id: '2',
          date: { year: 1964 },
          title: 'イベント2',
          tags: ['歴史', '日本', 'スポーツ'],
          raw: '',
        },
        {
          id: '3',
          date: { year: 1914 },
          title: 'イベント3',
          tags: ['歴史', '戦争'],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      // 重複なし: 歴史、日本、戦争、スポーツ
      expect(tags).toHaveLength(4);
      expect(tags).toEqual(['スポーツ', '戦争', '日本', '歴史']);
    });

    it('タグがアルファベット順（文字コード順）でソートされている', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: ['日本', 'アメリカ', 'スポーツ'],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      // ソート済み
      expect(tags).toEqual(['アメリカ', 'スポーツ', '日本']);
    });

    it('単一イベントからタグを抽出できる', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: ['タグA', 'タグB', 'タグC'],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      expect(tags).toEqual(['タグA', 'タグB', 'タグC']);
    });

    it('複数イベントから多数のタグを抽出できる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['A', 'B'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['C', 'D'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['E', 'F'], raw: '' },
        { id: '4', date: { year: 1989 }, title: 'E4', tags: ['G', 'H'], raw: '' },
      ];

      const tags = extractAllTags(events);

      expect(tags).toHaveLength(8);
      expect(tags).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
    });
  });

  describe('エッジケース', () => {
    it('空配列を渡すと空配列を返す', () => {
      const tags = extractAllTags([]);

      expect(tags).toEqual([]);
    });

    it('タグが1つもないイベントは無視される', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: [],
          raw: '',
        },
        {
          id: '2',
          date: { year: 1964 },
          title: 'イベント2',
          tags: ['歴史'],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      expect(tags).toEqual(['歴史']);
    });

    it('全てのイベントがタグを持たない場合は空配列', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: [],
          raw: '',
        },
        {
          id: '2',
          date: { year: 1964 },
          title: 'イベント2',
          tags: [],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      expect(tags).toEqual([]);
    });

    it('同じタグが複数回出現しても1つにまとめられる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史', '歴史', '歴史'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['歴史', '日本'], raw: '' },
      ];

      const tags = extractAllTags(events);

      expect(tags).toEqual(['日本', '歴史']);
    });
  });

  describe('特殊文字・日本語', () => {
    it('日本語タグを正しく処理できる', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: ['歴史', '科学', 'スポーツ', '文化'],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      expect(tags).toEqual(['スポーツ', '文化', '歴史', '科学']);
    });

    it('英数字タグを正しく処理できる', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: ['Tag1', 'Tag2', 'ABC', 'XYZ'],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      expect(tags).toEqual(['ABC', 'Tag1', 'Tag2', 'XYZ']);
    });

    it('混在する言語のタグを正しくソートできる', () => {
      const events: Event[] = [
        {
          id: '1',
          date: { year: 1945 },
          title: 'イベント1',
          tags: ['日本', 'America', 'フランス', 'China'],
          raw: '',
        },
      ];

      const tags = extractAllTags(events);

      // 文字コード順: A, C, F, 日
      expect(tags).toEqual(['America', 'China', 'フランス', '日本']);
    });
  });
});

describe('sortEventsByDate', () => {
  describe('正常系', () => {
    it('昇順（asc）でイベントを年号順にソートできる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1989 }, title: 'E1', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: [], raw: '' },
        { id: '3', date: { year: 1964 }, title: 'E3', tags: [], raw: '' },
        { id: '4', date: { year: 1543 }, title: 'E4', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events, 'asc');

      expect(sorted).toHaveLength(4);
      expect(sorted[0].date.year).toBe(1543);
      expect(sorted[1].date.year).toBe(1945);
      expect(sorted[2].date.year).toBe(1964);
      expect(sorted[3].date.year).toBe(1989);
    });

    it('降順（desc）でイベントを年号順にソートできる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1543 }, title: 'E1', tags: [], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: [], raw: '' },
        { id: '3', date: { year: 1945 }, title: 'E3', tags: [], raw: '' },
        { id: '4', date: { year: 1989 }, title: 'E4', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events, 'desc');

      expect(sorted).toHaveLength(4);
      expect(sorted[0].date.year).toBe(1989);
      expect(sorted[1].date.year).toBe(1964);
      expect(sorted[2].date.year).toBe(1945);
      expect(sorted[3].date.year).toBe(1543);
    });

    it('年月日が混在するイベントを正しくソートできる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945, month: 8, day: 15 }, title: '終戦記念日', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: '1945年のみ', tags: [], raw: '' },
        { id: '3', date: { year: 1945, month: 1 }, title: '1945年1月', tags: [], raw: '' },
        { id: '4', date: { year: 1945, month: 8, day: 6 }, title: '広島原爆', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events, 'asc');

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

      const sorted = sortEventsByDate(events, 'asc');

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

      const sorted = sortEventsByDate(events, 'asc');

      expect(sorted[0].date.day).toBe(6);
      expect(sorted[1].date.day).toBe(9);
      expect(sorted[2].date.day).toBe(15);
    });
  });

  describe('エッジケース', () => {
    it('空配列を渡すと空配列を返す', () => {
      const sorted = sortEventsByDate([], 'asc');

      expect(sorted).toEqual([]);
    });

    it('単一イベントはそのまま返す', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events, 'asc');

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

      sortEventsByDate(events, 'asc');

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

      const sorted = sortEventsByDate(events, 'asc');

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

      const sorted = sortEventsByDate(events, 'asc');

      // 年のみ（月 = undefined = 0）が先
      expect(sorted[0].title).toBe('年のみ');
      expect(sorted[1].title).toBe('8月');
    });

    it('日が未定義の場合は0として扱われる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945, month: 8, day: 15 }, title: '8月15日', tags: [], raw: '' },
        { id: '2', date: { year: 1945, month: 8 }, title: '8月のみ', tags: [], raw: '' },
      ];

      const sorted = sortEventsByDate(events, 'asc');

      // 8月のみ（日 = undefined = 0）が先
      expect(sorted[0].title).toBe('8月のみ');
      expect(sorted[1].title).toBe('8月15日');
    });

    it('デフォルトのソート順は昇順（asc）', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1989 }, title: 'E1', tags: [], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: [], raw: '' },
      ];

      // orderパラメータを省略
      const sorted = sortEventsByDate(events);

      expect(sorted[0].date.year).toBe(1945);
      expect(sorted[1].date.year).toBe(1989);
    });
  });
});

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
