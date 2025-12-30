/**
 * SortSelector - Test
 *
 * ソート順選択コンポーネントのテスト
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortSelector } from './SortSelector';

describe('SortSelector', () => {
  it('SortSelector が正しくレンダリングされる', () => {
    const mockOnChange = vi.fn();
    render(<SortSelector value="asc" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('「古い順」と「新しい順」の選択肢が表示される', () => {
    const mockOnChange = vi.fn();
    render(<SortSelector value="asc" onChange={mockOnChange} />);

    expect(screen.getByText('古い順')).toBeInTheDocument();
    expect(screen.getByText('新しい順')).toBeInTheDocument();
  });

  it('ユーザー選択時に onChange コールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<SortSelector value="asc" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'desc');

    expect(mockOnChange).toHaveBeenCalledWith('desc');
  });

  it('value プロップの値が select 要素に反映される', () => {
    const mockOnChange = vi.fn();
    render(<SortSelector value="desc" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('desc');
  });

  it('デフォルト値として "asc" が選択されている場合、「古い順」が選択状態になる', () => {
    const mockOnChange = vi.fn();
    render(<SortSelector value="asc" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('asc');

    const selectedOption = screen.getByRole('option', { name: '古い順' }) as HTMLOptionElement;
    expect(selectedOption.selected).toBe(true);
  });
});
