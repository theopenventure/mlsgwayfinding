import ProviderCard from '@/components/results/ProviderCard'

export default function UrgencyLane({ providers, onSelect }) {
  if (providers.length === 0) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-2 h-2 rounded-full bg-status-open animate-pulse" />
        <h2 className="text-sm font-semibold text-heading">Available now</h2>
        <span className="text-xs text-muted">{providers.length} service{providers.length !== 1 ? 's' : ''} open</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {providers.slice(0, 8).map(p => (
          <ProviderCard key={p.id} provider={p} compact onClick={onSelect} />
        ))}
      </div>
    </div>
  )
}
