/**
 * useColumns Hook - Test
 *
 * AC4: カラムデータ取得機能
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useColumns } from '../useColumns';
import type { Column } from '@/lib/utils/types';

describe('useColumns', () => {
  beforeEach(() => {
    // fetch のモック化
    globalThis.fetch = vi.fn();
  });

  it('初期状態では loading が true である（タグが選択されている場合）', () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        columns: [],
        metadata: { selectedTags: ['歴史'], sortOrder: 'asc', totalEvents: 0 },
      }),
    } as Response);

    const { result } = renderHook(() => useColumns(['歴史'], 'asc'));

    expect(result.current.loading).toBe(true);
    expect(result.current.columns).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('タグが空の場合はAPIを呼び出さない', () => {
    const { result } = renderHook(() => useColumns([], 'asc'));

    expect(result.current.loading).toBe(false);
    expect(result.current.columns).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('カラムデータを取得できる', async () => {
    const mockColumns: Column[] = [
      {
        tag: '歴史',
        events: [
          {
            id: '1',
            date: { year: 1543 },
            title: '鉄砲伝来',
            tags: ['歴史', '日本'],
            raw: '',
          },
        ],
      },
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        columns: mockColumns,
        metadata: { selectedTags: ['歴史'], sortOrder: 'asc', totalEvents: 10 },
      }),
    } as Response);

    const { result } = renderHook(() => useColumns(['歴史'], 'asc'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.columns).toEqual(mockColumns);
    expect(result.current.metadata).toEqual({
      selectedTags: ['歴史'],
      sortOrder: 'asc',
      totalEvents: 10,
    });
    expect(result.current.error).toBeNull();
  });

  it('/api/columns エンドポイントを正しいパラメータで呼び出す', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        columns: [],
        metadata: { selectedTags: ['歴史', '日本'], sortOrder: 'desc', totalEvents: 0 },
      }),
    } as Response);

    renderHook(() => useColumns(['歴史', '日本'], 'desc'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/columns?tags=%E6%AD%B4%E5%8F%B2,%E6%97%A5%E6%9C%AC&order=desc'
      );
    });
  });

  it('複数タグでカラムデータを取得できる', async () => {
    const mockColumns: Column[] = [
      {
        tag: '歴史',
        events: [
          {
            id: '1',
            date: { year: 1543 },
            title: '鉄砲伝来',
            tags: ['歴史', '日本'],
            raw: '',
          },
        ],
      },
      {
        tag: '日本',
        events: [
          {
            id: '1',
            date: { year: 1543 },
            title: '鉄砲伝来',
            tags: ['歴史', '日本'],
            raw: '',
          },
        ],
      },
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        columns: mockColumns,
        metadata: { selectedTags: ['歴史', '日本'], sortOrder: 'asc', totalEvents: 10 },
      }),
    } as Response);

    const { result } = renderHook(() => useColumns(['歴史', '日本'], 'asc'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.columns).toHaveLength(2);
  });

  it('APIエラー時にエラーメッセージをセットする', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useColumns(['歴史'], 'asc'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('カラムデータの取得に失敗しました');
    expect(result.current.columns).toEqual([]);
  });

  it('ネットワークエラー時にエラーメッセージをセットする', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useColumns(['歴史'], 'asc'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.columns).toEqual([]);
  });

  it('selectedTags が変更されたら再フェッチする', async () => {
    const mockColumns1: Column[] = [
      {
        tag: '歴史',
        events: [],
      },
    ];
    const mockColumns2: Column[] = [
      {
        tag: '歴史',
        events: [],
      },
      {
        tag: '日本',
        events: [],
      },
    ];

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          columns: mockColumns1,
          metadata: { selectedTags: ['歴史'], sortOrder: 'asc', totalEvents: 10 },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          columns: mockColumns2,
          metadata: { selectedTags: ['歴史', '日本'], sortOrder: 'asc', totalEvents: 10 },
        }),
      } as Response);

    const { result, rerender } = renderHook(
      ({ tags, order }) => useColumns(tags, order),
      {
        initialProps: { tags: ['歴史'], order: 'asc' as const },
      }
    );

    await waitFor(() => {
      expect(result.current.columns).toEqual(mockColumns1);
    });

    // selectedTags を変更
    rerender({ tags: ['歴史', '日本'], order: 'asc' as const });

    await waitFor(() => {
      expect(result.current.columns).toEqual(mockColumns2);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('sortOrder が変更されたら再フェッチする', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          columns: [],
          metadata: { selectedTags: ['歴史'], sortOrder: 'asc', totalEvents: 10 },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          columns: [],
          metadata: { selectedTags: ['歴史'], sortOrder: 'desc', totalEvents: 10 },
        }),
      } as Response);

    const { result, rerender } = renderHook(
      ({ tags, order }) => useColumns(tags, order),
      {
        initialProps: { tags: ['歴史'], order: 'asc' as const },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // sortOrder を変更
    rerender({ tags: ['歴史'], order: 'desc' as const });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/columns?tags=%E6%AD%B4%E5%8F%B2&order=desc');
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('refetch でデータを再取得できる', async () => {
    const mockColumns1: Column[] = [
      {
        tag: '歴史',
        events: [],
      },
    ];
    const mockColumns2: Column[] = [
      {
        tag: '歴史',
        events: [
          {
            id: '1',
            date: { year: 1543 },
            title: '鉄砲伝来',
            tags: ['歴史'],
            raw: '',
          },
        ],
      },
    ];

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          columns: mockColumns1,
          metadata: { selectedTags: ['歴史'], sortOrder: 'asc', totalEvents: 0 },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          columns: mockColumns2,
          metadata: { selectedTags: ['歴史'], sortOrder: 'asc', totalEvents: 1 },
        }),
      } as Response);

    const { result } = renderHook(() => useColumns(['歴史'], 'asc'));

    await waitFor(() => {
      expect(result.current.columns).toEqual(mockColumns1);
    });

    // refetch を実行
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.columns).toEqual(mockColumns2);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
