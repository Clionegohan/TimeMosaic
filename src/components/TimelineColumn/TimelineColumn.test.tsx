/**
 * TimelineColumn - Test
 *
 * Timeline列コンポーネントのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimelineColumn } from './TimelineColumn';

describe('TimelineColumn', () => {
  it('年リストが表示される', () => {
    const years = [1543, 1945, 1964];
    const yearToRowMap = new Map([
      [1543, 2],
      [1945, 3],
      [1964, 4],
    ]);

    render(<TimelineColumn years={years} yearToRowMap={yearToRowMap} />);

    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('1543')).toBeInTheDocument();
    expect(screen.getByText('1945')).toBeInTheDocument();
    expect(screen.getByText('1964')).toBeInTheDocument();
  });

  it('縦線（│）が表示される', () => {
    const years = [1543];
    const yearToRowMap = new Map([[1543, 2]]);

    const { container } = render(<TimelineColumn years={years} yearToRowMap={yearToRowMap} />);

    expect(container.textContent).toContain('│');
  });
});
