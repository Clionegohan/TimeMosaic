/**
 * useEvents Hook - Test
 *
 * AC1の一部: 全イベントデータを取得できる
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEvents } from '../useEvents';
import type { Event, ParseError } from '@/lib/parser/types';

describe('useEvents', () => {
  beforeEach(() => {
    // fetch のモック化
    globalThis.fetch = vi.fn();
  });

  it('初期状態では loading が true である', () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [], errors: [] }),
    } as Response);

    const { result } = renderHook(() => useEvents());

    expect(result.current.loading).toBe(true);
    expect(result.current.events).toEqual([]);
    expect(result.current.errors).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('全イベントデータを取得できる', async () => {
    const mockEvents: Event[] = [
      {
        id: '1',
        date: { year: 1543 },
        title: '鉄砲伝来',
        tags: ['歴史', '日本'],
        raw: '',
      },
      {
        id: '2',
        date: { year: 1945, month: 8, day: 15 },
        title: '終戦',
        tags: ['歴史', '日本'],
        raw: '',
      },
    ];
    const mockErrors: ParseError[] = [];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: mockEvents, errors: mockErrors }),
    } as Response);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.errors).toEqual(mockErrors);
    expect(result.current.error).toBeNull();
  });

  it('/api/events エンドポイントを呼び出す', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [], errors: [] }),
    } as Response);

    renderHook(() => useEvents());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/events');
    });
  });

  it('APIエラー時にエラーメッセージをセットする', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('イベントの取得に失敗しました');
    expect(result.current.events).toEqual([]);
    expect(result.current.errors).toEqual([]);
  });

  it('ネットワークエラー時にエラーメッセージをセットする', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.events).toEqual([]);
  });

  it('パースエラーも含めて返す', async () => {
    const mockEvents: Event[] = [
      {
        id: '1',
        date: { year: 1543 },
        title: '鉄砲伝来',
        tags: ['歴史'],
        raw: '',
      },
    ];
    const mockErrors: ParseError[] = [
      {
        line: 10,
        message: 'Invalid date format',
        raw: '不正な行',
      },
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: mockEvents, errors: mockErrors }),
    } as Response);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.errors).toEqual(mockErrors);
  });

  it('refetch でデータを再取得できる', async () => {
    const mockEvents1: Event[] = [
      {
        id: '1',
        date: { year: 1543 },
        title: '鉄砲伝来',
        tags: ['歴史'],
        raw: '',
      },
    ];
    const mockEvents2: Event[] = [
      {
        id: '1',
        date: { year: 1543 },
        title: '鉄砲伝来',
        tags: ['歴史'],
        raw: '',
      },
      {
        id: '2',
        date: { year: 1945 },
        title: '終戦',
        tags: ['歴史'],
        raw: '',
      },
    ];

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: mockEvents1, errors: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: mockEvents2, errors: [] }),
      } as Response);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.events).toEqual(mockEvents1);
    });

    // refetch を実行
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.events).toEqual(mockEvents2);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
