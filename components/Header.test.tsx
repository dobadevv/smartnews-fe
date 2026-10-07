// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from '@/components/Header';

describe('Header', () => {
  it('links the avatar and wordmark home', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /Doba\.news/ });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(screen.getByAltText('Doba')).toHaveAttribute('src', '/assets/avatar-96.png');
  });

  it('renders the feed and portfolio navigation', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'feed' })).toHaveAttribute('href', '/');
    const portfolio = screen.getByRole('link', { name: 'portfolio ↗' });
    expect(portfolio).toHaveAttribute('href', 'https://github.com/dobadevv/dobadev-portfolio');
    expect(portfolio).toHaveAttribute('target', '_blank');
    expect(portfolio).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
