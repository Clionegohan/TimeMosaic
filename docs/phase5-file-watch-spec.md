# Phase 5: ファイル自動リロード機能 - 詳細仕様書

## 概要

Phase 5では、Markdownファイルが更新された際に自動的にブラウザに反映される機能を実装します。これによりユーザーは外部エディタでファイルを編集するだけで、即座にTimeMosaicに変更が反映されるようになります。

**実装対象**:
- Chokidarによるファイル監視（サーバーサイド）
- WebSocketによるリアルタイム通知
- useFileWatcher カスタムフック（クライアントサイド）
- 既存フック（useTags, useColumns）への統合

**実装手法**: ATDD (Acceptance Test Driven Development)
- テストファースト開発
- 受け入れ基準に基づくテストケース作成
- RED → GREEN → REFACTOR サイクル

---

## 受け入れ基準 (Acceptance Criteria)

### AC1: ファイル監視の実装（サーバーサイド）

**条件**:
- Chokidarを使用して`.env`で指定されたMarkdownファイルを監視する
- ファイルが変更されたら、接続中の全クライアントにWebSocketで通知する
- 通知メッセージは `{ type: 'file-changed' }` 形式のJSON
- 初期起動時の変更は無視する（`ignoreInitial: true`）

**検証方法**:
- ファイル変更時にchokidarの`change`イベントが発火する
- WebSocketクライアントにメッセージが送信される
- 複数クライアントが接続している場合、全員に通知される

### AC2: WebSocketサーバーの実装

**条件**:
- Viteプラグイン内でWebSocketServerを起動する
- クライアントからの接続を受け付ける
- ファイル変更通知をブロードキャストする
- サーバー終了時に適切にクリーンアップする

**検証方法**:
- WebSocketサーバーが正常に起動する
- クライアントが接続できる
- メッセージがブロードキャストされる
- サーバー終了時にリソースが解放される

### AC3: useFileWatcher フックの実装（クライアントサイド）

**条件**:
- WebSocketでサーバーに接続する
- `file-changed` メッセージを受信したら、コールバック関数を実行する
- コンポーネントのアンマウント時にWebSocket接続を閉じる
- 再接続ロジックを実装する（接続が切れた場合）

**検証方法**:
- WebSocket接続が確立される
- メッセージ受信時にコールバックが呼ばれる
- アンマウント時に接続が閉じられる
- 接続エラー時に再接続が試行される

### AC4: 既存フックへの統合

**条件**:
- `useTags`フックにファイル監視を統合する
- `useColumns`フックにファイル監視を統合する
- ファイル変更時に自動的にデータを再取得する
- 不要な再取得を防ぐ（debounce処理）

**検証方法**:
- ファイル変更時にタグ一覧が更新される
- ファイル変更時にカラムデータが更新される
- 短時間に複数回変更があっても、適切に処理される

### AC5: エラーハンドリングと安定性

**条件**:
- ファイルが存在しない場合、エラーを適切にハンドリングする
- WebSocket接続エラー時、ユーザーにわかりやすいメッセージを表示する
- ファイル監視エラー時、アプリケーションがクラッシュしない
- 開発モード（`npm run dev`）でのみ有効化する

**検証方法**:
- 存在しないファイルパスでもアプリが起動する
- WebSocket接続失敗時にコンソールエラーが出力される
- ファイル監視エラーがキャッチされる
- 本番ビルド時にファイル監視が無効化される

---

## システム設計

### アーキテクチャ概要

```
┌──────────────────────────────────────┐
│   Markdown File                      │
│   ~/Documents/Notes/events.md        │
└──────────────┬───────────────────────┘
               │ File Change Detection
               ↓
┌──────────────────────────────────────┐
│   Chokidar File Watcher              │
│   (server/watcher/fileWatcher.ts)    │
└──────────────┬───────────────────────┘
               │ Notify via WebSocket
               ↓
┌──────────────────────────────────────┐
│   WebSocket Server                   │
│   (Vite Plugin)                      │
└──────────────┬───────────────────────┘
               │ Broadcast
               ↓
┌──────────────────────────────────────┐
│   WebSocket Client                   │
│   useFileWatcher Hook                │
└──────────────┬───────────────────────┘
               │ Trigger refetch
               ↓
┌──────────────────────────────────────┐
│   useTags / useColumns Hooks         │
│   Re-fetch data from API             │
└──────────────────────────────────────┘
```

---

## サーバーサイド実装

### 1. ファイル監視モジュール (`src/server/watcher/fileWatcher.ts`)

```typescript
/**
 * fileWatcher.ts
 *
 * Chokidarを使用してMarkdownファイルを監視し、
 * 変更時にWebSocketクライアントに通知する
 */

import chokidar, { FSWatcher } from 'chokidar';
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
```

### 2. Vite プラグイン修正 (`src/server/vitePlugin.ts`)

```typescript
/**
 * vitePlugin.ts
 *
 * Viteプラグインの拡張: WebSocketサーバーとファイル監視を追加
 */

import type { Plugin, ViteDevServer } from 'vite';
import { WebSocketServer } from 'ws';
import { setupFileWatcher } from './watcher/fileWatcher';
import type { FSWatcher } from 'chokidar';

let wss: WebSocketServer | null = null;
let fileWatcher: FSWatcher | null = null;

export function timeMosaicPlugin(): Plugin {
  return {
    name: 'timemosaic-plugin',

    configureServer(server: ViteDevServer) {
      // 既存のAPIハンドラー設定...

      // WebSocketサーバーを起動（開発モードのみ）
      if (process.env.NODE_ENV !== 'production') {
        setupWebSocketServer(server);
      }
    },

    closeBundle() {
      // サーバー終了時のクリーンアップ
      if (fileWatcher) {
        console.log('[VitePlugin] Closing file watcher...');
        fileWatcher.close();
      }

      if (wss) {
        console.log('[VitePlugin] Closing WebSocket server...');
        wss.close();
      }
    },
  };
}

/**
 * WebSocketサーバーとファイル監視を起動
 */
function setupWebSocketServer(server: ViteDevServer): void {
  // WebSocketサーバーを作成（Vite HTTPサーバーを利用）
  wss = new WebSocketServer({ server: server.httpServer });

  wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected');

    ws.on('close', () => {
      console.log('[WebSocket] Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('[WebSocket] Error:', error);
    });
  });

  // ファイル監視を開始
  const markdownFilePath = process.env.VITE_MARKDOWN_FILE_PATH || './data/events.md';

  fileWatcher = setupFileWatcher(
    {
      filePath: markdownFilePath,
    },
    wss
  );

  console.log('[VitePlugin] WebSocket server and file watcher started');
}
```

---

## クライアントサイド実装

### 1. useFileWatcher フック (`src/hooks/useFileWatcher.ts`)

```typescript
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
```

### 2. useTags フックへの統合

```typescript
// src/hooks/useTags.ts

import { useState, useEffect, useCallback } from 'react';
import { useFileWatcher } from './useFileWatcher';

export function useTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回マウント時にデータ取得
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // ファイル変更時に自動再取得
  useFileWatcher(fetchTags);

  return { tags, loading, error, refetch: fetchTags };
}
```

### 3. useColumns フックへの統合

```typescript
// src/hooks/useColumns.ts

import { useState, useEffect, useCallback } from 'react';
import { useFileWatcher } from './useFileWatcher';
import type { Column } from '@/lib/utils/types';

export function useColumns(selectedTags: string[], sortOrder: 'asc' | 'desc') {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchColumns = useCallback(async () => {
    if (selectedTags.length === 0) {
      setColumns([]);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        tags: selectedTags.join(','),
        sort: sortOrder,
      });
      const response = await fetch(`/api/columns?${params}`);
      if (!response.ok) throw new Error('Failed to fetch columns');
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error('Error fetching columns:', error);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTags, sortOrder]);

  // selectedTags または sortOrder が変更されたらデータ取得
  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

  // ファイル変更時に自動再取得
  useFileWatcher(fetchColumns);

  return { columns, loading, refetch: fetchColumns };
}
```

---

## テストケーススキャフォルド

### サーバーサイドテスト (`src/server/watcher/__tests__/fileWatcher.test.ts`)

```typescript
/**
 * fileWatcher - Test
 *
 * ファイル監視機能のテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupFileWatcher } from '../fileWatcher';
import chokidar from 'chokidar';
import fs from 'fs/promises';
import path from 'path';

describe('setupFileWatcher', () => {
  const testDir = path.join(__dirname, 'fixtures');
  const testFile = path.join(testDir, 'test-events.md');
  let watcher: ReturnType<typeof chokidar.watch>;

  beforeEach(async () => {
    // テスト用ディレクトリとファイルを作成
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(testFile, '# Test Event\n');
  });

  afterEach(async () => {
    // クリーンアップ
    if (watcher) {
      await watcher.close();
    }
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('ファイル変更時に onFileChange コールバックが呼ばれる', async () => {
    const mockCallback = vi.fn();

    watcher = setupFileWatcher({
      filePath: testFile,
      onFileChange: mockCallback,
    });

    // ファイル変更をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 100));
    await fs.appendFile(testFile, '\n## New Event\n');

    // Chokidarの検出を待つ
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(mockCallback).toHaveBeenCalledWith(testFile);
  });

  it('WebSocketサーバーにファイル変更が通知される', async () => {
    const mockWss = {
      clients: new Set([
        {
          readyState: 1, // WebSocket.OPEN
          send: vi.fn(),
        },
      ]),
    };

    watcher = setupFileWatcher(
      {
        filePath: testFile,
      },
      mockWss as any
    );

    await new Promise((resolve) => setTimeout(resolve, 100));
    await fs.appendFile(testFile, '\n## Another Event\n');
    await new Promise((resolve) => setTimeout(resolve, 500));

    const client = Array.from(mockWss.clients)[0];
    expect(client.send).toHaveBeenCalled();

    const sentMessage = JSON.parse((client.send as any).mock.calls[0][0]);
    expect(sentMessage.type).toBe('file-changed');
    expect(sentMessage.path).toBe(testFile);
  });

  it('存在しないファイルでもエラーが発生しない', () => {
    expect(() => {
      watcher = setupFileWatcher({
        filePath: '/nonexistent/file.md',
      });
    }).not.toThrow();
  });
});
```

### クライアントサイドテスト (`src/hooks/__tests__/useFileWatcher.test.ts`)

```typescript
/**
 * useFileWatcher - Test
 *
 * ファイル監視フックのテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFileWatcher } from '../useFileWatcher';

// WebSocketのモック
class MockWebSocket {
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((error: Event) => void) | null = null;
  onclose: (() => void) | null = null;

  constructor(public url: string) {
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 0);
  }

  send(data: string) {}

  close() {
    if (this.onclose) this.onclose();
  }

  // テスト用: メッセージ受信をシミュレート
  simulateMessage(data: any) {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }
}

describe('useFileWatcher', () => {
  let mockWs: MockWebSocket;

  beforeEach(() => {
    // WebSocketをモック
    vi.stubGlobal('WebSocket', vi.fn((url: string) => {
      mockWs = new MockWebSocket(url);
      return mockWs;
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('WebSocket接続が確立される', async () => {
    const mockCallback = vi.fn();

    renderHook(() => useFileWatcher(mockCallback));

    await waitFor(() => {
      expect(WebSocket).toHaveBeenCalled();
    });
  });

  it('file-changed メッセージ受信時にコールバックが呼ばれる', async () => {
    const mockCallback = vi.fn();

    renderHook(() => useFileWatcher(mockCallback));

    await waitFor(() => {
      expect(mockWs).toBeDefined();
    });

    // ファイル変更メッセージを送信
    mockWs.simulateMessage({
      type: 'file-changed',
      path: '/test/events.md',
      timestamp: Date.now(),
    });

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it('アンマウント時にWebSocket接続が閉じられる', async () => {
    const mockCallback = vi.fn();
    const closeSpy = vi.spyOn(MockWebSocket.prototype, 'close');

    const { unmount } = renderHook(() => useFileWatcher(mockCallback));

    unmount();

    expect(closeSpy).toHaveBeenCalled();
  });
});
```

---

## 実装チェックリスト

### Phase 1: サーバーサイド実装 (ATDD)

- [ ] `src/server/watcher/fileWatcher.ts` のテスト作成
  - [ ] ファイル変更検出テスト
  - [ ] WebSocket通知テスト
  - [ ] エラーハンドリングテスト
- [ ] テスト実行 → RED 確認
- [ ] `src/server/watcher/fileWatcher.ts` 実装
  - [ ] Chokidar セットアップ
  - [ ] ファイル変更ハンドラー
  - [ ] WebSocket ブロードキャスト
- [ ] テスト実行 → GREEN 確認
- [ ] リファクタリング（必要に応じて）

### Phase 2: Viteプラグイン拡張

- [ ] `src/server/vitePlugin.ts` 修正
  - [ ] WebSocketServer 初期化
  - [ ] ファイル監視セットアップ
  - [ ] クリーンアップ処理
- [ ] 手動テスト: サーバー起動確認

### Phase 3: クライアントサイド実装 (ATDD)

- [ ] `src/hooks/__tests__/useFileWatcher.test.ts` 作成
  - [ ] WebSocket接続テスト
  - [ ] メッセージ受信テスト
  - [ ] アンマウント時のクリーンアップテスト
  - [ ] 再接続テスト
- [ ] テスト実行 → RED 確認
- [ ] `src/hooks/useFileWatcher.ts` 実装
  - [ ] WebSocket接続ロジック
  - [ ] メッセージハンドラー
  - [ ] 再接続ロジック
  - [ ] クリーンアップ
- [ ] テスト実行 → GREEN 確認

### Phase 4: 既存フックへの統合

- [ ] `src/hooks/useTags.ts` 修正
  - [ ] useFileWatcher の追加
  - [ ] fetchTags を useCallback でラップ
- [ ] `src/hooks/useColumns.ts` 修正
  - [ ] useFileWatcher の追加
  - [ ] fetchColumns を useCallback でラップ
- [ ] 既存テストが引き続きパスすることを確認

### Phase 5: 統合テストと検証

- [ ] 全テスト実行 → すべて PASS 確認
- [ ] 手動テスト
  - [ ] アプリ起動 → WebSocket接続確認
  - [ ] Markdownファイル編集 → 自動反映確認
  - [ ] 複数ブラウザタブで確認
  - [ ] ファイル保存連打 → 安定性確認
  - [ ] WebSocket切断 → 再接続確認

---

## パフォーマンス考慮事項

### Debounce処理

ファイル編集中に複数回保存が発生する場合、不要なAPI再取得を防ぐため、Chokidarの`awaitWriteFinish`オプションを使用します。

```typescript
awaitWriteFinish: {
  stabilityThreshold: 300, // ファイルが安定するまで300ms待機
  pollInterval: 100,       // 100msごとにチェック
}
```

### WebSocket再接続

接続が切れた場合、3秒後に自動再接続を試行します。これにより、一時的なネットワーク障害にも対応できます。

---

## セキュリティ考慮事項

### 開発モードのみ有効化

ファイル監視とWebSocketサーバーは開発モード（`npm run dev`）でのみ有効化します。本番ビルドでは無効化されます。

```typescript
if (process.env.NODE_ENV !== 'production') {
  setupWebSocketServer(server);
}
```

### ファイルパスの検証

`.env`で指定されたファイルパスが適切かどうかを検証し、セキュリティリスクを軽減します。

---

## 成功基準

Phase 5 完了時に以下が達成されていること:

1. ✅ Chokidarでファイル監視が動作している
2. ✅ WebSocketサーバーが正常に起動・動作している
3. ✅ useFileWatcher フックが実装されている
4. ✅ useTags, useColumns にファイル監視が統合されている
5. ✅ Markdownファイル編集時に自動的にブラウザに反映される
6. ✅ 全テストがパスしている
7. ✅ 複数クライアント接続時も正常に動作する
8. ✅ WebSocket再接続が機能している
9. ✅ 開発モードでのみ有効化されている

---

## 関連ドキュメント

- `docs/mvp-spec.md` - MVP全体仕様
- `docs/architecture.md` - システムアーキテクチャ
- `docs/frontend-spec.md` - フロントエンド仕様

---

**更新履歴**:
- 2025-XX-XX: Phase 5 ファイル自動リロード仕様書初版作成
