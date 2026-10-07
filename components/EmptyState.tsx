'use client';

import { NOTICE_ACTION_CLASS, NoticeBox } from '@/components/NoticeBox';
import { useFeedNavigation } from '@/hooks/useFeedNavigation';

export function EmptyState() {
  const { resetFilters } = useFeedNavigation();
  return (
    <NoticeBox message="Không có bài viết phù hợp">
      <button type="button" onClick={resetFilters} className={NOTICE_ACTION_CLASS}>
        Đặt về mặc định
      </button>
    </NoticeBox>
  );
}
