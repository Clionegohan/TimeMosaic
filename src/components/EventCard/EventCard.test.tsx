/**
 * EventCard - Test
 *
 * イベントカードコンポーネントのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCard } from './EventCard';
import type { Event } from '@/lib/parser/types';

describe('EventCard', () => {
  const mockEvent: Event = {
    id: '1',
    date: { year: 1945, month: 8, day: 15 },
    title: '終戦',
    tags: ['歴史', '日本'],
    description: 'これは説明文です。',
    raw: '',
  };

  it('イベント情報が表示される', () => {
    render(<EventCard event={mockEvent} highlightTag="歴史" />);

    expect(screen.getByText('1945-08-15')).toBeInTheDocument();
    expect(screen.getByText('終戦')).toBeInTheDocument();
    expect(screen.getByText('#歴史')).toBeInTheDocument();
    expect(screen.getByText('#日本')).toBeInTheDocument();
  });

  it('highlightTag が強調表示される', () => {
    render(<EventCard event={mockEvent} highlightTag="歴史" />);

    const historyTag = screen.getByText('#歴史');
    const japanTag = screen.getByText('#日本');

    expect(historyTag).toHaveClass('bg-black/5');
    expect(japanTag).toHaveClass('bg-black/3');
  });

  it('説明文は常に1行で省略表示される', () => {
    const longDescription = 'a'.repeat(100);
    const eventWithLongDesc: Event = { ...mockEvent, description: longDescription };

    render(<EventCard event={eventWithLongDesc} highlightTag="歴史" />);

    const desc = screen.getByText(longDescription);
    expect(desc).toHaveClass('truncate');
    expect(desc).toHaveAttribute('title', longDescription);
  });

  it('説明文がない場合は表示されない', () => {
    const eventWithoutDesc: Event = { ...mockEvent, description: undefined };

    render(<EventCard event={eventWithoutDesc} highlightTag="歴史" />);

    expect(screen.queryByText(mockEvent.description!)).not.toBeInTheDocument();
  });


  it('クリックでモーダルが開く', async () => {
    const user = userEvent.setup();
    render(<EventCard event={mockEvent} highlightTag="歴史" />);

    const card = screen.getByText('終戦').closest('div');
    await user.click(card!);

    // モーダルのタイトルが表示される（2つ目の「終戦」がモーダル内）
    const titles = screen.getAllByText('終戦');
    expect(titles.length).toBeGreaterThan(1);
  });
});
