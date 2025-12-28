/**
 * TimeMosaic Vite Plugin
 *
 * APIエンドポイントを提供するカスタムプラグイン
 */

import type { Plugin } from 'vite';
import path from 'node:path';
import { getEvents, getTags, getColumns } from './apiHandlers';

/**
 * Events API プラグイン
 *
 * GET /api/events エンドポイント: 全イベントを返す
 * GET /api/tags エンドポイント: 全タグ一覧を返す
 * GET /api/columns エンドポイント: タグで絞り込んだカラムデータを返す
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

            // タグを配列に変換
            const selectedTags = tagsParam.split(',').map((tag) => tag.trim());

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
  };
}
