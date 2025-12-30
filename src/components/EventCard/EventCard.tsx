/**
 * EventCard
 *
 * イベントカードコンポーネント
 * イベントの要約情報を表示し、クリックで詳細モーダルを開く
 */

import { useState } from 'react';
import { EventDetailModal } from '../EventDetailModal/EventDetailModal';
import { formatDate } from '@/lib/utils';
import type { Event } from '@/lib/parser/types';

interface EventCardProps {
  event: Event;
  highlightTag: string;
}

export function EventCard({ event, highlightTag }: EventCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="p-4 border-r border-b bg-white hover:bg-gray-50 cursor-pointer"
      >
        {/* 日付 */}
        <div className="text-sm text-gray-600">{formatDate(event.date)}</div>

        {/* タイトル */}
        <div className="font-medium text-gray-900 mt-1">{event.title}</div>

        {/* タグ */}
        <div className="flex flex-wrap gap-1 mt-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className={
                tag === highlightTag
                  ? 'px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 font-semibold'
                  : 'px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600'
              }
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 説明文（最初の50文字） */}
        {event.description && (
          <div className="text-xs text-gray-500 mt-2">
            {event.description.substring(0, 50)}
            {event.description.length > 50 && '...'}
          </div>
        )}
      </div>

      {/* モーダル */}
      {showModal && (
        <EventDetailModal event={event} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
