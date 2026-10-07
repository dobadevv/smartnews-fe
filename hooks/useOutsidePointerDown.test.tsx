// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useOutsidePointerDown } from '@/hooks/useOutsidePointerDown';

function Harness({ isActive, onOutsidePointerDown }: { isActive: boolean; onOutsidePointerDown: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsidePointerDown(ref, { isActive, onOutsidePointerDown });
  return (
    <div>
      <div ref={ref}>inside</div>
      <span>outside</span>
    </div>
  );
}

describe('useOutsidePointerDown', () => {
  it('calls back for pointer down outside the element only', () => {
    const onOutsidePointerDown = vi.fn();
    render(<Harness isActive onOutsidePointerDown={onOutsidePointerDown} />);
    fireEvent.pointerDown(screen.getByText('inside'));
    expect(onOutsidePointerDown).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(onOutsidePointerDown).toHaveBeenCalledTimes(1);
  });

  it('does not listen while inactive', () => {
    const onOutsidePointerDown = vi.fn();
    render(<Harness isActive={false} onOutsidePointerDown={onOutsidePointerDown} />);
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(onOutsidePointerDown).not.toHaveBeenCalled();
  });
});
