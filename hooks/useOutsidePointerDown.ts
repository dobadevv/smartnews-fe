import { type RefObject, useEffect } from 'react';

type OutsidePointerDownOptions = { isActive: boolean; onOutsidePointerDown: () => void };

export function useOutsidePointerDown(
  ref: RefObject<HTMLElement | null>,
  { isActive, onOutsidePointerDown }: OutsidePointerDownOptions,
): void {
  useEffect(() => {
    if (!isActive) return;
    function handlePointerDown(event: Event) {
      const element = ref.current;
      if (element && event.target instanceof Node && !element.contains(event.target)) onOutsidePointerDown();
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [ref, isActive, onOutsidePointerDown]);
}
