/**
 * Vitest Test Setup
 *
 * グローバルなテスト設定とクリーンアップ
 */

import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom/vitest';

// WebSocketのグローバルモック
class MockWebSocket {
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((error: Event) => void) | null = null;
  onclose: (() => void) | null = null;
  readyState: number = 0;

  constructor(public url: string) {
    // すぐに接続成功をシミュレート
    setTimeout(() => {
      this.readyState = 1; // WebSocket.OPEN
      if (this.onopen) this.onopen();
    }, 0);
  }

  send(_data: string) {
    // モックなので何もしない
  }

  close() {
    this.readyState = 3; // WebSocket.CLOSED
    if (this.onclose) this.onclose();
  }
}

// グローバルにWebSocketをモック
beforeAll(() => {
  Object.defineProperty(globalThis, 'WebSocket', {
    value: MockWebSocket,
    writable: true,
  });
});

// 各テストの後にDOMをクリーンアップ
afterEach(() => {
  cleanup();
});
