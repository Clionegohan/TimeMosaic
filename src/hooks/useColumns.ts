/**
 * useColumns Hook
 *
 * カラムデータを取得するカスタムフック
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Column } from '@/lib/utils/types';
import { useFileWatcher } from './useFileWatcher';

interface ColumnsMetadata {
  selectedTags: string[];
  sortOrder: 'asc' | 'desc';
  totalEvents: number;
}

interface UseColumnsReturn {
  columns: Column[];
  metadata: ColumnsMetadata | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * GET /api/columns からカラムデータを取得する
 *
 * @param selectedTags 選択されたタグ配列
 * @param sortOrder ソート順（'asc' または 'desc'）
 */
export function useColumns(selectedTags: string[], _sortOrder?: 'asc' | 'desc'): UseColumnsReturn {
  const [columns, setColumns] = useState<Column[]>([]);
  const [metadata, setMetadata] = useState<ColumnsMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // refetch関数を安定化させるためのref
  const selectedTagsRef = useRef(selectedTags);

  // 値を更新
  selectedTagsRef.current = selectedTags;

  type ColumnsApiResponse = {
    columns: Column[];
    metadata?: {
      selectedTags?: string[];
      sortOrder?: 'asc' | 'desc';
      totalEvents?: number;
    };
  };

  const fetchColumns = useCallback(async () => {
    const tags = selectedTagsRef.current;

    // タグが選択されていない場合は空を返す
    if (tags.length === 0) {
      setColumns([]);
      setMetadata(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tagsParam = tags.map(encodeURIComponent).join(',');
      const response = await fetch(`/api/columns?tags=${tagsParam}`);

      if (!response.ok) {
        throw new Error('カラムデータの取得に失敗しました');
      }

      const data = (await response.json()) as ColumnsApiResponse;
      const nextColumns = data.columns ?? [];

      setColumns(nextColumns);
      setMetadata({
        selectedTags: data.metadata?.selectedTags ?? tags,
        sortOrder: data.metadata?.sortOrder === 'desc' ? 'desc' : 'asc',
        totalEvents: data.metadata?.totalEvents ?? nextColumns.reduce((acc, column) => acc + column.events.length, 0),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setLoading(false);
    }
  }, []);

  // 配列をJSON文字列に変換して比較（より安全）
  const tagsKey = useMemo(() => JSON.stringify(selectedTags), [selectedTags]);

  useEffect(() => {
    fetchColumns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsKey]);

  // ファイル変更時に自動再取得
  useFileWatcher(fetchColumns);

  return {
    columns,
    metadata,
    loading,
    error,
    refetch: fetchColumns,
  };
}
