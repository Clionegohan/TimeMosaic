/**
 * TimelineColumn
 *
 * Timeline列を表示するコンポーネント
 * 全イベントの年リストを縦に表示し、年間の時間的関係を可視化する
 */

interface TimelineColumnProps {
  years: number[];
  yearToRowMap: Map<number, number>;
}

export function TimelineColumn({ years, yearToRowMap }: TimelineColumnProps) {
  return (
    <>
      {/* ヘッダー */}
      <div
        style={{ gridRow: 1, gridColumn: 1 }}
        className="p-4 font-semibold text-gray-700 border-r border-b bg-gray-50"
      >
        Timeline
      </div>

      {/* 年リスト */}
      {years.map((year) => {
        const rowIndex = yearToRowMap.get(year);
        return (
          <div
            key={year}
            style={{ gridRow: rowIndex, gridColumn: 1 }}
            className="p-4 border-r border-b text-center"
          >
            <div className="font-bold text-gray-800">{year}</div>
            <div className="text-gray-400 text-2xl">│</div>
          </div>
        );
      })}
    </>
  );
}
