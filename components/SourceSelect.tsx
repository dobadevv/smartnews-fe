'use client';

import { type KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { FIELD_LABEL_CLASS } from '@/components/fieldStyles';
import { useOutsidePointerDown } from '@/hooks/useOutsidePointerDown';
import { joinClassNames } from '@/lib/classNames';
import { type FacetOption, buildFacetOptions } from '@/lib/facets';
import { sourceLabel } from '@/lib/format';
import type { ArticleFilters, Facet } from '@/lib/types';

const ALL_SOURCES_LABEL = 'Tất cả nguồn';

type SourceSelectProps = {
  filters: ArticleFilters;
  sources: Facet[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (next: ArticleFilters) => void;
};

export function SourceSelect({ filters, sources, isOpen, onOpenChange, onFiltersChange }: SourceSelectProps) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const valueId = `${baseId}-value`;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const options = buildFacetOptions({
    facets: sources,
    activeValue: filters.source,
    allLabel: ALL_SOURCES_LABEL,
    toUnknownLabel: sourceLabel,
  });
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === filters.source));
  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);
  const activeIndex = Math.min(highlightedIndex, options.length - 1);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  useOutsidePointerDown(fieldRef, { isActive: isOpen, onOutsidePointerDown: close });

  useEffect(() => {
    if (isOpen) listboxRef.current?.focus();
  }, [isOpen]);

  function open() {
    setHighlightedIndex(selectedIndex);
    onOpenChange(true);
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  function closeAndFocusTrigger() {
    close();
    triggerRef.current?.focus();
  }

  function selectOption(option: FacetOption) {
    closeAndFocusTrigger();
    if (option.value !== filters.source) onFiltersChange({ ...filters, source: option.value });
  }

  function moveHighlight(offset: number) {
    setHighlightedIndex((current) => Math.min(Math.max(current + offset, 0), options.length - 1));
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    // Enter and Space open through the native button click (toggle).
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    open();
  }

  function handleListboxKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveHighlight(1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        moveHighlight(-1);
        return;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(options.length - 1);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectOption(options[activeIndex]);
        return;
      case 'Escape':
        event.preventDefault();
        closeAndFocusTrigger();
        return;
      case 'Tab':
        close();
        return;
    }
  }

  return (
    <div ref={fieldRef} className="relative flex flex-col gap-2">
      <span id={labelId} className={FIELD_LABEL_CLASS}>
        Source
      </span>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-labelledby={`${labelId} ${valueId}`}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        className={joinClassNames(
          'flex cursor-pointer items-center justify-between gap-3 rounded-control border bg-bg px-3 py-[10px] text-left font-mono text-[13px] hover:border-accent-hover-border',
          isOpen ? 'border-accent-hover-border' : 'border-border',
        )}
      >
        <span id={valueId} className="truncate">
          {options[selectedIndex].label}
        </span>
        <span
          aria-hidden="true"
          className={joinClassNames(
            'text-[11px] text-accent transition-transform duration-150 ease-[ease] motion-reduce:transition-none',
            isOpen && 'rotate-180',
          )}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={optionId(activeIndex)}
          onKeyDown={handleListboxKeyDown}
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-20 flex max-h-[320px] flex-col gap-[2px] overflow-y-auto rounded-[10px] border border-border-strong bg-surface p-[6px] shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        >
          {options.map((option, index) => (
            <SourceOption
              key={option.value}
              id={optionId(index)}
              option={option}
              isSelected={index === selectedIndex}
              isHighlighted={index === activeIndex}
              onSelect={() => selectOption(option)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type SourceOptionProps = {
  id: string;
  option: FacetOption;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: () => void;
};

function SourceOption({ id, option, isSelected, isHighlighted, onSelect }: SourceOptionProps) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      className={joinClassNames(
        'flex w-full cursor-pointer items-center justify-between gap-3 rounded-[6px] px-[10px] py-[9px] text-left font-mono text-[13px]',
        getOptionStateClass({ isSelected, isHighlighted }),
      )}
    >
      <span>{option.label}</span>
      {isSelected ? (
        <span className="flex gap-[10px]">
          {option.count !== null && <span className="opacity-60">{option.count}</span>}
          <span aria-hidden="true">✓</span>
        </span>
      ) : (
        <span className="pr-[22px] text-muted">{option.count}</span>
      )}
    </div>
  );
}

function getOptionStateClass({ isSelected, isHighlighted }: { isSelected: boolean; isHighlighted: boolean }): string {
  if (isSelected) return 'bg-accent-dim text-accent';
  if (isHighlighted) return 'bg-[rgba(255,255,255,0.04)] text-text-bright';
  return 'bg-transparent text-text hover:bg-[rgba(255,255,255,0.04)] hover:text-text-bright';
}
