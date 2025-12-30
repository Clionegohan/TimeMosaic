import { useState, useEffect, useMemo } from 'react';
import { useTags } from './hooks/useTags';
import { useColumns } from './hooks/useColumns';
import { TagSelector } from './components/TagSelector/TagSelector';
import { MultiColumnView } from './components/MultiColumnView/MultiColumnView';
import { SearchBar } from './components/SearchBar/SearchBar';
import { SortSelector } from './components/SortSelector/SortSelector';
import { extractTimelineYears } from './lib/utils';

function App() {
  // タグ一覧を取得
  const { tags, loading: tagsLoading, error: tagsError } = useTags();

  // 選択済みタグの状態管理
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 検索キーワードの状態管理
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // ソート順の状態管理
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // カラムデータを取得
  const { columns, loading: columnsLoading } = useColumns(selectedTags, sortOrder);

  // デバウンス処理（300ms遅延）
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300);

    // クリーンアップ: 次の入力があった場合、前のタイマーをクリア
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // クライアント側フィルタリング
  const filteredColumns = useMemo(() => {
    if (!debouncedKeyword) return columns;

    return columns.map((column) => ({
      ...column,
      events: column.events.filter(
        (event) =>
          event.title.includes(debouncedKeyword) ||
          event.description?.includes(debouncedKeyword) ||
          event.tags.some((tag) => tag.includes(debouncedKeyword))
      ),
    }));
  }, [columns, debouncedKeyword]);

  // Timeline用の年リストを生成
  const timelineYears = extractTimelineYears(filteredColumns, sortOrder);

  // タグ選択ハンドラー
  const handleSelectTag = (tag: string) => {
    if (selectedTags.length < 5 && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // タグ削除ハンドラー
  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">TimeMosaic</h1>
          <p className="mt-2 text-sm text-gray-600">
            歴史的出来事を時系列で可視化するタイムラインビューア
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* コントロールエリア: 検索とソート */}
        <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
          <SearchBar value={searchKeyword} onChange={setSearchKeyword} />
          <SortSelector value={sortOrder} onChange={setSortOrder} />
        </div>

        {/* タグ選択UI */}
        <TagSelector
          allTags={tags}
          selectedTags={selectedTags}
          onSelectTag={handleSelectTag}
          onRemoveTag={handleRemoveTag}
          loading={tagsLoading}
          error={tagsError}
        />

        {/* マルチカラムビュー（Step 2） */}
        {selectedTags.length > 0 && (
          <>
            {columnsLoading ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">カラムデータを読み込み中...</p>
              </div>
            ) : (
              <MultiColumnView
                timelineYears={timelineYears}
                columns={filteredColumns}
                sortOrder={sortOrder}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
