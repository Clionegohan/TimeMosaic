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
        className="group cursor-pointer rounded-xl border border-black/10 bg-[var(--tm-paper)] px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-stone-50"
      >
        <div className="text-xs text-stone-600">{formatDate(event.date)}</div>
        <div className="mt-1 font-medium text-stone-900 leading-snug">{event.title}</div>

        <div className="mt-2 flex flex-wrap gap-1">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className={
                tag === highlightTag
                  ? 'px-2 py-0.5 text-xs rounded-full bg-black/5 text-stone-800 border border-black/5'
                  : 'px-2 py-0.5 text-xs rounded-full bg-black/3 text-stone-700 border border-black/5'
              }
            >
              #{tag}
            </span>
          ))}
        </div>

        {event.description && (
          <div className="mt-2 text-xs text-stone-600 truncate" title={event.description}>
            {event.description}
          </div>
        )}
      </div>

      {showModal && <EventDetailModal event={event} onClose={() => setShowModal(false)} />}
    </>
  );
}
