import { FeedIntro } from '@/components/FeedIntro';
import { SkeletonCard } from '@/components/SkeletonCard';
import { PAGE_SIZE } from '@/lib/constants';

export default function FeedLoading() {
  return (
    <section aria-busy="true" className="page-container pt-[clamp(48px,8vw,96px)] pb-[clamp(64px,9vw,116px)]">
      <FeedIntro />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  );
}
