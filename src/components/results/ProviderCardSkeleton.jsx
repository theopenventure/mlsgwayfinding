export default function ProviderCardSkeleton() {
  return (
    <div className="rounded-xl bg-white shadow-card overflow-hidden animate-pulse">
      <div className="p-4 flex gap-4">
        <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-3 bg-gray-200 rounded w-full mb-1.5" />
          <div className="h-3 bg-gray-200 rounded w-4/5 mb-3" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-24" />
            <div className="h-5 bg-gray-200 rounded-full w-28" />
            <div className="h-5 bg-gray-200 rounded-full w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
