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
  static instances: MockWebSocket[] = [];

  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((error: Event) => void) | null = null;
  onclose: (() => void) | null = null;
  readyState: number = 0;

  constructor(public url: string) {
    MockWebSocket.instances.push(this);

    // 接続成功をシミュレート
    setTimeout(() => {
      this.readyState = 1; // WebSocket.OPEN
      if (this.onopen) this.onopen();
    }, 10);
  }

  send(data: string) {
    // モックなので何もしない
  }

  close() {
    this.readyState = 3; // WebSocket.CLOSED
    if (this.onclose) this.onclose();
  }

  // テスト用: メッセージ受信をシミュレート
  simulateMessage(data: any) {
    if (this.onmessage) {
      const event = new MessageEvent('message', { data: JSON.stringify(data) });
      this.onmessage(event);
    }
  }
}

describe('useFileWatcher', () => {
  const originalWebSocket = global.WebSocket;

  beforeEach(() => {
    // WebSocketをモック
    global.WebSocket = MockWebSocket as any;
    MockWebSocket.instances = [];
  });

  afterEach(() => {
    // 元に戻す
    global.WebSocket = originalWebSocket;
    MockWebSocket.instances = [];
    vi.clearAllTimers();
  });

  it('WebSocket接続が確立される', async () => {
    const mockCallback = vi.fn();

    renderHook(() => useFileWatcher(mockCallback));

    await waitFor(
      () => {
        expect(MockWebSocket.instances.length).toBeGreaterThan(0);
      },
      { timeout: 300 }
    );
  });

  it('file-changed メッセージ受信時にコールバックが呼ばれる', async () => {
    const mockCallback = vi.fn();

    renderHook(() => useFileWatcher(mockCallback));

    await waitFor(
      () => {
        expect(MockWebSocket.instances.length).toBeGreaterThan(0);
        expect(MockWebSocket.instances[0].readyState).toBe(1);
      },
      { timeout: 300 }
    );

    // ファイル変更メッセージを送信
    MockWebSocket.instances[0].simulateMessage({
      type: 'file-changed',
      path: '/test/events.md',
      timestamp: Date.now(),
    });

    await waitFor(
      () => {
        expect(mockCallback).toHaveBeenCalled();
      },
      { timeout: 300 }
    );
  });

  it('アンマウント時にWebSocket接続が閉じられる', async () => {
    const mockCallback = vi.fn();

    const { unmount } = renderHook(() => useFileWatcher(mockCallback));

    await waitFor(
      () => {
        expect(MockWebSocket.instances.length).toBeGreaterThan(0);
      },
      { timeout: 300 }
    );

    const mockWs = MockWebSocket.instances[0];
    const closeSpy = vi.spyOn(mockWs, 'close');

    unmount();

    expect(closeSpy).toHaveBeenCalled();
  });
});
