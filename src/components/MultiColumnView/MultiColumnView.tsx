/**
 * MultiColumnView
 *
 * マルチカラムビューコンポーネント
 * Timeline列とタグ列を横並びに配置し、年間隔を実際の年数に比例させる
 */

import { useMemo } from 'react';
import { TimelineColumn } from '../TimelineColumn/TimelineColumn';
import { TagColumn } from '../TagColumn/TagColumn';
import { calculateYearPositions, createYearPositionMap } from '@/lib/utils/timeline';
import type { Column } from '@/lib/utils/types';

interface MultiColumnViewProps {
  timelineYears: number[];
  columns: Column[];
  sortOrder: 'asc' | 'desc';
}

export function MultiColumnView({ timelineYears, columns }: MultiColumnViewProps) {
  // 各年の縦位置を計算
  const yearPositions = useMemo(() => {
    return calculateYearPositions(timelineYears);
  }, [timelineYears]);

  // 年 → 位置のマッピング
  const yearPositionMap = useMemo(() => {
    return createYearPositionMap(timelineYears, yearPositions);
  }, [timelineYears, yearPositions]);

  // コンテナの最小高さを計算（最後の年の位置 + バッファ）
  const containerMinHeight = useMemo(() => {
    if (yearPositions.length === 0) return '100vh';
    const lastPosition = yearPositions[yearPositions.length - 1];
    return `${lastPosition + 200}px`; // 最後の年から200px下まで
  }, [yearPositions]);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div
        className="flex"
        style={{
          minHeight: containerMinHeight,
        }}
      >
        {/* Timeline列 */}
        <TimelineColumn years={timelineYears} yearPositions={yearPositions} />

        {/* タグ列 */}
        {columns.map((column) => (
          <TagColumn
            key={column.tag}
            column={column}
            yearPositionMap={yearPositionMap}
          />
        ))}
      </div>
    </div>
  );
}
