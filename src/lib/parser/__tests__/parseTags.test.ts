/**
 * TimeMosaic Markdown Parser - タグパーサーのテスト
 */

import { describe, it, expect } from 'vitest';
import { parseTags } from '../parseTags';

describe('parseTags', () => {
  describe('正常系: 基本的なタグ', () => {
    it('単一タグをパースできる', () => {
      const result = parseTags('#歴史');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['歴史']);
      expect(result.error).toBeUndefined();
    });

    it('複数タグをパースできる', () => {
      const result = parseTags('#歴史 #日本 #第二次世界大戦');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['歴史', '日本', '第二次世界大戦']);
    });

    it('2つのタグをパースできる', () => {
      const result = parseTags('#科学 #宇宙');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['科学', '宇宙']);
    });

    it('英語のタグをパースできる', () => {
      const result = parseTags('#history #japan');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['history', 'japan']);
    });

    it('数字を含むタグをパースできる', () => {
      const result = parseTags('#2024年 #第1次');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['2024年', '第1次']);
    });
  });

  describe('正常系: 空白の扱い', () => {
    it('前後に空白があってもパースできる', () => {
      const result = parseTags('  #歴史 #日本  ');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['歴史', '日本']);
    });

    it('タグ間に複数の空白があってもパースできる', () => {
      const result = parseTags('#歴史   #日本    #戦争');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['歴史', '日本', '戦争']);
    });

    it('タブ文字で区切られたタグをパースできる', () => {
      const result = parseTags('#歴史\t#日本');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['歴史', '日本']);
    });
  });

  describe('正常系: エッジケース', () => {
    it('ハイフンを含むタグをパースできる', () => {
      const result = parseTags('#第二次世界大戦-太平洋戦争');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['第二次世界大戦-太平洋戦争']);
    });

    it('アンダースコアを含むタグをパースできる', () => {
      const result = parseTags('#user_profile #system_config');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['user_profile', 'system_config']);
    });

    it('長いタグ名をパースできる', () => {
      const longTag = 'これは非常に長いタグ名でテストのために使用されます';
      const result = parseTags(`#${longTag}`);
      expect(result.success).toBe(true);
      expect(result.tags).toEqual([longTag]);
    });
  });

  describe('異常系: 空文字列・不正な形式', () => {
    it('空文字列はエラーになる', () => {
      const result = parseTags('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Tags string is empty');
    });

    it('空白のみの文字列はエラーになる', () => {
      const result = parseTags('   ');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Tags string is empty');
    });

    it('#で始まらない文字列はエラーになる', () => {
      const result = parseTags('歴史 日本');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Tags must start with #');
    });

    it('#のみの文字列はエラーになる', () => {
      const result = parseTags('#');
      expect(result.success).toBe(false);
      expect(result.error).toBe('No valid tags found');
    });

    it('複数の#のみはエラーになる', () => {
      const result = parseTags('# # #');
      expect(result.success).toBe(false);
      expect(result.error).toBe('No valid tags found');
    });

    it('#のみのタグが混在する場合は有効なタグのみ抽出', () => {
      const result = parseTags('#歴史 # #日本');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['歴史', '日本']);
    });
  });

  describe('異常系: 部分的に不正なタグ', () => {
    it('一部が#で始まらない場合はエラーになる', () => {
      const result = parseTags('#歴史 日本');
      expect(result.success).toBe(false);
      expect(result.error).toContain('All tags must start with #');
    });

    it('一部が#で始まらない（複数）場合はエラーになる', () => {
      const result = parseTags('#歴史 日本 #戦争 平和');
      expect(result.success).toBe(false);
      expect(result.error).toContain('All tags must start with #');
    });
  });

  describe('正規化: 重複の削除', () => {
    it('重複するタグは1つにまとめられる', () => {
      const result = parseTags('#歴史 #日本 #歴史');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['歴史', '日本']);
    });

    it('同じタグが複数回出現しても重複は削除される', () => {
      const result = parseTags('#歴史 #歴史 #歴史');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['歴史']);
    });
  });

  describe('タグの順序', () => {
    it('タグの順序は入力順に保たれる', () => {
      const result = parseTags('#C #B #A');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['C', 'B', 'A']);
    });

    it('重複削除時は最初に出現したタグが保持される', () => {
      const result = parseTags('#A #B #C #A #B');
      expect(result.success).toBe(true);
      expect(result.tags).toEqual(['A', 'B', 'C']);
    });
  });
});
