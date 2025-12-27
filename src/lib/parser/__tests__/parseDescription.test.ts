/**
 * TimeMosaic Markdown Parser - 説明文パーサーのテスト
 */

import { describe, it, expect } from 'vitest';
import { parseDescription } from '../parseDescription';

describe('parseDescription', () => {
  describe('正常系: 基本的な説明文', () => {
    it('単一行の説明文をパースできる', () => {
      const lines = ['これは説明文です。'];
      const result = parseDescription(lines);

      expect(result).toBe('これは説明文です。');
    });

    it('複数行の説明文をパースできる', () => {
      const lines = [
        '第二次世界大戦の終結を告げる玉音放送が流れた日。',
        '日本は連合国に対して無条件降伏を受け入れた。',
      ];
      const result = parseDescription(lines);

      expect(result).toBe(
        '第二次世界大戦の終結を告げる玉音放送が流れた日。\n日本は連合国に対して無条件降伏を受け入れた。'
      );
    });

    it('3行以上の説明文をパースできる', () => {
      const lines = [
        '1行目',
        '2行目',
        '3行目',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('1行目\n2行目\n3行目');
    });
  });

  describe('正常系: 空白の扱い', () => {
    it('前後の空白行をトリムする', () => {
      const lines = [
        '',
        '説明文。',
        '',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('説明文。');
    });

    it('複数の前後空白行をトリムする', () => {
      const lines = [
        '',
        '',
        '説明文。',
        '',
        '',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('説明文。');
    });

    it('中間の空白行は保持する', () => {
      const lines = [
        '1行目',
        '',
        '3行目',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('1行目\n\n3行目');
    });

    it('各行の前後の空白はトリムされる', () => {
      const lines = [
        '  説明文。  ',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('説明文。');
    });
  });

  describe('正常系: 区切り文字の処理', () => {
    it('---は除外される', () => {
      const lines = [
        '説明文。',
        '---',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('説明文。');
    });

    it('複数の---は全て除外される', () => {
      const lines = [
        '説明文。',
        '---',
        '---',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('説明文。');
    });

    it('---の前後の説明文は保持される', () => {
      const lines = [
        '1行目',
        '---',
        '2行目',
      ];
      const result = parseDescription(lines);

      // ---を除外して結合
      expect(result).toBe('1行目\n2行目');
    });

    it('---のみの行（前後に空白あり）も除外される', () => {
      const lines = [
        '説明文。',
        '  ---  ',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('説明文。');
    });
  });

  describe('異常系: 空の説明文', () => {
    it('空配列の場合はundefinedを返す', () => {
      const lines: string[] = [];
      const result = parseDescription(lines);

      expect(result).toBeUndefined();
    });

    it('空白行のみの場合はundefinedを返す', () => {
      const lines = ['', '', ''];
      const result = parseDescription(lines);

      expect(result).toBeUndefined();
    });

    it('---のみの場合はundefinedを返す', () => {
      const lines = ['---'];
      const result = parseDescription(lines);

      expect(result).toBeUndefined();
    });

    it('空白と---のみの場合はundefinedを返す', () => {
      const lines = ['', '---', '', '---', ''];
      const result = parseDescription(lines);

      expect(result).toBeUndefined();
    });
  });

  describe('エッジケース', () => {
    it('長い説明文を処理できる', () => {
      const longText = 'あ'.repeat(1000);
      const lines = [longText];
      const result = parseDescription(lines);

      expect(result).toBe(longText);
    });

    it('特殊文字を含む説明文を処理できる', () => {
      const lines = [
        '特殊文字: !@#$%^&*()_+-=[]{}|;:\'",.<>?/',
      ];
      const result = parseDescription(lines);

      expect(result).toBe('特殊文字: !@#$%^&*()_+-=[]{}|;:\'",.<>?/');
    });

    it('Markdown記法を含む説明文を処理できる', () => {
      const lines = [
        '**太字** や *イタリック* を含む。',
        '[リンク](https://example.com) もある。',
      ];
      const result = parseDescription(lines);

      expect(result).toBe(
        '**太字** や *イタリック* を含む。\n[リンク](https://example.com) もある。'
      );
    });

    it('数字のみの行も処理できる', () => {
      const lines = ['123', '456'];
      const result = parseDescription(lines);

      expect(result).toBe('123\n456');
    });

    it('ハイフンが3つ未満の行は通常のテキストとして扱う', () => {
      const lines = [
        '--',
        '----',
        '-----',
      ];
      const result = parseDescription(lines);

      // ---のみが除外される、それ以外は保持
      expect(result).toBe('--\n----\n-----');
    });
  });
});
