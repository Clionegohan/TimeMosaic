/**
 * useTags Hook
 *
 * タグ一覧を取得するカスタムフック
 */

import { useState, useEffect, useCallback } from 'react';
import { useFileWatcher } from './useFileWatcher';

interface UseTagsReturn {
  tags: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * GET /api/tags からタグ一覧を取得する
 */
export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tags');

      if (!response.ok) {
        throw new Error('タグの取得に失敗しました');
      }

      const data = await response.json();
      setTags(data.tags);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // ファイル変更時に自動再取得
  useFileWatcher(fetchTags);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
  };
}
