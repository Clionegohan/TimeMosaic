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
      <div className="rounded-2xl border border-black/10 bg-[var(--tm-paper)] shadow-[0_1px_0_rgba(0,0,0,0.04)] p-4">
        <div className="text-gray-600">タグを読み込み中...</div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="rounded-2xl border border-black/10 bg-[var(--tm-paper)] shadow-[0_1px_0_rgba(0,0,0,0.04)] p-4">
        <div className="text-red-600">エラー: {error}</div>
      </div>
    );
  }

  // タグ0件
  if (allTags.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-[var(--tm-paper)] shadow-[0_1px_0_rgba(0,0,0,0.04)] p-4">
        <div className="text-gray-600">タグが見つかりませんでした</div>
      </div>
    );
  }

  // 利用可能なタグ（選択済みを除外）
  const availableTags = allTags.filter((tag) => !selectedTags.includes(tag));

  // 最大列数に達したか
  const isMaxReached = selectedTags.length >= MAX_COLUMNS;

  return (
    <section className="rounded-2xl border border-black/10 bg-[var(--tm-paper)] shadow-[0_1px_0_rgba(0,0,0,0.04)] p-4 space-y-4">
      {/* 選択済みタグ */}
      {selectedTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-stone-700 mb-2">選択中のタグ</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onRemoveTag(tag)}
                className="px-3 py-1 rounded-full text-sm bg-black/5 text-stone-800 hover:bg-black/10 transition-colors"
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
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-900">
            ⚠️ 最大{MAX_COLUMNS}列まで選択可能です。別のタグを選択する場合は、現在選択中のタグを削除してください。
          </p>
        </div>
      )}

      {/* 利用可能なタグ */}
      {availableTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-stone-700 mb-2">利用可能なタグ</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag(tag)}
                disabled={isMaxReached}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  isMaxReached
                    ? 'bg-black/3 text-stone-400 cursor-not-allowed border border-black/5'
                    : 'bg-[var(--tm-paper)] text-stone-700 hover:bg-black/3 border border-black/10'
                }`}
                aria-label={`タグ ${tag} を選択`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
