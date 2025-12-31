/**
 * fileWatcher.ts
 *
 * Chokidarを使用してMarkdownファイルを監視し、
 * 変更時にWebSocketクライアントに通知する
 */

import chokidar, { type FSWatcher } from 'chokidar';
import type { WebSocketServer } from 'ws';

export interface FileWatcherOptions {
  filePath: string;
  onFileChange?: (path: string) => void;
}

/**
 * ファイル監視を開始する
 *
 * @param options - 監視オプション
 * @param wss - WebSocketサーバーインスタンス（オプション）
 * @returns Chokidar watcher インスタンス
 */
export function setupFileWatcher(
  options: FileWatcherOptions,
  wss?: WebSocketServer
): FSWatcher {
  const { filePath, onFileChange } = options;

  console.log(`[FileWatcher] Watching file: ${filePath}`);

  const watcher = chokidar.watch(filePath, {
    persistent: true,
    ignoreInitial: true, // 初回読み込み時の変更は無視
    awaitWriteFinish: {
      // ファイル書き込み完了まで待機（エディタの中間保存を防ぐ）
      stabilityThreshold: 300,
      pollInterval: 100,
    },
  });

  watcher.on('change', (path) => {
    console.log(`[FileWatcher] File changed: ${path}`);

    // カスタムコールバック実行
    if (onFileChange) {
      onFileChange(path);
    }

    // WebSocketクライアントに通知
    if (wss) {
      broadcastFileChange(wss, path);
    }
  });

  watcher.on('error', (error) => {
    console.error(`[FileWatcher] Error:`, error);
  });

  return watcher;
}

/**
 * 全WebSocketクライアントにファイル変更を通知
 *
 * @param wss - WebSocketサーバーインスタンス
 * @param path - 変更されたファイルパス
 */
function broadcastFileChange(wss: WebSocketServer, path: string): void {
  const message = JSON.stringify({
    type: 'file-changed',
    path,
    timestamp: Date.now(),
  });

  let clientCount = 0;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // WebSocket.OPEN
      client.send(message);
      clientCount++;
    }
  });

  console.log(`[FileWatcher] Notified ${clientCount} client(s)`);
}
