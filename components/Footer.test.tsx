// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('renders the copyright and tagline', () => {
    render(<Footer />);
    expect(screen.getByText('© 2026 Nguyễn Duy Anh (Doba)')).toBeInTheDocument();
    expect(screen.getByText('Read with structure over noise.')).toBeInTheDocument();
  });
});
