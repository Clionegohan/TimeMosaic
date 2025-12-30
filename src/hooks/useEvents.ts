/**
 * useEvents Hook
 *
 * 全イベントデータを取得するカスタムフック
 */

import { useState, useEffect } from 'react';
import type { Event, ParseError } from '@/lib/parser/types';

interface UseEventsReturn {
  events: Event[];
  errors: ParseError[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * GET /api/events から全イベントデータを取得する
 */
export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [errors, setErrors] = useState<ParseError[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/events');

      if (!response.ok) {
        throw new Error('イベントの取得に失敗しました');
      }

      const data = await response.json();
      setEvents(data.events);
      setErrors(data.errors);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    errors,
    loading,
    error,
    refetch: fetchEvents,
  };
}
