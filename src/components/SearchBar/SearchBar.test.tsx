/**
 * SearchBar - Test
 *
 * 検索バーコンポーネントのテスト
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('SearchBar が正しくレンダリングされる', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('イベントを検索...');
    expect(input).toBeInTheDocument();
  });

  it('プレースホルダーテキストが表示される', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    expect(screen.getByPlaceholderText('イベントを検索...')).toBeInTheDocument();
  });

  it('ユーザー入力時に onChange コールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('イベントを検索...');
    await user.type(input, 'テスト');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('value プロップの値が input 要素に反映される', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="東京" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('イベントを検索...') as HTMLInputElement;
    expect(input.value).toBe('東京');
  });
});
