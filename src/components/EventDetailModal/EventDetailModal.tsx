/**
 * EventDetailModal
 *
 * イベント詳細モーダルコンポーネント
 * イベントの完全な情報を表示し、オーバーレイまたは閉じるボタンで閉じる
 */

import { formatDate } from '@/lib/utils';
import type { Event } from '@/lib/parser/types';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-[var(--tm-paper)] rounded-2xl border border-black/15 shadow-[0_20px_60px_rgba(0,0,0,0.25)] max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="p-6 border-b border-black/10">
          <h2 className="text-2xl font-semibold text-stone-900">{event.title}</h2>
          <p className="text-sm text-stone-600 mt-2">
            日付: {formatDate(event.date, 'ja')}
          </p>
        </div>

        {/* タグ */}
        <div className="px-6 py-4 border-b border-black/10">
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-black/4 text-stone-700 border border-black/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 説明文 */}
        {event.description && (
          <div className="px-6 py-4">
            <h3 className="font-semibold text-stone-900 mb-2">詳細</h3>
            <p className="text-stone-700 whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* フッター */}
        <div className="px-6 py-4 border-t border-black/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 text-[var(--tm-paper)] rounded-xl hover:bg-stone-700"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
