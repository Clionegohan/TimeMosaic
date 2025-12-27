/**
 * TimeMosaic Markdown Parser - 説明文パーサー
 *
 * 説明文の行配列を結合して文字列として返します。
 */

/**
 * 説明文の行配列をパースして文字列に変換
 *
 * @param lines 説明文の行配列
 * @returns パースされた説明文（空の場合はundefined）
 *
 * @example
 * parseDescription(['説明1行目', '説明2行目']) // "説明1行目\n説明2行目"
 * parseDescription([]) // undefined
 * parseDescription(['---']) // undefined
 */
export function parseDescription(lines: string[]): string | undefined {
  // 各行をトリムして、---のみの行を除外
  const processedLines = lines
    .map((line) => line.trim())
    .filter((line) => line !== '---');

  // 前後の空行を除去
  let start = 0;
  let end = processedLines.length - 1;

  // 先頭の空行をスキップ
  while (start <= end && processedLines[start] === '') {
    start++;
  }

  // 末尾の空行をスキップ
  while (end >= start && processedLines[end] === '') {
    end--;
  }

  // 有効な行がない場合
  if (start > end) {
    return undefined;
  }

  // 残りの行を結合
  const result = processedLines.slice(start, end + 1).join('\n');

  return result || undefined;
}
