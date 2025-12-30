/**
 * useTags Hook - Test
 *
 * AC1の一部: タグ一覧を取得できる
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTags } from '../useTags';

describe('useTags', () => {
  beforeEach(() => {
    // fetch のモック化
    globalThis.fetch = vi.fn();
  });

  it('初期状態では loading が true である', () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tags: ['歴史', '日本'], count: 2 }),
    } as Response);

    const { result } = renderHook(() => useTags());

    expect(result.current.loading).toBe(true);
    expect(result.current.tags).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('タグ一覧を取得できる', async () => {
    const mockTags = ['歴史', '日本', 'スポーツ'];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tags: mockTags, count: 3 }),
    } as Response);

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tags).toEqual(mockTags);
    expect(result.current.error).toBeNull();
  });

  it('/api/tags エンドポイントを呼び出す', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tags: ['歴史'], count: 1 }),
    } as Response);

    renderHook(() => useTags());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/tags');
    });
  });

  it('APIエラー時にエラーメッセージをセットする', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('タグの取得に失敗しました');
    expect(result.current.tags).toEqual([]);
  });

  it('ネットワークエラー時にエラーメッセージをセットする', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.tags).toEqual([]);
  });

  it('refetch でデータを再取得できる', async () => {
    const mockTags1 = ['歴史', '日本'];
    const mockTags2 = ['歴史', '日本', 'スポーツ'];

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tags: mockTags1, count: 2 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tags: mockTags2, count: 3 }),
      } as Response);

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.tags).toEqual(mockTags1);
    });

    // refetch を実行
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.tags).toEqual(mockTags2);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
