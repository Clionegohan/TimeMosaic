/**
 * TimeMosaic イベントユーティリティ - createColumns 単体テスト
 */

import { describe, it, expect } from 'vitest';
import { createColumns } from '../createColumns';
import type { Event } from '../../parser/types';

describe('createColumns', () => {
  describe('正常系', () => {
    it('選択したタグから正しく列データを生成できる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: '終戦記念日', tags: ['歴史', '日本'], raw: '' },
        { id: '2', date: { year: 1964 }, title: '東京オリンピック', tags: ['スポーツ', '日本'], raw: '' },
        { id: '3', date: { year: 1914 }, title: '第一次世界大戦', tags: ['歴史', '戦争'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史', '日本'], 'asc');

      expect(columns).toHaveLength(2);
      expect(columns[0].tag).toBe('歴史');
      expect(columns[1].tag).toBe('日本');
    });

    it('各列に正しいイベントが含まれる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: '終戦記念日', tags: ['歴史', '日本'], raw: '' },
        { id: '2', date: { year: 1964 }, title: '東京オリンピック', tags: ['スポーツ', '日本'], raw: '' },
        { id: '3', date: { year: 1914 }, title: '第一次世界大戦', tags: ['歴史', '戦争'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史', '日本'], 'asc');

      // 歴史列には2つのイベント
      expect(columns[0].events).toHaveLength(2);
      expect(columns[0].events[0].title).toBe('第一次世界大戦');
      expect(columns[0].events[1].title).toBe('終戦記念日');

      // 日本列には2つのイベント
      expect(columns[1].events).toHaveLength(2);
      expect(columns[1].events[0].title).toBe('終戦記念日');
      expect(columns[1].events[1].title).toBe('東京オリンピック');
    });

    it('各列のイベントが昇順でソートされている', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1989 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: ['歴史'], raw: '' },
        { id: '3', date: { year: 1964 }, title: 'E3', tags: ['歴史'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史'], 'asc');

      expect(columns[0].events).toHaveLength(3);
      expect(columns[0].events[0].date.year).toBe(1945);
      expect(columns[0].events[1].date.year).toBe(1964);
      expect(columns[0].events[2].date.year).toBe(1989);
    });

    it('各列のイベントが降順でソートされている', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1989 }, title: 'E2', tags: ['歴史'], raw: '' },
        { id: '3', date: { year: 1964 }, title: 'E3', tags: ['歴史'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史'], 'desc');

      expect(columns[0].events).toHaveLength(3);
      expect(columns[0].events[0].date.year).toBe(1989);
      expect(columns[0].events[1].date.year).toBe(1964);
      expect(columns[0].events[2].date.year).toBe(1945);
    });

    it('複数の列を生成できる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史', '日本'], raw: '' },
        { id: '2', date: { year: 1964 }, title: 'E2', tags: ['スポーツ', '日本'], raw: '' },
        { id: '3', date: { year: 1914 }, title: 'E3', tags: ['歴史', '戦争'], raw: '' },
        { id: '4', date: { year: 1989 }, title: 'E4', tags: ['ドイツ', '冷戦'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史', '日本', 'スポーツ', 'ドイツ'], 'asc');

      expect(columns).toHaveLength(4);
      expect(columns[0].tag).toBe('歴史');
      expect(columns[1].tag).toBe('日本');
      expect(columns[2].tag).toBe('スポーツ');
      expect(columns[3].tag).toBe('ドイツ');
    });

    it('選択タグの順序で列が返される', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史', '日本'], raw: '' },
      ];

      // 日本、歴史の順
      const columns1 = createColumns(events, ['日本', '歴史'], 'asc');
      expect(columns1[0].tag).toBe('日本');
      expect(columns1[1].tag).toBe('歴史');

      // 歴史、日本の順
      const columns2 = createColumns(events, ['歴史', '日本'], 'asc');
      expect(columns2[0].tag).toBe('歴史');
      expect(columns2[1].tag).toBe('日本');
    });
  });

  describe('エッジケース', () => {
    it('空配列の選択タグで空配列を返す', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史'], raw: '' },
      ];

      const columns = createColumns(events, [], 'asc');

      expect(columns).toEqual([]);
    });

    it('存在しないタグを選択した場合は空の列を返す', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: 'E1', tags: ['歴史'], raw: '' },
      ];

      const columns = createColumns(events, ['存在しないタグ'], 'asc');

      expect(columns).toHaveLength(1);
      expect(columns[0].tag).toBe('存在しないタグ');
      expect(columns[0].events).toHaveLength(0);
    });

    it('元の配列を変更しない（イミュータビリティ）', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1989 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: ['歴史'], raw: '' },
      ];

      const original = [...events];

      createColumns(events, ['歴史'], 'asc');

      // 元の配列は変更されていない
      expect(events).toEqual(original);
      expect(events[0].date.year).toBe(1989);
    });

    it('空のイベント配列で空の列を返す', () => {
      const columns = createColumns([], ['歴史'], 'asc');

      expect(columns).toHaveLength(1);
      expect(columns[0].tag).toBe('歴史');
      expect(columns[0].events).toHaveLength(0);
    });

    it('デフォルトのソート順は昇順（asc）', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1989 }, title: 'E1', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1945 }, title: 'E2', tags: ['歴史'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史']);

      expect(columns[0].events[0].date.year).toBe(1945);
      expect(columns[0].events[1].date.year).toBe(1989);
    });
  });

  describe('統合的なテスト', () => {
    it('同じイベントが複数の列に表示される', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945 }, title: '終戦記念日', tags: ['歴史', '日本', '戦争'], raw: '' },
        { id: '2', date: { year: 1964 }, title: '東京オリンピック', tags: ['スポーツ', '日本'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史', '日本', '戦争'], 'asc');

      // 終戦記念日は3つの列全てに表示される
      expect(columns[0].events.find((e) => e.id === '1')).toBeDefined(); // 歴史列
      expect(columns[1].events.find((e) => e.id === '1')).toBeDefined(); // 日本列
      expect(columns[2].events.find((e) => e.id === '1')).toBeDefined(); // 戦争列

      // 東京オリンピックは日本列のみ
      expect(columns[0].events.find((e) => e.id === '2')).toBeUndefined(); // 歴史列にはない
      expect(columns[1].events.find((e) => e.id === '2')).toBeDefined(); // 日本列にある
      expect(columns[2].events.find((e) => e.id === '2')).toBeUndefined(); // 戦争列にはない
    });

    it('実際のユースケースに近いデータで正しく動作する', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1543 }, title: '鉄砲伝来', tags: ['歴史', '日本', '貿易'], raw: '' },
        { id: '2', date: { year: 1868 }, title: '明治維新', tags: ['歴史', '日本', '政治'], raw: '' },
        { id: '3', date: { year: 1889 }, title: 'エッフェル塔完成', tags: ['建築', 'フランス'], raw: '' },
        { id: '4', date: { year: 1945 }, title: '終戦記念日', tags: ['歴史', '日本', '戦争'], raw: '' },
        { id: '5', date: { year: 1964 }, title: '東京オリンピック', tags: ['スポーツ', '日本'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史', '日本'], 'asc');

      // 歴史列: 鉄砲伝来、明治維新、終戦記念日
      expect(columns[0].tag).toBe('歴史');
      expect(columns[0].events).toHaveLength(3);
      expect(columns[0].events[0].title).toBe('鉄砲伝来');
      expect(columns[0].events[1].title).toBe('明治維新');
      expect(columns[0].events[2].title).toBe('終戦記念日');

      // 日本列: 鉄砲伝来、明治維新、終戦記念日、東京オリンピック
      expect(columns[1].tag).toBe('日本');
      expect(columns[1].events).toHaveLength(4);
      expect(columns[1].events[0].title).toBe('鉄砲伝来');
      expect(columns[1].events[1].title).toBe('明治維新');
      expect(columns[1].events[2].title).toBe('終戦記念日');
      expect(columns[1].events[3].title).toBe('東京オリンピック');

      // エッフェル塔はどちらの列にも含まれない
      expect(columns[0].events.find((e) => e.id === '3')).toBeUndefined();
      expect(columns[1].events.find((e) => e.id === '3')).toBeUndefined();
    });

    it('年月日が混在する複雑なデータでも正しくソートされる', () => {
      const events: Event[] = [
        { id: '1', date: { year: 1945, month: 8, day: 15 }, title: '終戦記念日', tags: ['歴史'], raw: '' },
        { id: '2', date: { year: 1945 }, title: '1945年のイベント', tags: ['歴史'], raw: '' },
        { id: '3', date: { year: 1945, month: 1 }, title: '1945年1月', tags: ['歴史'], raw: '' },
        { id: '4', date: { year: 1964, month: 10, day: 10 }, title: '東京オリンピック', tags: ['歴史'], raw: '' },
      ];

      const columns = createColumns(events, ['歴史'], 'asc');

      expect(columns[0].events).toHaveLength(4);
      expect(columns[0].events[0].title).toBe('1945年のイベント'); // 年のみが最初
      expect(columns[0].events[1].title).toBe('1945年1月'); // 次に1月
      expect(columns[0].events[2].title).toBe('終戦記念日'); // 8月15日
      expect(columns[0].events[3].title).toBe('東京オリンピック'); // 1964年
    });
  });
});
