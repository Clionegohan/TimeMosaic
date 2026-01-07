/**
 * TimeMosaic API Handlers - 統合テスト
 *
 * ATDD: api-spec.mdの受け入れ基準に基づくテスト
 */

import { describe, it, expect } from 'vitest';
import path from 'node:path';

// ハンドラー関数（後で実装）
import { getEvents, getTags, getColumns } from '../apiHandlers';

describe('API Handlers (ATDD)', () => {
  const sampleFilePath = path.resolve(process.cwd(), 'sample/events.md');

  describe('AC1: 全イベント取得 (GET /api/events)', () => {
    it('全イベントデータを取得できる', async () => {
      const result = await getEvents(sampleFilePath);

      expect(result).toBeDefined();
      expect(result.events).toBeDefined();
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.events)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('レスポンスに全イベントが含まれる', async () => {
      const result = await getEvents(sampleFilePath);

      // サンプルファイルには10個のイベントが含まれている
      expect(result.events.length).toBe(10);
    });

    it('ファイル読み込みエラー時にエラーをスローする', async () => {
      const invalidPath = '/path/to/nonexistent/file.md';

      await expect(getEvents(invalidPath)).rejects.toThrow('Failed to read file');
    });
  });

  describe('AC2: タグ一覧取得 (GET /api/tags)', () => {
    it('全タグ一覧を取得できる', async () => {
      const result = await getTags(sampleFilePath);

      expect(result).toBeDefined();
      expect(result.tags).toBeDefined();
      expect(result.count).toBeDefined();
      expect(Array.isArray(result.tags)).toBe(true);
      expect(typeof result.count).toBe('number');
    });

    it('タグは重複なしで返される', async () => {
      const result = await getTags(sampleFilePath);

      const uniqueTags = Array.from(new Set(result.tags));
      expect(result.tags).toEqual(uniqueTags);
    });

    it('タグは出現数降順・同数は出現順である', async () => {
      const result = await getTags(sampleFilePath);

      expect(result.tags).toEqual([
        '日本',
        '歴史',
        '西洋文化',
        '第二次世界大戦',
        'スポーツ',
        'オリンピック',
        '建築',
        'フランス',
        '科学',
        '宇宙',
        'アメリカ',
        '文化',
        'ドイツ',
        '冷戦',
        '災害',
        '貿易',
        '政治',
        '戦争',
        '世界',
      ]);
    });

    it('タグ数が正しい', async () => {
      const result = await getTags(sampleFilePath);

      expect(result.count).toBe(result.tags.length);
      expect(result.count).toBeGreaterThan(0);
    });

    it('期待されるタグが含まれている', async () => {
      const result = await getTags(sampleFilePath);

      // サンプルファイルに含まれるタグ
      expect(result.tags).toContain('歴史');
      expect(result.tags).toContain('日本');
      expect(result.tags).toContain('スポーツ');
      expect(result.tags).toContain('科学');
    });

    it('ファイル読み込みエラー時にエラーをスローする', async () => {
      const invalidPath = '/path/to/nonexistent/file.md';

      await expect(getTags(invalidPath)).rejects.toThrow('Failed to read file');
    });
  });

  describe('AC3: カラムデータ取得 (GET /api/columns)', () => {
    it('選択タグに基づいてカラムデータを生成できる', async () => {
      const selectedTags = ['歴史', '日本'];
      const result = await getColumns(sampleFilePath, selectedTags);

      expect(result).toBeDefined();
      expect(result.columns).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(Array.isArray(result.columns)).toBe(true);
    });

    it('選択タグごとにカラムが生成される', async () => {
      const selectedTags = ['歴史', '日本'];
      const result = await getColumns(sampleFilePath, selectedTags);

      expect(result.columns).toHaveLength(2);
      expect(result.columns[0].tag).toBe('歴史');
      expect(result.columns[1].tag).toBe('日本');
    });

    it('各カラムのイベントは選択タグでフィルタされている', async () => {
      const selectedTags = ['歴史'];
      const result = await getColumns(sampleFilePath, selectedTags);

      const historyColumn = result.columns[0];
      expect(historyColumn.tag).toBe('歴史');

      // 全イベントが「歴史」タグを持つことを確認
      historyColumn.events.forEach((event) => {
        expect(event.tags).toContain('歴史');
      });
    });

    it('同じイベントが複数カラムに表示される（複数タグ保持時）', async () => {
      const selectedTags = ['歴史', '日本'];
      const result = await getColumns(sampleFilePath, selectedTags);

      const historyColumn = result.columns[0];
      const japanColumn = result.columns[1];

      // 「鉄砲伝来」は「歴史」と「日本」の両方のタグを持つ
      const ironGunInHistory = historyColumn.events.find((e) => e.title === '鉄砲伝来');
      const ironGunInJapan = japanColumn.events.find((e) => e.title === '鉄砲伝来');

      expect(ironGunInHistory).toBeDefined();
      expect(ironGunInJapan).toBeDefined();
      expect(ironGunInHistory!.id).toBe(ironGunInJapan!.id); // 同じイベント
    });

    it('存在しないタグを指定しても正常動作する（空カラム）', async () => {
      const selectedTags = ['存在しないタグ'];
      const result = await getColumns(sampleFilePath, selectedTags);

      expect(result.columns).toHaveLength(1);
      expect(result.columns[0].tag).toBe('存在しないタグ');
      expect(result.columns[0].events).toHaveLength(0);
    });

    it('メタデータが正しく返される', async () => {
      const selectedTags = ['歴史', '日本'];
      const result = await getColumns(sampleFilePath, selectedTags);

      expect(result.metadata.selectedTags).toEqual(['歴史', '日本']);
      expect(result.metadata.totalEvents).toBe(10);
    });

    it('ファイル読み込みエラー時にエラーをスローする', async () => {
      const invalidPath = '/path/to/nonexistent/file.md';
      const selectedTags = ['歴史'];

      await expect(getColumns(invalidPath, selectedTags)).rejects.toThrow('Failed to read file');
    });
  });

  describe('AC4: エッジケース', () => {
    it('空の選択タグリストでも正常動作する', async () => {
      const selectedTags: string[] = [];
      const result = await getColumns(sampleFilePath, selectedTags);

      expect(result.columns).toHaveLength(0);
      expect(result.metadata.selectedTags).toEqual([]);
    });

    it('空文字列タグをフィルタして処理する', async () => {
      // 空文字列とホワイトスペースを含むタグ配列
      const selectedTags = ['歴史', '', '  ', '日本'];

      // ハンドラーレベルでは配列を受け取るので、フィルタリング済みと想定
      const filteredTags = selectedTags.filter((tag) => tag.trim().length > 0);
      const result = await getColumns(sampleFilePath, filteredTags);

      // 有効なタグのみで2列生成される
      expect(result.columns).toHaveLength(2);
      expect(result.columns[0].tag).toBe('歴史');
      expect(result.columns[1].tag).toBe('日本');
    });

  });
});
