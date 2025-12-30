/**
 * TagSelector Component - Test
 *
 * AC2, AC3: タグ選択UI
 */

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
        onSelectTag={vi.fn()}
        onRemoveTag={vi.fn()}
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
        onSelectTag={vi.fn()}
        onRemoveTag={vi.fn()}
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
      <TagSelector
        allTags={mockTags}
        selectedTags={[]}
        onSelectTag={onSelectTag}
        onRemoveTag={vi.fn()}
      />
    );

    const historyTag = screen.getAllByText('#歴史')[0];
    fireEvent.click(historyTag);

    expect(onSelectTag).toHaveBeenCalledWith('歴史');
  });

  it('選択済みタグをクリックすると onRemoveTag が呼ばれる', () => {
    const onRemoveTag = vi.fn();

    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={['歴史']}
        onSelectTag={vi.fn()}
        onRemoveTag={onRemoveTag}
      />
    );

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
        onSelectTag={vi.fn()}
        onRemoveTag={vi.fn()}
      />
    );

    expect(screen.getByText(/最大5列まで選択可能です/)).toBeInTheDocument();
  });

  it('最大5列に達すると利用可能タグが無効化される', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={['歴史', '日本', 'スポーツ', '科学', '文化']}
        onSelectTag={vi.fn()}
        onRemoveTag={vi.fn()}
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
        onSelectTag={vi.fn()}
        onRemoveTag={vi.fn()}
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
        onSelectTag={vi.fn()}
        onRemoveTag={vi.fn()}
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
        onSelectTag={vi.fn()}
        onRemoveTag={vi.fn()}
      />
    );

    expect(screen.getByText('タグが見つかりませんでした')).toBeInTheDocument();
  });

  it('選択済みタグを視覚的に区別できる', () => {
    render(
      <TagSelector
        allTags={mockTags}
        selectedTags={['歴史']}
        onSelectTag={vi.fn()}
        onRemoveTag={vi.fn()}
      />
    );

    const selectedSection = screen.getByText('選択中のタグ').closest('div');
    const selectedTag = selectedSection!.querySelector('button');

    // 選択済みタグには特定のクラスが付与される
    expect(selectedTag).toHaveClass('bg-blue-500');
  });
});
