/**
 * TimeMosaic Vite Plugin
 *
 * /api/events エンドポイントを提供するカスタムプラグイン
 */

import type { Plugin } from 'vite';
import path from 'node:path';
import { readEventsFromFile } from './eventsHandler';

/**
 * Events API プラグイン
 *
 * GET /api/events エンドポイントを提供
 */
export function eventsApiPlugin(): Plugin {
  // サンプルファイルのパス（プロジェクトルートからの相対パス）
  const sampleFilePath = path.resolve(process.cwd(), 'sample/events.md');

  return {
    name: 'timemosaic-events-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // /api/events エンドポイント
        if (req.url === '/api/events' && req.method === 'GET') {
          try {
            // ファイルを読み込んでパース
            const result = await readEventsFromFile(sampleFilePath);

            // JSONレスポンスを返す
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result, null, 2));
          } catch (error) {
            // エラーハンドリング
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(
              JSON.stringify(
                {
                  error: errorMessage,
                },
                null,
                2
              )
            );
          }
        } else {
          // 他のリクエストは次のミドルウェアへ
          next();
        }
      });
    },
  };
}
