export function ProductSkeleton() {
  return (
    <div className="glass-card overflow-hidden rounded-lg">
      <div className="aspect-[4/3] animate-pulse bg-white/10" />
      <div className="space-y-4 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
        <div className="h-5 w-full animate-pulse rounded bg-white/10" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-11 w-full animate-pulse rounded-lg bg-white/10" />
      </div>
    </div>
  )
}
