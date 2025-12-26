/**
 * TimeMosaic Markdown Parser - 型定義
 *
 * イベントデータのパース結果を表現する型定義を提供します。
 */

/**
 * 部分的な日付情報
 * 年のみ、年月、または年月日のいずれかの形式を表現
 */
export interface PartialDate {
  year: number;
  month?: number;  // 1-12
  day?: number;    // 1-31
}

/**
 * イベントデータ
 */
export interface Event {
  id: string;              // 一意識別子（UUID v4推奨）
  date: PartialDate;       // イベント日付
  title: string;           // イベントタイトル
  tags: string[];          // タグ配列（最低1つ）
  description?: string;    // 説明文（オプション）
  raw: string;             // 元のMarkdownテキスト
}

/**
 * パースエラー情報
 */
export interface ParseError {
  line?: number;           // エラーが発生した行番号
  message: string;         // エラーメッセージ
  raw?: string;            // エラーが発生した元テキスト
}

/**
 * パース結果
 */
export interface ParseResult {
  events: Event[];         // 正常にパースされたイベント
  errors: ParseError[];    // パースエラーの詳細
}
