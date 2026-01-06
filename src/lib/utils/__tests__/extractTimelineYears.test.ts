/**
 * extractTimelineYears - Test
 *
 * カラムデータからTimeline用の年リストを抽出する関数のテスト
 */

import { describe, it, expect } from 'vitest';
import { extractTimelineYears } from '../extractTimelineYears';
import type { Column } from '../types';

describe('extractTimelineYears', () => {
  it('全イベントから年リストを抽出する', () => {
    const columns: Column[] = [
      {
        tag: '歴史',
        events: [
          { id: '1', date: { year: 1543 }, title: '', tags: [], raw: '' },
          { id: '2', date: { year: 1945 }, title: '', tags: [], raw: '' },
        ],
      },
      {
        tag: '日本',
        events: [{ id: '3', date: { year: 1964 }, title: '', tags: [], raw: '' }],
      },
    ];

    const result = extractTimelineYears(columns);

    expect(result).toEqual([1543, 1945, 1964]);
  });

  it('重複した年は1つにまとめられる', () => {
    const columns: Column[] = [
      {
        tag: '歴史',
        events: [{ id: '1', date: { year: 1945 }, title: '', tags: [], raw: '' }],
      },
      {
        tag: '日本',
        events: [{ id: '2', date: { year: 1945 }, title: '', tags: [], raw: '' }],
      },
    ];

    const result = extractTimelineYears(columns);

    expect(result).toEqual([1945]);
  });

  it('昇順でソートされる', () => {
    const columns: Column[] = [
      {
        tag: '歴史',
        events: [
          { id: '1', date: { year: 1964 }, title: '', tags: [], raw: '' },
          { id: '2', date: { year: 1543 }, title: '', tags: [], raw: '' },
          { id: '3', date: { year: 1945 }, title: '', tags: [], raw: '' },
        ],
      },
    ];

    const result = extractTimelineYears(columns);

    expect(result).toEqual([1543, 1945, 1964]);
  });

  it('降順でソートされる', () => {
    const columns: Column[] = [
      {
        tag: '歴史',
        events: [
          { id: '1', date: { year: 1543 }, title: '', tags: [], raw: '' },
          { id: '2', date: { year: 1945 }, title: '', tags: [], raw: '' },
          { id: '3', date: { year: 1964 }, title: '', tags: [], raw: '' },
        ],
      },
    ];

    const result = extractTimelineYears(columns);

    expect(result).toEqual([1543, 1945, 1964]);
  });

  it('空のカラムリストの場合は空配列を返す', () => {
    const result = extractTimelineYears([]);

    expect(result).toEqual([]);
  });
});
