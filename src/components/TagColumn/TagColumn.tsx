/**
 * TagColumn
 *
 * タグ列を表示するコンポーネント
 * 特定のタグを持つイベントを年ごとに配置する
 */

import { EventCard } from '../EventCard/EventCard';
import type { Column } from '@/lib/utils/types';

interface TagColumnProps {
  column: Column;
  colIndex: number;
  yearToRowMap: Map<number, number>;
}

export function TagColumn({ column, colIndex, yearToRowMap }: TagColumnProps) {
  return (
    <>
      {/* ヘッダー */}
      <div
        style={{ gridRow: 1, gridColumn: colIndex + 2 }}
        className="p-4 font-semibold text-blue-600 border-r border-b bg-blue-50"
      >
        #{column.tag}
      </div>

      {/* イベントリスト */}
      {column.events.map((event) => {
        const rowIndex = yearToRowMap.get(event.date.year);
        if (rowIndex === undefined) {
          console.warn(`Year ${event.date.year} not found in timeline for event ${event.id}`);
          return null;
        }
        return (
          <div
            key={event.id}
            style={{ gridRow: rowIndex, gridColumn: colIndex + 2 }}
          >
            <EventCard event={event} highlightTag={column.tag} />
          </div>
        );
      })}
    </>
  );
}
