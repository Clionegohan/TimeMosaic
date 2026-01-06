/**
 * MultiColumnView - Test
 *
 * マルチカラムビューコンポーネントのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MultiColumnView } from './MultiColumnView';
import type { Column } from '@/lib/utils/types';
import type { Event } from '@/lib/parser/types';

// モックイベント
const mockEvent1: Event = {
  id: '1',
  date: { year: 1543 },
  title: 'Mock Event 1',
  tags: ['歴史'],
  raw: '',
};

const mockEvent2: Event = {
  id: '2',
  date: { year: 1945 },
  title: 'Mock Event 2',
  tags: ['日本'],
  raw: '',
};

const mockEvent3: Event = {
  id: '3',
  date: { year: 1543 },
  title: 'Mock Event 3',
  tags: ['スポーツ'],
  raw: '',
};

describe('MultiColumnView', () => {
  it('Timeline列とタグ列が表示される', () => {
    const timelineYears = [1543, 1945, 1964];
    const columns: Column[] = [
      {
        tag: '歴史',
        events: [
          { id: '1', date: { year: 1543 }, title: '鉄砲伝来', tags: ['歴史'], raw: '' },
        ],
      },
    ];

    render(<MultiColumnView timelineYears={timelineYears} columns={columns} />);

    // Timeline列のヘッダー
    expect(screen.getByText('Timeline')).toBeInTheDocument();

    // 年が表示される (複数の要素に含まれる可能性があるのでAllByを使用)
    expect(screen.getAllByText('1543').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1945').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1964').length).toBeGreaterThan(0);

    // タグ列のヘッダー (完全一致)
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === '#歴史' && element.classList.contains('sticky');
      })
    ).toBeInTheDocument();

    // イベントが表示される
    expect(screen.getByText('鉄砲伝来')).toBeInTheDocument();
  });

  it('複数のタグ列が表示される', () => {
    const timelineYears = [1543, 1945];
    const columns: Column[] = [
      { tag: '歴史', events: [mockEvent1] },
      { tag: '日本', events: [mockEvent2] },
      { tag: 'スポーツ', events: [mockEvent3] },
    ];

    render(<MultiColumnView timelineYears={timelineYears} columns={columns} />);

    // タグ列のヘッダーが表示される (stickyクラスで識別)
    expect(
      screen.getByText((_unusedContent, element) => {
        return element?.textContent === '#歴史' && element.classList.contains('sticky');
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((_unusedContent, element) => {
        return element?.textContent === '#日本' && element.classList.contains('sticky');
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((_unusedContent, element) => {
        return element?.textContent === '#スポーツ' && element.classList.contains('sticky');
      })
    ).toBeInTheDocument();
  });

  it('Timeline列とタグ列が横並びに表示される', () => {
    const timelineYears = [1543];
    const columns: Column[] = [{ tag: '歴史', events: [] }, { tag: '日本', events: [] }];

    const { container } = render(<MultiColumnView timelineYears={timelineYears} columns={columns} />);

    // Flexレイアウトコンテナが存在すること
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toBeInTheDocument();

    // Timeline列とタグ列が存在すること
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('#歴史')).toBeInTheDocument();
    expect(screen.getByText('#日本')).toBeInTheDocument();
  });
});
