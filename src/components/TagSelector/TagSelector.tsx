/**
 * TagSelector Component
 *
 * タグ選択UIコンポーネント
 * - 選択済みタグの表示
 * - 利用可能なタグの一覧表示
 * - タグの追加・削除
 * - 最大5列の制限
 */

import { useEffect, useRef } from 'react';

type TagSelectorVariant = 'panel' | 'header';

const MAX_COLUMNS = 5;

export interface TagSelectorProps {
  allTags: string[];
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  loading?: boolean;
  error?: string | null;
  variant?: TagSelectorVariant;
}

export function TagSelector({
  allTags,
  selectedTags,
  onSelectTag,
  onRemoveTag,
  loading = false,
  error = null,
  variant = 'panel',
}: TagSelectorProps) {
  const tagScrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (variant !== 'header') return;

    const element = tagScrollAreaRef.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      // 横方向の入力が強い場合はブラウザの横スクロールに任せる
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      // Shift+ホイールはブラウザの横スクロールとして扱うことが多いので邪魔しない
      if (event.shiftKey) return;

      // 横にスクロールできないなら、ページの縦スクロールを優先
      const isHorizontallyScrollable = element.scrollWidth > element.clientWidth;
      if (!isHorizontallyScrollable) return;

      // 縦ホイールを横スクロールに変換
      if (event.deltaY === 0) return;

      const nextLeft = element.scrollLeft + event.deltaY;
      const maxLeft = element.scrollWidth - element.clientWidth;
      const clampedNextLeft = Math.min(Math.max(0, nextLeft), Math.max(0, maxLeft));

      // 端にいて動かない場合はページスクロールに譲る
      if (clampedNextLeft === element.scrollLeft) return;

      event.preventDefault();
      element.scrollLeft = clampedNextLeft;
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [variant]);

  // ローディング状態
  if (loading) {
    if (variant === 'header') {
      return <div className="text-sm text-stone-600">タグを読み込み中...</div>;
    }

    return (
      <div className="rounded-2xl border border-black/10 bg-[var(--tm-paper)] shadow-[0_1px_0_rgba(0,0,0,0.04)] p-4">
        <div className="text-gray-600">タグを読み込み中...</div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    if (variant === 'header') {
      return <div className="text-sm text-red-700">タグ取得エラー: {error}</div>;
    }

    return (
      <div className="rounded-2xl border border-black/10 bg-[var(--tm-paper)] shadow-[0_1px_0_rgba(0,0,0,0.04)] p-4">
        <div className="text-red-600">エラー: {error}</div>
      </div>
    );
  }

  // タグ0件
  if (allTags.length === 0) {
    if (variant === 'header') {
      return <div className="text-sm text-stone-600">タグがありません</div>;
    }

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

  if (variant === 'header') {
    return (
      <div className="min-w-0 flex items-center gap-3">
        <div
          ref={tagScrollAreaRef}
          className="min-w-0 flex-1 overflow-x-auto"
          aria-label="タグ絞り込み（ホイールで横スクロール）"
        >
          <div className="flex items-center gap-2 flex-nowrap py-1">
            {selectedTags.length > 0 &&
              selectedTags.map((tag) => (
                <button
                  key={`selected-${tag}`}
                  onClick={() => onRemoveTag(tag)}
                  className="px-3 py-1 rounded-full text-sm bg-black/6 text-stone-800 hover:bg-black/10 transition-colors whitespace-nowrap"
                  aria-label={`タグ ${tag} を解除`}
                >
                  #{tag} ×
                </button>
              ))}

            {selectedTags.length > 0 && availableTags.length > 0 && (
              <span className="mx-1 text-stone-300 select-none whitespace-nowrap">|</span>
            )}

            {availableTags.map((tag) => (
              <button
                key={`available-${tag}`}
                onClick={() => onSelectTag(tag)}
                disabled={isMaxReached}
                className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                  isMaxReached
                    ? 'bg-black/3 text-stone-400 cursor-not-allowed border border-black/5'
                    : 'bg-[var(--tm-paper)] text-stone-700 hover:bg-black/3 border border-black/10'
                }`}
                aria-label={`タグ ${tag} で絞り込む`}
              >
                #{tag} +
              </button>
            ))}
          </div>
        </div>

        {isMaxReached && (
          <div className="text-xs text-amber-900 whitespace-nowrap">最大{MAX_COLUMNS}列</div>
        )}
      </div>
    );
  }

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
