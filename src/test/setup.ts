/**
 * Vitest Test Setup
 *
 * グローバルなテスト設定とクリーンアップ
 */

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// 各テストの後にDOMをクリーンアップ
afterEach(() => {
  cleanup();
});
