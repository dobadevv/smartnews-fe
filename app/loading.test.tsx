// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FeedLoading from '@/app/loading';

describe('FeedLoading', () => {
  it('renders the intro and six skeleton cards', () => {
    render(<FeedLoading />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Feed của tôi — luật của tôi.');
    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(6);
  });
});
