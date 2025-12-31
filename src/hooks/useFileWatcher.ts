/**
 * useFileWatcher.ts
 *
 * ViteのHMR WebSocketでファイル変更通知を受け取り、
 * コールバック関数を実行するカスタムフック
 */

import { useEffect } from 'react';

/**
 * ファイル変更を監視し、変更時にコールバックを実行
 * ViteのHMR (Hot Module Replacement) WebSocketを利用
 *
 * @param onFileChange - ファイル変更時に実行するコールバック
 */
export function useFileWatcher(onFileChange: () => void): void {
  useEffect(() => {
    // 開発環境でのみ有効
    if (import.meta.env.PROD || !import.meta.hot) {
      return;
    }

    // HMR APIが完全に実装されているか確認（on/off メソッドの存在確認）
    if (typeof import.meta.hot.on !== 'function' || typeof import.meta.hot.off !== 'function') {
      return;
    }

    console.log('[useFileWatcher] Listening for file changes via Vite HMR');

    // ViteのHMRカスタムイベントをリスン
    const handleFileChange = (data: { path: string; timestamp: number }) => {
      console.log('[useFileWatcher] File changed:', data.path, 'at', data.timestamp);
      onFileChange();
    };

    import.meta.hot.on('timemosaic:file-changed', handleFileChange);

    // クリーンアップ
    return () => {
      if (import.meta.hot && typeof import.meta.hot.off === 'function') {
        import.meta.hot.off('timemosaic:file-changed', handleFileChange);
      }
    };
  }, [onFileChange]);
}
