'use client';

import { useEffect } from 'react';
import { NOTICE_ACTION_CLASS, NoticeBox } from '@/components/NoticeBox';

type RouteErrorProps = { error: Error & { digest?: string }; retry: () => void };

export default function RouteError({ error, retry }: RouteErrorProps) {
  useEffect(() => {
    console.error('[smartnews] route render failed', error);
  }, [error]);

  return (
    <section className="page-container py-[clamp(48px,8vw,96px)]">
      <NoticeBox message="Không tải được dữ liệu">
        <button type="button" onClick={() => retry()} className={NOTICE_ACTION_CLASS}>
          Thử lại
        </button>
      </NoticeBox>
    </section>
  );
}
