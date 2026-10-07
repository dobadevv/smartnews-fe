export function SkeletonCard() {
  return (
    <div data-testid="skeleton-card" aria-hidden="true" className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="aspect-video bg-skeleton-media" />
      <div className="flex flex-col gap-3 p-6">
        <div className="h-3 w-2/5 rounded bg-skeleton-bar" />
        <div className="h-5 w-[90%] rounded bg-skeleton-bar" />
        <div className="h-[14px] w-3/4 rounded bg-skeleton-bar-soft" />
      </div>
    </div>
  );
}
