/**
 * TagColumn - Test
 *
 * タグ列コンポーネントのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TagColumn } from './TagColumn';
import type { Column } from '@/lib/utils/types';

describe('TagColumn', () => {
  it('タグ名がヘッダーに表示される', () => {
    const column: Column = {
      tag: '歴史',
      events: [],
    };
    const yearToRowMap = new Map();

    render(<TagColumn column={column} colIndex={0} yearToRowMap={yearToRowMap} />);

    expect(screen.getByText('#歴史')).toBeInTheDocument();
  });

  it('イベントが表示される', () => {
    const column: Column = {
      tag: '歴史',
      events: [
        { id: '1', date: { year: 1543 }, title: '鉄砲伝来', tags: ['歴史'], raw: '' },
      ],
    };
    const yearToRowMap = new Map([[1543, 2]]);

    render(<TagColumn column={column} colIndex={0} yearToRowMap={yearToRowMap} />);

    expect(screen.getByText('鉄砲伝来')).toBeInTheDocument();
    expect(screen.getByText('1543')).toBeInTheDocument();
  });

  it('年月日がある場合はフォーマット表示される', () => {
    const column: Column = {
      tag: '歴史',
      events: [
        { id: '1', date: { year: 1945, month: 8, day: 15 }, title: '終戦', tags: ['歴史'], raw: '' },
      ],
    };
    const yearToRowMap = new Map([[1945, 2]]);

    render(<TagColumn column={column} colIndex={0} yearToRowMap={yearToRowMap} />);

    expect(screen.getByText('1945-08-15')).toBeInTheDocument();
  });
});
