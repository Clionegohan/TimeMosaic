/**
 * EventDetailModal - Test
 *
 * イベント詳細モーダルコンポーネントのテスト
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventDetailModal } from './EventDetailModal';
import type { Event } from '@/lib/parser/types';

describe('EventDetailModal', () => {
  const mockEvent: Event = {
    id: '1',
    date: { year: 1945, month: 8, day: 15 },
    title: '終戦',
    tags: ['歴史', '日本'],
    description: 'これは詳細な説明文です。',
    raw: '',
  };

  let mockOnClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnClose = vi.fn();
  });

  it('イベントの詳細情報が表示される', () => {
    render(<EventDetailModal event={mockEvent} onClose={mockOnClose} />);

    expect(screen.getByText('終戦')).toBeInTheDocument();
    expect(screen.getByText('日付: 1945年8月15日')).toBeInTheDocument();
    expect(screen.getByText('#歴史')).toBeInTheDocument();
    expect(screen.getByText('#日本')).toBeInTheDocument();
    expect(screen.getByText('これは詳細な説明文です。')).toBeInTheDocument();
  });

  it('閉じるボタンでモーダルが閉じる', async () => {
    const user = userEvent.setup();
    render(<EventDetailModal event={mockEvent} onClose={mockOnClose} />);

    const closeButton = screen.getByText('閉じる');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('オーバーレイクリックでモーダルが閉じる', async () => {
    const user = userEvent.setup();
    const { container } = render(<EventDetailModal event={mockEvent} onClose={mockOnClose} />);

    const overlay = container.querySelector('.fixed');
    await user.click(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('モーダルコンテンツクリックでは閉じない', async () => {
    const user = userEvent.setup();
    const { container } = render(<EventDetailModal event={mockEvent} onClose={mockOnClose} />);

    const content = container.querySelector('.bg-white');
    await user.click(content!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('説明文がない場合は詳細セクションが表示されない', () => {
    const eventWithoutDesc: Event = { ...mockEvent, description: undefined };
    render(<EventDetailModal event={eventWithoutDesc} onClose={mockOnClose} />);

    expect(screen.queryByText('詳細')).not.toBeInTheDocument();
  });
});
