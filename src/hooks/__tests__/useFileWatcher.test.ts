/**
 * useFileWatcher - Test
 *
 * ファイル監視フックのテスト
 *
 * 注意: ViteのHMR APIはテスト環境ではnullなので、
 * 主に手動テストで動作確認を行います
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFileWatcher } from '../useFileWatcher';

describe('useFileWatcher', () => {
  it('本番環境または HMR API が存在しない場合、エラーなくマウントされる', () => {
    const mockCallback = () => {
      // テスト用コールバック
    };

    // import.meta.hot は undefined なので、何もしない
    expect(() => {
      renderHook(() => useFileWatcher(mockCallback));
    }).not.toThrow();
  });

  it('コールバック関数を受け取る', () => {
    const mockCallback = () => {
      // テスト用コールバック
    };

    const { unmount } = renderHook(() => useFileWatcher(mockCallback));

    expect(() => {
      unmount();
    }).not.toThrow();
  });
});
