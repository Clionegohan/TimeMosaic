import { useState } from 'react';
import { useTags } from './hooks/useTags';
import { useColumns } from './hooks/useColumns';
import { TagSelector } from './components/TagSelector/TagSelector';
import { MultiColumnView } from './components/MultiColumnView/MultiColumnView';
import { extractTimelineYears } from './lib/utils';

function App() {
  // タグ一覧を取得
  const { tags, loading: tagsLoading, error: tagsError } = useTags();

  // 選択済みタグの状態管理
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // ソート順の状態管理（将来的に使用）
  const [sortOrder] = useState<'asc' | 'desc'>('asc');

  // カラムデータを取得
  const { columns, loading: columnsLoading } = useColumns(selectedTags, sortOrder);

  // Timeline用の年リストを生成
  const timelineYears = extractTimelineYears(columns, sortOrder);

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
                columns={columns}
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
