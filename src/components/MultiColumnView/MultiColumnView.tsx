/**
 * MultiColumnView
 *
 * マルチカラムビューコンポーネント
 * Timeline列とタグ列を横並びに配置し、CSS Gridで年ごとの行を整列
 */

import { useMemo } from 'react';
import { TimelineColumn } from '../TimelineColumn/TimelineColumn';
import { TagColumn } from '../TagColumn/TagColumn';
import type { Column } from '@/lib/utils/types';

interface MultiColumnViewProps {
  timelineYears: number[];
  columns: Column[];
  sortOrder: 'asc' | 'desc';
}

export function MultiColumnView({ timelineYears, columns }: MultiColumnViewProps) {
  // 年 → 行番号のマッピング
  const yearToRowMap = useMemo(() => {
    return new Map(timelineYears.map((year, index) => [year, index + 2])); // +2 はヘッダー行分
  }, [timelineYears]);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div
        className="grid"
        style={{
          gridTemplateRows: `60px ${timelineYears.map(() => 'auto').join(' ')}`,
          gridTemplateColumns: `120px repeat(${columns.length}, 300px)`,
        }}
      >
        {/* Timeline列 */}
        <TimelineColumn years={timelineYears} yearToRowMap={yearToRowMap} />

        {/* タグ列 */}
        {columns.map((column, colIndex) => (
          <TagColumn
            key={column.tag}
            column={column}
            colIndex={colIndex}
            yearToRowMap={yearToRowMap}
          />
        ))}
      </div>
    </div>
  );
}
