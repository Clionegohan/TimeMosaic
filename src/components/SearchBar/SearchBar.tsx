/**
 * SearchBar
 *
 * イベント検索用のテキスト入力コンポーネント
 */

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="イベントを検索..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-80 px-4 py-2 bg-[var(--tm-paper)] border border-black/15 rounded-xl text-stone-800 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
      aria-label="イベント検索"
    />
  );
}
