// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkeletonCard } from '@/components/SkeletonCard';

describe('SkeletonCard', () => {
  it('renders a hidden placeholder card', () => {
    render(<SkeletonCard />);
    expect(screen.getByTestId('skeleton-card')).toHaveAttribute('aria-hidden', 'true');
  });
});
