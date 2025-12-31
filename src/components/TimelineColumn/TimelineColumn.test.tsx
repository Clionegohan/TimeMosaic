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
    const yearPositions = [100, 4120, 4310]; // 比例間隔の位置

    render(<TimelineColumn years={years} yearPositions={yearPositions} />);

    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('1543')).toBeInTheDocument();
    expect(screen.getByText('1945')).toBeInTheDocument();
    expect(screen.getByText('1964')).toBeInTheDocument();
  });

  it('縦線が表示される', () => {
    const years = [1543];
    const yearPositions = [100];

    const { container } = render(<TimelineColumn years={years} yearPositions={yearPositions} />);

    // 縦線はborder-l-2クラスを持つdivとして存在
    const verticalLine = container.querySelector('.border-l-2');
    expect(verticalLine).toBeInTheDocument();
  });
});
