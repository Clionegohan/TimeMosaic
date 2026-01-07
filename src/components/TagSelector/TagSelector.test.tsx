/**
 * TagSelector Component - Test
 *
 * AC2, AC3: タグ選択UI
 */

import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagSelector } from './TagSelector';

describe('TagSelector', () => {
  const mockTags = ['歴史', '日本', 'スポーツ', '科学', '文化', '経済'];

  it('利用可能なタグ一覧を表示する', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={[]}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
      />
    );

    mockTags.forEach((tag) => {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
    });
  });

  it('選択済みタグは利用可能タグから除外される', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={['歴史', '日本']}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
      />
    );

    // 選択済みタグは選択済みセクションにのみ表示される
    const availableSection = screen.getByText('利用可能なタグ').closest('div');
    expect(availableSection).not.toHaveTextContent('歴史');
    expect(availableSection).not.toHaveTextContent('日本');

    // 未選択タグは利用可能セクションに表示される
    expect(availableSection).toHaveTextContent('スポーツ');
    expect(availableSection).toHaveTextContent('科学');
  });

  it('タグをクリックすると onSelectTag が呼ばれる', () => {
    const onSelectTag = vi.fn();

    render(
      <TagSelector allTags={mockTags} selectedTags={[]} onSelectTag={onSelectTag} onRemoveTag={vi.fn()} />
    );

    const historyTag = screen.getAllByText('#歴史')[0];
    fireEvent.click(historyTag);

    expect(onSelectTag).toHaveBeenCalledWith('歴史');
  });

  it('選択済みタグをクリックすると onRemoveTag が呼ばれる', () => {
    const onRemoveTag = vi.fn();

    render(<TagSelector allTags={mockTags} selectedTags={['歴史']} onSelectTag={vi.fn()} onRemoveTag={onRemoveTag} />);

    // 選択済みタグセクションのタグをクリック
    const selectedSection = screen.getByText('選択中のタグ').closest('div');
    const historyTag = selectedSection!.querySelector('button');

    fireEvent.click(historyTag!);

    expect(onRemoveTag).toHaveBeenCalledWith('歴史');
  });

  it('最大5列に達すると警告を表示する', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={['歴史', '日本', 'スポーツ', '科学', '文化']}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
      />
    );

    expect(screen.getByText(/最大5列まで選択可能です/)).toBeInTheDocument();
  });

  it('最大5列に達すると利用可能タグが無効化される', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={['歴史', '日本', 'スポーツ', '科学', '文化']}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
      />
    );

    const availableSection = screen.getByText('利用可能なタグ').closest('div');
    const economyTagButton = availableSection!.querySelector('button');

    expect(economyTagButton).toBeDisabled();
  });

  it('loading中は「読み込み中...」を表示する', () => {
    render(
      <TagSelector
        allTags={[]}
        selectedTags={[]}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
        loading={true}
      />
    );

    expect(screen.getByText('タグを読み込み中...')).toBeInTheDocument();
  });

  it('エラー時はエラーメッセージを表示する', () => {
    render(
      <TagSelector
        allTags={[]}
        selectedTags={[]}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
        error="タグの取得に失敗しました"
      />
    );

    expect(screen.getByText(/エラー: タグの取得に失敗しました/)).toBeInTheDocument();
  });

  it('タグが0件の場合はメッセージを表示する', () => {
    render(
      <TagSelector
        allTags={[]}
        selectedTags={[]}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
      />
    );

    expect(screen.getByText('タグが見つかりませんでした')).toBeInTheDocument();
  });

  it('選択済みタグを視覚的に区別できる', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={['歴史']}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
      />
    );

    const selectedSection = screen.getByText('選択中のタグ').closest('div');
    const selectedTag = selectedSection!.querySelector('button');

    // 選択済みタグには特定のクラスが付与される
    expect(selectedTag).toHaveClass('bg-black/5');
  });

  it('header variant ではタグ絞り込みUIを表示する', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={[]}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
        variant="header"
      />
    );

    expect(screen.getByText('タグで絞り込む')).toBeInTheDocument();
    expect(screen.getByLabelText('タグ絞り込み（ホイールで横スクロール）')).toBeInTheDocument();
    expect(screen.getByText('未選択（クリックで追加）')).toBeInTheDocument();

    // 利用可能タグは「+」付きで表示
    expect(screen.getByText('#歴史 +')).toBeInTheDocument();
  });

  it('header variant では選択済みタグが「×」付きで表示される', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={['歴史']}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
        variant="header"
      />
    );

    expect(screen.getByText('#歴史 ×')).toBeInTheDocument();
    // 選択済みは利用可能側（+）には出ない
    expect(screen.queryByText('#歴史 +')).not.toBeInTheDocument();
  });

  it('header variant のタグ欄は縦ホイール入力で横スクロールできる', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={[]}
        onSelectTag={vi.fn() as unknown as (tag: string) => void}
        onRemoveTag={vi.fn() as unknown as (tag: string) => void}
        variant="header"
      />
    );

    const scrollArea = screen.getByLabelText('タグ絞り込み（ホイールで横スクロール）') as HTMLDivElement;

    // JSDOM はレイアウト計算しないので、スクロール可能と見なすために値を手動設定
    Object.defineProperty(scrollArea, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(scrollArea, 'scrollWidth', { value: 300, configurable: true });

    scrollArea.scrollLeft = 0;
    fireEvent.wheel(scrollArea, { deltaY: 80, deltaX: 0 });

    expect(scrollArea.scrollLeft).toBeGreaterThan(0);
  });
});
