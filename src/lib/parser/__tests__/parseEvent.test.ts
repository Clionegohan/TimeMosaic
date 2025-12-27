/**
 * TimeMosaic Markdown Parser - イベントパーサーのテスト
 */

import { describe, it, expect } from 'vitest';
import { parseEvent } from '../parseEvent';

describe('parseEvent', () => {
  describe('正常系: 完全なイベント', () => {
    it('完全な形式のイベントをパースできる', () => {
      const text = `## 1945-08-15 終戦記念日
#歴史 #日本 #第二次世界大戦

第二次世界大戦の終結を告げる玉音放送が流れた日。
日本は連合国に対して無条件降伏を受け入れた。`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event!.id).toMatch(/^[0-9a-f-]{36}$/); // UUID v4
      expect(result.event!.date).toEqual({ year: 1945, month: 8, day: 15 });
      expect(result.event!.title).toBe('終戦記念日');
      expect(result.event!.tags).toEqual(['歴史', '日本', '第二次世界大戦']);
      expect(result.event!.description).toBe(
        '第二次世界大戦の終結を告げる玉音放送が流れた日。\n日本は連合国に対して無条件降伏を受け入れた。'
      );
      expect(result.event!.raw).toBe(text);
      expect(result.error).toBeUndefined();
    });

    it('年のみの日付をパースできる', () => {
      const text = `## 1969 アポロ11号月面着陸
#科学 #宇宙`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.date).toEqual({ year: 1969 });
      expect(result.event!.title).toBe('アポロ11号月面着陸');
      expect(result.event!.description).toBeUndefined();
    });

    it('年月の日付をパースできる', () => {
      const text = `## 1945-08 終戦
#歴史`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.date).toEqual({ year: 1945, month: 8 });
    });
  });

  describe('正常系: 説明文のバリエーション', () => {
    it('説明文なしのイベントをパースできる', () => {
      const text = `## 1945 終戦記念日
#歴史`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.description).toBeUndefined();
    });

    it('複数行の説明文をパースできる', () => {
      const text = `## 1945 終戦記念日
#歴史

1行目。
2行目。
3行目。`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.description).toBe('1行目。\n2行目。\n3行目。');
    });

    it('空行を含む説明文をパースできる', () => {
      const text = `## 1945 終戦記念日
#歴史

段落1。

段落2。`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.description).toBe('段落1。\n\n段落2。');
    });
  });

  describe('正常系: タグのバリエーション', () => {
    it('単一タグをパースできる', () => {
      const text = `## 1945 終戦記念日
#歴史`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.tags).toEqual(['歴史']);
    });

    it('複数タグをパースできる', () => {
      const text = `## 1945 終戦記念日
#歴史 #日本 #戦争 #平和`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.tags).toEqual(['歴史', '日本', '戦争', '平和']);
    });
  });

  describe('正常系: タイトルのバリエーション', () => {
    it('長いタイトルをパースできる', () => {
      const longTitle = 'これは非常に長いイベントタイトルでテストのために使用されます';
      const text = `## 1945 ${longTitle}
#歴史`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.title).toBe(longTitle);
    });

    it('特殊文字を含むタイトルをパースできる', () => {
      const text = `## 1945 終戦記念日（太平洋戦争）
#歴史`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.title).toBe('終戦記念日（太平洋戦争）');
    });
  });

  describe('異常系: 見出しの不正', () => {
    it('見出しがない場合はエラー', () => {
      const text = `#歴史

説明文。`;

      const result = parseEvent(text);

      expect(result.success).toBe(false);
      expect(result.error).toContain('heading');
    });

    it('##で始まらない場合はエラー', () => {
      const text = `# 1945 終戦記念日
#歴史`;

      const result = parseEvent(text);

      expect(result.success).toBe(false);
      expect(result.error).toContain('heading');
    });
  });

  describe('異常系: 日付の不正', () => {
    it('不正な日付形式の場合はエラー', () => {
      const text = `## abc 不正なイベント
#テスト`;

      const result = parseEvent(text);

      expect(result.success).toBe(false);
      expect(result.error).toContain('date');
    });

    it('日付がない場合はエラー', () => {
      const text = `## タイトルのみ
#歴史`;

      const result = parseEvent(text);

      expect(result.success).toBe(false);
      expect(result.error).toContain('date');
    });
  });

  describe('異常系: タグの不正', () => {
    it('タグがない場合はエラー', () => {
      const text = `## 1945 終戦記念日

説明文。`;

      const result = parseEvent(text);

      expect(result.success).toBe(false);
      expect(result.error).toContain('tags');
    });

    it('不正なタグ形式の場合はエラー', () => {
      const text = `## 1945 終戦記念日
歴史 日本`;

      const result = parseEvent(text);

      expect(result.success).toBe(false);
      expect(result.error).toContain('tags');
    });
  });

  describe('エッジケース', () => {
    it('前後の空行があっても正しくパースできる', () => {
      const text = `

## 1945 終戦記念日
#歴史

説明文。

`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.title).toBe('終戦記念日');
      expect(result.event!.description).toBe('説明文。');
    });

    it('区切り文字(---)を含む場合も正しくパースできる', () => {
      const text = `## 1945 終戦記念日
#歴史

説明文。
---`;

      const result = parseEvent(text);

      expect(result.success).toBe(true);
      expect(result.event!.description).toBe('説明文。');
    });

    it('空文字列の場合はエラー', () => {
      const result = parseEvent('');

      expect(result.success).toBe(false);
    });

    it('空白のみの場合はエラー', () => {
      const result = parseEvent('   \n\n   ');

      expect(result.success).toBe(false);
    });
  });

  describe('UUID生成', () => {
    it('複数回呼び出すと異なるIDが生成される', () => {
      const text = `## 1945 終戦記念日
#歴史`;

      const result1 = parseEvent(text);
      const result2 = parseEvent(text);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.event!.id).not.toBe(result2.event!.id);
    });
  });
});
