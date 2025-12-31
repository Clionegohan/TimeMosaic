/**
 * TimeMosaic Vite Plugin
 *
 * APIエンドポイントを提供するカスタムプラグイン
 */

import type { Plugin, ViteDevServer } from 'vite';
import path from 'node:path';
import type { FSWatcher } from 'chokidar';
import { getEvents, getTags, getColumns } from './apiHandlers';
import { setupFileWatcher } from './watcher/fileWatcher';

let fileWatcher: FSWatcher | null = null;

/**
 * Events API プラグイン
 *
 * GET /api/events エンドポイント: 全イベントを返す
 * GET /api/tags エンドポイント: 全タグ一覧を返す
 * GET /api/columns エンドポイント: タグで絞り込んだカラムデータを返す
 *
 * @param eventsFilePath - イベントファイルのパス（省略時は sample/events.md）
 */
export function eventsApiPlugin(eventsFilePath?: string): Plugin {
  // イベントファイルのパス
  // 引数で渡されたパスを使用、未設定時はデフォルトパスを使用
  const sampleFilePath = eventsFilePath || path.resolve(process.cwd(), 'sample/events.md');

  return {
    name: 'timemosaic-events-api',
    configureServer(server) {
      // ファイル監視を起動（開発モードのみ）
      if (process.env.NODE_ENV !== 'production') {
        setupFileWatching(server, sampleFilePath);
      }

      server.middlewares.use(async (req, res, next) => {
        // /api/events エンドポイント
        if (req.url === '/api/events' && req.method === 'GET') {
          try {
            const result = await getEvents(sampleFilePath);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result, null, 2));
            return;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: errorMessage }, null, 2));
            return;
          }
        }

        // /api/tags エンドポイント
        if (req.url === '/api/tags' && req.method === 'GET') {
          try {
            const result = await getTags(sampleFilePath);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result, null, 2));
            return;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: errorMessage }, null, 2));
            return;
          }
        }

        // /api/columns エンドポイント
        if (req.url?.startsWith('/api/columns') && req.method === 'GET') {
          try {
            // URLからクエリパラメータを解析
            const url = new URL(req.url, `http://${req.headers.host}`);
            const tagsParam = url.searchParams.get('tags');
            const orderParam = url.searchParams.get('order');

            // クエリパラメータのバリデーション
            if (!tagsParam) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(
                JSON.stringify(
                  {
                    error: 'Missing required parameter: tags',
                    example: '/api/columns?tags=歴史,日本&order=asc',
                  },
                  null,
                  2
                )
              );
              return;
            }

            // タグを配列に変換（空文字列を除外）
            const selectedTags = tagsParam
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);

            // 有効なタグが0件の場合はエラー
            if (selectedTags.length === 0) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(
                JSON.stringify(
                  {
                    error: 'At least one valid tag is required',
                    example: '/api/columns?tags=歴史,日本&order=asc',
                  },
                  null,
                  2
                )
              );
              return;
            }

            // ソート順のバリデーション
            const sortOrder = orderParam === 'desc' ? 'desc' : 'asc';

            // カラムデータを取得
            const result = await getColumns(sampleFilePath, selectedTags, sortOrder);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result, null, 2));
            return;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: errorMessage }, null, 2));
            return;
          }
        }

        // 他のリクエストは次のミドルウェアへ
        next();
      });
    },

    closeBundle() {
      // サーバー終了時のクリーンアップ
      if (fileWatcher) {
        console.log('[VitePlugin] Closing file watcher...');
        fileWatcher.close();
        fileWatcher = null;
      }
    },
  };
}

/**
 * ファイル監視を起動し、ViteのHMR WebSocketで通知
 */
function setupFileWatching(server: ViteDevServer, filePath: string): void {
  // ファイル監視を開始
  fileWatcher = setupFileWatcher({
    filePath,
    onFileChange: (path) => {
      console.log(`[VitePlugin] Notifying clients about file change: ${path}`);

      // ViteのHMR WebSocketを使用してカスタムイベントを送信
      server.ws.send({
        type: 'custom',
        event: 'timemosaic:file-changed',
        data: {
          path,
          timestamp: Date.now(),
        },
      });
    },
  });

  console.log('[VitePlugin] File watcher started (using Vite HMR WebSocket)');
}
