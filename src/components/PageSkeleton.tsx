export default function PageSkeleton() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-4 w-24 rounded bg-brand-subtle mb-4" />
      <div className="h-8 w-64 rounded bg-brand-subtle mb-3" />
      <div className="h-4 w-96 rounded bg-brand-subtle mb-10" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-brand-subtle" />
        ))}
      </div>
    </div>
  )
}
