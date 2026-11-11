export function SkeletonCard({ lines = 3, hasTitle = true }) {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      {hasTitle && <div className="skeleton h-4 w-24 rounded-full" />}
      <div className="skeleton h-8 w-3/4 rounded-xl" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded-lg"
          style={{ width: `${85 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 3 }) {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="skeleton h-4 w-32 rounded-full" />
      <div className="skeleton h-7 w-48 rounded-xl" />
      <div className="space-y-3 mt-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
