/**
 * TimeMosaic Markdown Parser - 統合テスト (ATDD)
 *
 * 仕様書の受け入れ基準に基づいた統合テスト
 */

import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../index';

describe('Markdown Parser Integration Tests (ATDD)', () => {
  describe('AC1: 基本的なイベントのパース', () => {
    it('正しい形式の単一イベントをパースできる', () => {
      const markdown = `## 1945-08-15 終戦記念日
#歴史 #日本 #第二次世界大戦

第二次世界大戦の終結を告げる玉音放送が流れた日。
日本は連合国に対して無条件降伏を受け入れた。`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(1);
      expect(result.errors).toHaveLength(0);

      const event = result.events[0];
      expect(event.id).toBeDefined();
      expect(event.id).toMatch(/^[0-9a-f-]{36}$/); // UUID形式
      expect(event.date).toEqual({ year: 1945, month: 8, day: 15 });
      expect(event.title).toBe('終戦記念日');
      expect(event.tags).toEqual(['歴史', '日本', '第二次世界大戦']);
      expect(event.description).toBe(
        '第二次世界大戦の終結を告げる玉音放送が流れた日。\n日本は連合国に対して無条件降伏を受け入れた。'
      );
      expect(event.raw).toContain('## 1945-08-15 終戦記念日');
    });
  });

  describe('AC2: 複数イベントのパース', () => {
    it('3つのイベントを含むMarkdownをパースできる', () => {
      const markdown = `## 1945 終戦記念日
#歴史 #日本

終戦。

---

## 1969 アポロ11号
#科学

月面着陸。

---

## 2024 TimeMosaic
#個人 #開発

プロジェクト開始。`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(3);
      expect(result.errors).toHaveLength(0);

      expect(result.events[0].title).toBe('終戦記念日');
      expect(result.events[1].title).toBe('アポロ11号');
      expect(result.events[2].title).toBe('TimeMosaic');
    });
  });

  describe('AC3: 年のみの日付', () => {
    it('年のみの形式をパースできる', () => {
      const markdown = `## 1945 終戦記念日
#歴史`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].date).toEqual({ year: 1945 });
    });
  });

  describe('AC4: 年月日の日付', () => {
    it('年月日の形式をパースできる', () => {
      const markdown = `## 1945-08-15 終戦記念日
#歴史`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].date).toEqual({ year: 1945, month: 8, day: 15 });
    });
  });

  describe('AC5: 複数タグの処理', () => {
    it('複数タグを正しくパースできる', () => {
      const markdown = `## 1945 終戦記念日
#歴史 #日本 #戦争`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].tags).toEqual(['歴史', '日本', '戦争']);
    });
  });

  describe('AC6: 説明文のパース', () => {
    it('複数行の説明文を正しくパースできる', () => {
      const markdown = `## 1945 終戦記念日
#歴史

第二次世界大戦の終結。
日本は連合国に対して無条件降伏。`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].description).toBe(
        '第二次世界大戦の終結。\n日本は連合国に対して無条件降伏。'
      );
    });
  });

  describe('AC7: 説明文なしのイベント', () => {
    it('説明文がない場合はundefinedになる', () => {
      const markdown = `## 1945 終戦記念日
#歴史`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].description).toBeUndefined();
    });
  });

  describe('AC8: 不正な日付のエラーハンドリング', () => {
    it('不正な日付の場合はエラーを記録する', () => {
      const markdown = `## abc 不正なイベント
#テスト`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Invalid year');
    });
  });

  describe('AC9: タグなしのエラーハンドリング', () => {
    it('タグがない場合はエラーを記録する', () => {
      const markdown = `## 1945 タグなしイベント

説明文。`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('tags');
    });
  });

  describe('AC10: ID生成', () => {
    it('各イベントに一意のIDが付与される', () => {
      const markdown = `## 1945 イベント1
#タグ1

---

## 1946 イベント2
#タグ2`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(2);
      expect(result.events[0].id).toBeDefined();
      expect(result.events[1].id).toBeDefined();
      expect(result.events[0].id).not.toBe(result.events[1].id);
    });
  });

  describe('エッジケース', () => {
    it('空のMarkdownは空の結果を返す', () => {
      const result = parseMarkdown('');

      expect(result.events).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it('区切り文字(---)を正しく処理する', () => {
      const markdown = `## 1945 イベント1
#タグ1

説明1

---

## 1946 イベント2
#タグ2

説明2`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(2);
      expect(result.events[0].description).toBe('説明1');
      expect(result.events[1].description).toBe('説明2');
    });

    it('前後の空行を適切に処理する', () => {
      const markdown = `

## 1945 終戦記念日
#歴史

説明文。

`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].title).toBe('終戦記念日');
    });

    it('正常なイベントと不正なイベントが混在する場合', () => {
      const markdown = `## 1945 正常イベント
#タグ1

---

## abc 不正なイベント
#タグ2

---

## 1946 正常イベント2
#タグ3`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.events[0].title).toBe('正常イベント');
      expect(result.events[1].title).toBe('正常イベント2');
    });
  });

  describe('raw フィールド', () => {
    it('元のMarkdownテキストが保存される', () => {
      const markdown = `## 1945-08-15 終戦記念日
#歴史 #日本

説明文。`;

      const result = parseMarkdown(markdown);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].raw).toContain('## 1945-08-15 終戦記念日');
      expect(result.events[0].raw).toContain('#歴史 #日本');
      expect(result.events[0].raw).toContain('説明文。');
    });
  });
});
