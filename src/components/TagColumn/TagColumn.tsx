/**
 * TagColumn
 *
 * タグ列を表示するコンポーネント
 * 特定のタグを持つイベントを年ごとに絶対配置する
 */

import { EventCard } from '../EventCard/EventCard';
import type { Column } from '@/lib/utils/types';

interface TagColumnProps {
  column: Column;
  yearPositionMap: Map<number, number>; // 年→位置(px)のマップ
}

export function TagColumn({ column, yearPositionMap }: TagColumnProps) {
  return (
    <div className="relative border-r bg-white" style={{ width: '300px', minHeight: '100vh' }}>
      {/* ヘッダー */}
      <div className="p-4 font-semibold text-blue-600 border-b bg-blue-50 sticky top-0 z-10">
        #{column.tag}
      </div>

      {/* イベントリスト */}
      {column.events.map((event) => {
        const topPosition = yearPositionMap.get(event.date.year);
        if (topPosition === undefined) {
          console.warn(`Year ${event.date.year} not found in timeline for event ${event.id}`);
          return null;
        }

        // イベントカードを年マーカーの中心に合わせる
        // EventCardの高さを考慮して、中心を年マーカーに合わせる
        const cardTopPosition = topPosition - 40; // 年マーカーの中心から40px上

        return (
          <div
            key={event.id}
            className="absolute left-0 right-0 px-2"
            style={{ top: `${cardTopPosition}px` }}
          >
            <EventCard event={event} highlightTag={column.tag} />
          </div>
        );
      })}
    </div>
  );
}
