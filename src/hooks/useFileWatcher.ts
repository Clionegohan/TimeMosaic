/**
 * useFileWatcher.ts
 *
 * WebSocketでファイル変更通知を受け取り、
 * コールバック関数を実行するカスタムフック
 */

import { useEffect, useRef, useCallback } from 'react';

export interface FileWatcherMessage {
  type: string;
  path?: string;
  timestamp?: number;
}

/**
 * ファイル変更を監視し、変更時にコールバックを実行
 *
 * @param onFileChange - ファイル変更時に実行するコールバック
 */
export function useFileWatcher(onFileChange: () => void): void {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // 開発環境でのみWebSocket接続
    if (import.meta.env.PROD) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    console.log('[useFileWatcher] Connecting to WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[useFileWatcher] WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data: FileWatcherMessage = JSON.parse(event.data);

        if (data.type === 'file-changed') {
          console.log('[useFileWatcher] File changed, triggering refetch');
          onFileChange();
        }
      } catch (error) {
        console.error('[useFileWatcher] Failed to parse message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('[useFileWatcher] WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('[useFileWatcher] WebSocket disconnected, reconnecting in 3s...');

      // 3秒後に再接続を試行
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    wsRef.current = ws;
  }, [onFileChange]);

  useEffect(() => {
    connect();

    // クリーンアップ
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);
}
