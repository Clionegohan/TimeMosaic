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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          <p className="text-sm text-gray-600 mt-2">
            日付: {formatDate(event.date, 'ja')}
          </p>
        </div>

        {/* タグ */}
        <div className="px-6 py-4 border-b">
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 説明文 */}
        {event.description && (
          <div className="px-6 py-4">
            <h3 className="font-semibold text-gray-900 mb-2">詳細</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* フッター */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
