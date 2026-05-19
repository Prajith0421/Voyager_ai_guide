export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-zinc-800/60 ${className}`} />
}

export function MapSkeleton() {
  return <Skeleton className="h-full min-h-[400px] w-full" />
}

export function WeatherSkeleton() {
  return (
    <div className="panel p-5 space-y-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-4 w-full max-w-[200px]" />
    </div>
  )
}
