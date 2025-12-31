/**
 * タイムライン年位置計算ユーティリティ
 *
 * 年のリストから、各年の縦方向の位置（top値）を計算する
 * 年間隔は実際の年数差に比例する
 */

/** 1年あたりのピクセル数 */
export const PIXELS_PER_YEAR = 10;

/** 最小年間隔（px） */
export const MIN_YEAR_SPACING = 80;

/** ヘッダー高さ（px） */
export const HEADER_HEIGHT = 60;

/** 年マーカーの高さ（px） */
export const YEAR_MARKER_HEIGHT = 32;

/**
 * 年リストから各年の縦位置を計算する
 *
 * @param years - 年のリスト（昇順または降順）
 * @returns 各年のtop位置（px）の配列
 *
 * @example
 * calculateYearPositions([1965, 1984, 1990])
 * // => [100, 290, 350]
 * // 1965: ヘッダー直下（100px）
 * // 1984: 1965から190px下（19年 * 10px/年）
 * // 1990: 1984から60px下（6年 * 10px/年 < 最小80pxなので80px）
 */
export function calculateYearPositions(years: number[]): number[] {
  if (years.length === 0) {
    return [];
  }

  const positions: number[] = [];
  let currentTop = HEADER_HEIGHT + MIN_YEAR_SPACING / 2;

  for (let i = 0; i < years.length; i++) {
    positions.push(currentTop);

    if (i < years.length - 1) {
      // 次の年との差を計算（絶対値）
      const yearDiff = Math.abs(years[i + 1] - years[i]);
      // 最小間隔を確保
      const spacing = Math.max(yearDiff * PIXELS_PER_YEAR, MIN_YEAR_SPACING);
      currentTop += spacing;
    }
  }

  return positions;
}

/**
 * 年位置配列から年→位置のマップを生成する
 *
 * @param years - 年のリスト
 * @param positions - 年位置の配列
 * @returns 年をキー、位置を値とするMap
 */
export function createYearPositionMap(
  years: number[],
  positions: number[]
): Map<number, number> {
  const map = new Map<number, number>();

  for (let i = 0; i < years.length; i++) {
    map.set(years[i], positions[i]);
  }

  return map;
}
