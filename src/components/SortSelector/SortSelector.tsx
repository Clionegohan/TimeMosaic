/**
 * SortSelector
 *
 * イベントの並び順を選択するセレクトボックスコンポーネント
 */

interface SortSelectorProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'asc' | 'desc')}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="asc">古い順</option>
      <option value="desc">新しい順</option>
    </select>
  );
}
