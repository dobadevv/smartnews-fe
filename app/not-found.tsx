import Link from 'next/link';
import { NOTICE_ACTION_CLASS, NoticeBox } from '@/components/NoticeBox';

export default function NotFound() {
  return (
    <section className="page-container py-[clamp(48px,8vw,96px)]">
      <NoticeBox message="Không tìm thấy bài viết">
        <Link href="/" className={NOTICE_ACTION_CLASS}>
          ← quay lại feed
        </Link>
      </NoticeBox>
    </section>
  );
}
