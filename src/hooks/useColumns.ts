/**
 * useColumns Hook
 *
 * カラムデータを取得するカスタムフック
 */

import { useState, useEffect, useCallback } from 'react';
import type { Column } from '@/lib/utils/types';
import { useFileWatcher } from './useFileWatcher';

interface ColumnsMetadata {
  selectedTags: string[];
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
 */
export function useColumns(selectedTags: string[]): UseColumnsReturn {
  const [columns, setColumns] = useState<Column[]>([]);
  const [metadata, setMetadata] = useState<ColumnsMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type ColumnsApiResponse = {
    columns: Column[];
    metadata?: {
      selectedTags?: string[];
      totalEvents?: number;
    };
  };

  const fetchColumns = useCallback(async () => {
    // タグが選択されていない場合は空を返す
    if (selectedTags.length === 0) {
      setColumns([]);
      setMetadata(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tagsParam = selectedTags.map(encodeURIComponent).join(',');
      const response = await fetch(`/api/columns?tags=${tagsParam}`);

      if (!response.ok) {
        throw new Error('カラムデータの取得に失敗しました');
      }

      const data = (await response.json()) as ColumnsApiResponse;
      const nextColumns = data.columns ?? [];

      setColumns(nextColumns);
      setMetadata({
        selectedTags: data.metadata?.selectedTags ?? selectedTags,
        totalEvents: data.metadata?.totalEvents ?? nextColumns.reduce((acc, column) => acc + column.events.length, 0),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setLoading(false);
    }
  }, [selectedTags]);

  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

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
