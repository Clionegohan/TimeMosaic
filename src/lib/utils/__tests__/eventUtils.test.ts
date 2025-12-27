/**
 * TimeMosaic イベントユーティリティ関数 - 単体テスト
 */

import { describe, it, expect } from 'vitest';
import { extractAllTags } from '../eventUtils';
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
