export default function ArticleLoading() {
  return (
    <article aria-busy="true" className="article-container pt-[clamp(32px,6vw,64px)] pb-[clamp(64px,9vw,116px)]">
      <div aria-hidden="true">
        <div className="mb-[clamp(28px,5vw,48px)] h-3 w-[120px] rounded bg-skeleton-bar" />
        <div className="mb-5 h-3 w-2/5 rounded bg-skeleton-bar" />
        <div className="mb-3 h-8 w-[90%] rounded bg-skeleton-bar" />
        <div className="mb-5 h-8 w-3/5 rounded bg-skeleton-bar" />
        <div className="mb-[clamp(28px,5vw,40px)] h-4 w-3/4 rounded bg-skeleton-bar-soft" />
        <div className="mb-[clamp(32px,5vw,48px)] aspect-video rounded-card bg-skeleton-media" />
        <div className="flex flex-col gap-[22px]">
          <div className="h-[14px] w-full rounded bg-skeleton-bar-soft" />
          <div className="h-[14px] w-full rounded bg-skeleton-bar-soft" />
          <div className="h-[14px] w-full rounded bg-skeleton-bar-soft" />
        </div>
      </div>
    </article>
  );
}
