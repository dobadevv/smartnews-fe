import type { ReactNode } from 'react';

export const NOTICE_ACTION_CLASS =
  'inline-flex cursor-pointer rounded-control border-none bg-accent px-[18px] py-[10px] font-mono text-[13px] font-medium text-bg hover:text-bg';

export function NoticeBox({ message, children }: { message: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border-strong p-7 font-mono text-[14px] uppercase tracking-[0.02em] text-muted">
      <span>{message}</span>
      {children}
    </div>
  );
}
