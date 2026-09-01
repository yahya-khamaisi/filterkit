export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-48 bg-slate-100" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3.5 w-4/5 rounded bg-slate-100" />
        <div className="h-3 w-2/5 rounded bg-slate-100" />
        <div className="mt-3 flex items-center justify-between">
          <div className="h-5 w-16 rounded bg-slate-100" />
          <div className="h-5 w-12 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  )
}
