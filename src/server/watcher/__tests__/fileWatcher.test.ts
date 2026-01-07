/**
 * fileWatcher - Test
 *
 * ファイル監視機能のテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupFileWatcher } from '../fileWatcher';
import chokidar from 'chokidar';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { WebSocketServer } from 'ws';

describe('setupFileWatcher', () => {
  const testDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
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
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(mockCallback).toHaveBeenCalledWith(testFile);
  });

  it('WebSocketサーバーにファイル変更が通知される', async () => {
    const mockSend = vi.fn();

    const mockClient = {
      readyState: 1, // WebSocket.OPEN
      send: mockSend,
    };

    const mockWss = {
      clients: new Set([mockClient]),
    };

    watcher = setupFileWatcher(
      {
        filePath: testFile,
      },
      mockWss as unknown as WebSocketServer
    );

    await new Promise((resolve) => setTimeout(resolve, 100));
    await fs.appendFile(testFile, '\n## Another Event\n');
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(mockSend).toHaveBeenCalled();

    const sentMessage = JSON.parse(mockSend.mock.calls[0]?.[0] as string) as {
      type: string;
      path: string;
    };

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
