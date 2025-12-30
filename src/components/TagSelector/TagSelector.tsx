/**
 * TagSelector Component
 *
 * タグ選択UIコンポーネント
 * - 選択済みタグの表示
 * - 利用可能なタグの一覧表示
 * - タグの追加・削除
 * - 最大5列の制限
 */

const MAX_COLUMNS = 5;

export interface TagSelectorProps {
  allTags: string[];
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function TagSelector({
  allTags,
  selectedTags,
  onSelectTag,
  onRemoveTag,
  loading = false,
  error = null,
}: TagSelectorProps) {
  // ローディング状態
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-gray-600">タグを読み込み中...</div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-red-600">エラー: {error}</div>
      </div>
    );
  }

  // タグ0件
  if (allTags.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-gray-600">タグが見つかりませんでした</div>
      </div>
    );
  }

  // 利用可能なタグ（選択済みを除外）
  const availableTags = allTags.filter((tag) => !selectedTags.includes(tag));

  // 最大列数に達したか
  const isMaxReached = selectedTags.length >= MAX_COLUMNS;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      {/* 選択済みタグ */}
      {selectedTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">選択中のタグ</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onRemoveTag(tag)}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors"
                aria-label={`タグ ${tag} を削除`}
              >
                #{tag} ×
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 最大列数警告 */}
      {isMaxReached && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ 最大{MAX_COLUMNS}列まで選択可能です。別のタグを選択する場合は、現在選択中のタグを削除してください。
          </p>
        </div>
      )}

      {/* 利用可能なタグ */}
      {availableTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">利用可能なタグ</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag(tag)}
                disabled={isMaxReached}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  isMaxReached
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={`タグ ${tag} を選択`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
