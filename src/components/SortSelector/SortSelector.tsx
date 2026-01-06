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
      className="w-full sm:w-auto px-4 py-2 bg-[var(--tm-paper)] border border-black/15 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300"
      aria-label="並び順"
    >
      <option value="asc">古い順</option>
      <option value="desc">新しい順</option>
    </select>
  );
}
