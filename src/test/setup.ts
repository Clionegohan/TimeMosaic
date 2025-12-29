/**
 * Vitest Test Setup
 *
 * グローバルなテスト設定とクリーンアップ
 */

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 各テストの後にDOMをクリーンアップ
afterEach(() => {
  cleanup();
});
