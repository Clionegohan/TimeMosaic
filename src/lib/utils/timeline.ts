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

/**
 * 100年区切りの年とその位置を計算する
 *
 * @param years - イベントがある年のリスト
 * @param yearPositionMap - 年→位置のマップ
 * @returns 100年区切りの年とその位置の配列
 *
 * @example
 * // イベント年: [1965, 1984, 2020]
 * // 100年区切り: 1900, 2000
 * calculateCenturyMarkers([1965, 1984, 2020], map)
 * // => [{ year: 1900, position: 50 }, { year: 2000, position: 450 }]
 */
export function calculateCenturyMarkers(
  years: number[],
  yearPositionMap: Map<number, number>
): Array<{ year: number; position: number }> {
  if (years.length === 0) return [];

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  // 最小年以下の最大の100の倍数
  const startCentury = Math.floor(minYear / 100) * 100;
  // 最大年以上の最小の100の倍数
  const endCentury = Math.ceil(maxYear / 100) * 100;

  const centuryMarkers: Array<{ year: number; position: number }> = [];

  for (let century = startCentury; century <= endCentury; century += 100) {
    // この100年区切りの位置を計算
    // イベント年の間に挟まれている場合は補間、範囲外の場合は外挿
    const position = interpolateYearPosition(century, years, yearPositionMap);
    centuryMarkers.push({ year: century, position });
  }

  return centuryMarkers;
}

/**
 * 年の位置を補間/外挿する
 *
 * @param targetYear - 位置を求めたい年
 * @param years - イベントがある年のリスト（ソート済み）
 * @param yearPositionMap - 年→位置のマップ
 * @returns 補間/外挿された位置（px）
 */
function interpolateYearPosition(
  targetYear: number,
  years: number[],
  yearPositionMap: Map<number, number>
): number {
  // イベント年リストに含まれている場合
  const exactPosition = yearPositionMap.get(targetYear);
  if (exactPosition !== undefined) {
    return exactPosition;
  }

  // targetYearがイベント年の範囲外の場合
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  if (targetYear < minYear) {
    // 最小年より前 → 外挿
    const firstYear = years[0];
    const firstPosition = yearPositionMap.get(firstYear)!;
    const yearDiff = firstYear - targetYear;
    return firstPosition - yearDiff * PIXELS_PER_YEAR;
  }

  if (targetYear > maxYear) {
    // 最大年より後 → 外挿
    const lastYear = years[years.length - 1];
    const lastPosition = yearPositionMap.get(lastYear)!;
    const yearDiff = targetYear - lastYear;
    return lastPosition + yearDiff * PIXELS_PER_YEAR;
  }

  // targetYearが2つのイベント年の間にある場合 → 線形補間
  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i];
    const year2 = years[i + 1];

    if (year1 <= targetYear && targetYear <= year2) {
      const pos1 = yearPositionMap.get(year1)!;
      const pos2 = yearPositionMap.get(year2)!;

      // 線形補間
      const ratio = (targetYear - year1) / (year2 - year1);
      return pos1 + ratio * (pos2 - pos1);
    }
  }

  // フォールバック（通常ここには来ない）
  return yearPositionMap.get(years[0])!;
}
