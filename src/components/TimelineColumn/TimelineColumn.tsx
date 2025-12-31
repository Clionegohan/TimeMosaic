/**
 * TimelineColumn
 *
 * Timeline列を一本の縦線として表示するコンポーネント
 * イベントがある年だけをマーカーとして配置し、年間隔を実際の年数に比例させる
 */

interface TimelineColumnProps {
  years: number[];
  yearPositions: number[]; // 各年のtop位置（px）
  centuryMarkers?: Array<{ year: number; position: number }>; // 100年区切りマーカー
}

export function TimelineColumn({ years, yearPositions, centuryMarkers = [] }: TimelineColumnProps) {
  return (
    <div className="relative border-r bg-gray-50" style={{ width: '120px' }}>
      {/* ヘッダー */}
      <div className="p-4 font-semibold text-gray-700 border-b bg-gray-50 sticky top-0 z-10">
        Timeline
      </div>

      {/* 縦線 */}
      <div
        className="absolute left-1/2 border-l-2 border-gray-300"
        style={{
          top: '60px',
          bottom: '0',
          transform: 'translateX(-50%)',
        }}
      />

      {/* 100年区切りマーカー */}
      {centuryMarkers.map((marker) => (
        <div
          key={`century-${marker.year}`}
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ top: `${marker.position}px` }}
        >
          {/* 100年区切りラベル（目立つデザイン） */}
          <div className="relative z-10 bg-blue-600 text-white border-2 border-blue-700 rounded px-4 py-1.5 font-bold text-base shadow-lg">
            {marker.year}
          </div>
        </div>
      ))}

      {/* イベント年マーカー */}
      {years.map((year, index) => {
        const topPosition = yearPositions[index];
        return (
          <div
            key={year}
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{ top: `${topPosition}px` }}
          >
            {/* 年ラベル */}
            <div className="relative z-10 bg-white border-2 border-gray-300 rounded-full px-3 py-1 font-bold text-gray-800 text-sm">
              {year}
            </div>

            {/* 水平線（タイムラインからイベントへ） */}
            <div className="absolute left-full w-4 border-t-2 border-gray-300" />
          </div>
        );
      })}
    </div>
  );
}
