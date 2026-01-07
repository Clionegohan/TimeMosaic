/**
 * MultiColumnView
 *
 * マルチカラムビューコンポーネント
 * Timeline列とタグ列を横並びに配置し、年間隔を実際の年数に比例させる
 */

import { useMemo } from 'react';
import { TimelineColumn } from '../TimelineColumn/TimelineColumn';
import { TagColumn } from '../TagColumn/TagColumn';
import { calculateCenturyMarkers, calculateYearPositions, createYearPositionMap } from '@/lib/utils/timeline';
import type { Column } from '@/lib/utils/types';

interface MultiColumnViewProps {
  timelineYears: number[];
  columns: Column[];
}

export function MultiColumnView({ timelineYears, columns }: MultiColumnViewProps) {
  const yearPositions = useMemo(() => {
    return calculateYearPositions(timelineYears);
  }, [timelineYears]);

  const yearPositionMap = useMemo(() => {
    return createYearPositionMap(timelineYears, yearPositions);
  }, [timelineYears, yearPositions]);

  const centuryMarkers = useMemo(() => {
    return calculateCenturyMarkers(timelineYears, yearPositionMap);
  }, [timelineYears, yearPositionMap]);

  const containerMinHeight = useMemo(() => {
    if (yearPositions.length === 0) return '100vh';
    const lastPosition = yearPositions[yearPositions.length - 1];
    return `${lastPosition + 200}px`;
  }, [yearPositions]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-[var(--tm-paper)] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="flex" style={{ minHeight: containerMinHeight }}>
        <TimelineColumn years={timelineYears} yearPositions={yearPositions} centuryMarkers={centuryMarkers} />

        {columns.map((column) => (
          <TagColumn key={column.tag} column={column} yearPositionMap={yearPositionMap} />
        ))}
      </div>
    </div>
  );
}
