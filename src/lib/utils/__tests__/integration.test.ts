/**
 * TimeMosaic マルチカラムロジック - 統合テスト
 *
 * ATDD: multicolumn-logic-spec.mdの受け入れ基準に基づくテスト
 * sample/events.mdのデータを使用したユーザーシナリオテスト
 */

import { describe, it, expect } from 'vitest';
import { extractAllTags, sortEventsByDate, createColumns } from '../index';
import type { Event } from '../../parser/types';

/**
 * sample/events.mdのデータ（実際のサンプルデータと同じ構造）
 */
const sampleEvents: Event[] = [
  {
    id: '1',
    date: { year: 1543 },
    title: '鉄砲伝来',
    tags: ['歴史', '日本', '貿易'],
    description: '種子島にポルトガル人が漂着し、鉄砲が日本に伝わった。\nこれにより日本の戦国時代の戦い方が大きく変化した。',
    raw: '...',
  },
  {
    id: '2',
    date: { year: 1868 },
    title: '明治維新',
    tags: ['歴史', '日本', '政治'],
    description: '江戸幕府が倒れ、明治新政府が樹立。\n日本の近代化が本格的に始まった。',
    raw: '...',
  },
  {
    id: '3',
    date: { year: 1889 },
    title: 'エッフェル塔完成',
    tags: ['建築', 'フランス', '西洋文化'],
    description:
      'パリ万国博覧会のために建設されたエッフェル塔が完成。\n当初は批判も多かったが、今やパリのシンボルとなっている。',
    raw: '...',
  },
  {
    id: '4',
    date: { year: 1914 },
    title: '第一次世界大戦勃発',
    tags: ['歴史', '戦争', '世界'],
    description: 'サラエボ事件をきっかけに第一次世界大戦が勃発。',
    raw: '...',
  },
  {
    id: '5',
    date: { year: 1945, month: 8, day: 15 },
    title: '終戦記念日',
    tags: ['歴史', '日本', '第二次世界大戦'],
    description: '第二次世界大戦の終結を告げる玉音放送が流れた日。\n日本は連合国に対して無条件降伏を受け入れた。',
    raw: '...',
  },
  {
    id: '6',
    date: { year: 1964, month: 10, day: 10 },
    title: '東京オリンピック開会',
    tags: ['スポーツ', '日本', 'オリンピック'],
    description: 'アジア初のオリンピックが東京で開催された。\nこの大会を機に日本は高度経済成長期を迎える。',
    raw: '...',
  },
  {
    id: '7',
    date: { year: 1969, month: 7 },
    title: 'アポロ11号月面着陸',
    tags: ['科学', '宇宙', 'アメリカ'],
    description:
      '人類史上初めて月面に到達。\nニール・アームストロング船長の「一人の人間にとっては小さな一歩だが、人類にとっては偉大な飛躍である」という言葉が有名。',
    raw: '...',
  },
  {
    id: '8',
    date: { year: 1970 },
    title: '大阪万博',
    tags: ['文化', '日本', '西洋文化'],
    description: '「人類の進歩と調和」をテーマに大阪で万国博覧会が開催。\n岡本太郎作の太陽の塔が象徴的な存在となった。',
    raw: '...',
  },
  {
    id: '9',
    date: { year: 1989, month: 11, day: 9 },
    title: 'ベルリンの壁崩壊',
    tags: ['歴史', 'ドイツ', '冷戦'],
    description: '東西ドイツを隔てていたベルリンの壁が崩壊。\n冷戦終結の象徴的な出来事となった。',
    raw: '...',
  },
  {
    id: '10',
    date: { year: 2011, month: 3, day: 11 },
    title: '東日本大震災',
    tags: ['災害', '日本'],
    description:
      'マグニチュード9.0の巨大地震が東北地方を襲い、大津波が発生。\n福島第一原発事故も引き起こした未曾有の災害。',
    raw: '...',
  },
];

describe('マルチカラムロジック統合テスト（ATDD）', () => {
  describe('シナリオ1: 基本的なマルチカラム表示', () => {
    it('ユーザーが「歴史」と「日本」を選択したときに正しい列が生成される', () => {
      const selectedTags = ['歴史', '日本'];
      const columns = createColumns(sampleEvents, selectedTags);

      // 2つの列が生成される
      expect(columns).toHaveLength(2);
      expect(columns[0].tag).toBe('歴史');
      expect(columns[1].tag).toBe('日本');

      // 歴史列の検証
      const historyColumn = columns[0];
      expect(historyColumn.events.length).toBeGreaterThan(0);

      const historyTitles = historyColumn.events.map((e) => e.title);
      expect(historyTitles).toContain('鉄砲伝来');
      expect(historyTitles).toContain('明治維新');
      expect(historyTitles).toContain('終戦記念日');
      expect(historyTitles).toContain('第一次世界大戦勃発');
      expect(historyTitles).toContain('ベルリンの壁崩壊');

      // 正確に5個のイベントが含まれる
      expect(historyColumn.events).toHaveLength(5);

      // 年号順にソートされている
      for (let i = 0; i < historyColumn.events.length - 1; i++) {
        const current = historyColumn.events[i].date.year;
        const next = historyColumn.events[i + 1].date.year;
        expect(current).toBeLessThanOrEqual(next);
      }

      // 最初のイベントは1543年（鉄砲伝来）
      expect(historyColumn.events[0].title).toBe('鉄砲伝来');
      expect(historyColumn.events[0].date.year).toBe(1543);

      // 日本列の検証
      const japanColumn = columns[1];
      const japanTitles = japanColumn.events.map((e) => e.title);
      expect(japanTitles).toContain('鉄砲伝来');
      expect(japanTitles).toContain('明治維新');
      expect(japanTitles).toContain('終戦記念日');
      expect(japanTitles).toContain('東京オリンピック開会');
      expect(japanTitles).toContain('大阪万博');
      expect(japanTitles).toContain('東日本大震災');

      // 正確に6個のイベントが含まれる
      expect(japanColumn.events).toHaveLength(6);

      // 第一次世界大戦は日本タグを持たないので含まれない
      expect(japanTitles).not.toContain('第一次世界大戦勃発');
      expect(japanTitles).not.toContain('ベルリンの壁崩壊');
      expect(japanTitles).not.toContain('エッフェル塔完成');

      // 同じイベントが両方の列に表示される
      const endOfWar = historyColumn.events.find((e) => e.title === '終戦記念日');
      const endOfWarInJapan = japanColumn.events.find((e) => e.title === '終戦記念日');
      expect(endOfWar).toBeDefined();
      expect(endOfWarInJapan).toBeDefined();
      expect(endOfWar!.id).toBe(endOfWarInJapan!.id); // 同じオブジェクト
    });

    it('年月日の混在データも正しくソートされる', () => {
      const selectedTags = ['歴史'];
      const columns = createColumns(sampleEvents, selectedTags);

      const historyColumn = columns[0];

      // 年号順（1543 < 1868 < 1914 < 1945 < 1989）
      expect(historyColumn.events[0].date.year).toBe(1543); // 鉄砲伝来
      expect(historyColumn.events[1].date.year).toBe(1868); // 明治維新
      expect(historyColumn.events[2].date.year).toBe(1914); // WWI
      expect(historyColumn.events[3].date.year).toBe(1945); // 終戦
      expect(historyColumn.events[4].date.year).toBe(1989); // ベルリン

      // 1945年のイベントは月日も含む
      expect(historyColumn.events[3].date).toEqual({ year: 1945, month: 8, day: 15 });
    });
  });

  describe('シナリオ2: タグ抽出と並び順', () => {
    it('全イベントからタグ一覧を抽出し、出現数降順・同数は出現順で返す', () => {
      const allTags = extractAllTags(sampleEvents);

      // タグが抽出される
      expect(allTags.length).toBeGreaterThan(0);

      // 重複がない
      const uniqueTags = Array.from(new Set(allTags));
      expect(allTags).toEqual(uniqueTags);

      // 出現数降順・同数は最初の出現順
      expect(allTags).toEqual([
        '日本',
        '歴史',
        '西洋文化',
        '貿易',
        '政治',
        '建築',
        'フランス',
        '戦争',
        '世界',
        '第二次世界大戦',
        'スポーツ',
        'オリンピック',
        '科学',
        '宇宙',
        'アメリカ',
        '文化',
        'ドイツ',
        '冷戦',
        '災害',
      ]);

      // 期待されるタグが含まれている
      expect(allTags).toContain('歴史');
      expect(allTags).toContain('日本');
      expect(allTags).toContain('スポーツ');
      expect(allTags).toContain('科学');
    });

    it('イベントは常に古い順（asc）でソートされる', () => {
      const selectedTags = ['歴史', '日本'];
      const columns = createColumns(sampleEvents, selectedTags);

      // 歴史列: 古い順（1543 < 1868 < 1914 < 1945 < 1989）
      const historyColumn = columns[0];
      expect(historyColumn.events[0].date.year).toBe(1543); // 鉄砲伝来
      expect(historyColumn.events[1].date.year).toBe(1868); // 明治維新
      expect(historyColumn.events[2].date.year).toBe(1914); // WWI
      expect(historyColumn.events[3].date.year).toBe(1945); // 終戦
      expect(historyColumn.events[4].date.year).toBe(1989); // ベルリン

      for (let i = 0; i < historyColumn.events.length - 1; i++) {
        const current = historyColumn.events[i].date.year;
        const next = historyColumn.events[i + 1].date.year;
        expect(current).toBeLessThanOrEqual(next);
      }

      // 日本列も古い順
      const japanColumn = columns[1];
      expect(japanColumn.events[0].date.year).toBe(1543); // 鉄砲伝来
      expect(japanColumn.events[japanColumn.events.length - 1].date.year).toBe(2011); // 東日本大震災
    });
  });

  describe('シナリオ3: エッジケース', () => {
    it('存在しないタグを選択しても正しく動作する', () => {
      const columns = createColumns(sampleEvents, ['存在しないタグ', '歴史']);

      expect(columns).toHaveLength(2);

      // 存在しないタグの列は空
      expect(columns[0].tag).toBe('存在しないタグ');
      expect(columns[0].events).toHaveLength(0);

      // 歴史列は正常に生成される
      expect(columns[1].tag).toBe('歴史');
      expect(columns[1].events.length).toBeGreaterThan(0);
    });

    it('空の選択タグリストで空配列を返す', () => {
      const columns = createColumns(sampleEvents, []);

      expect(columns).toHaveLength(0);
    });

    it('選択タグの順序で列が返される', () => {
      // 日本、歴史の順で選択
      const columns1 = createColumns(sampleEvents, ['日本', '歴史']);
      expect(columns1[0].tag).toBe('日本');
      expect(columns1[1].tag).toBe('歴史');

      // 歴史、日本の順で選択
      const columns2 = createColumns(sampleEvents, ['歴史', '日本']);
      expect(columns2[0].tag).toBe('歴史');
      expect(columns2[1].tag).toBe('日本');
    });

    it('空のイベント配列でも正しく動作する', () => {
      const allTags = extractAllTags([]);
      expect(allTags).toEqual([]);

      const sorted = sortEventsByDate([]);
      expect(sorted).toEqual([]);

      const columns = createColumns([], ['歴史']);
      expect(columns).toHaveLength(1);
      expect(columns[0].events).toHaveLength(0);
    });
  });

  describe('イミュータビリティ', () => {
    it('元の配列を変更しない', () => {
      const originalEvents = [...sampleEvents];

      // ソート実行
      sortEventsByDate(sampleEvents);

      // 元の配列は変更されていない
      expect(sampleEvents).toEqual(originalEvents);

      // カラム生成実行
      createColumns(sampleEvents, ['歴史']);

      // 元の配列は変更されていない
      expect(sampleEvents).toEqual(originalEvents);
    });
  });
});
