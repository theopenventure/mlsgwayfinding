import Badge from '@/components/ui/Badge'
import { cn, formatDistance, getCategoryLabel } from '@/lib/utils'

export default function ProviderCard({ provider, onHover, onClick, selected, compact = false }) {
  const addressLine = provider.address.full.split(',')[0].trim()

  if (compact) {
    return (
      <button
        onClick={() => onClick?.(provider)}
        className="flex-shrink-0 w-[240px] rounded-xl bg-white border border-stroke hover:border-stroke transition-all duration-200 overflow-hidden text-left cursor-pointer"
      >
        <div className="p-3">
          <h3 className="text-sm font-normal text-primary truncate">{provider.name}</h3>
          <p className="text-xs text-muted truncate mt-0.5">{addressLine}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={provider.category} small>
              {getCategoryLabel(provider.category)}
            </Badge>
            <Badge variant={provider.operatingHours.isOpenNow ? 'open' : 'closed'} dot small>
              {provider.operatingHours.isOpenNow ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick?.(provider)}
      onMouseEnter={() => onHover?.(provider.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        'block w-full text-left rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer',
        selected ? 'bg-[#F1F1F5] border-transparent hover:border-transparent' : 'bg-white border-stroke hover:border-stroke',
      )}
    >
      <div className="p-4">
        <div className="mb-1.5">
          <h3 className="text-base font-normal text-primary">{provider.name}</h3>
          <p className="text-xs text-muted mt-0.5">{addressLine}</p>
        </div>

        <p className="text-sm text-heading line-clamp-2 mb-3 leading-relaxed">
          {provider.shortDescription}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
          {provider.distance != null && (
            <span className="inline-flex items-center gap-1">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#3858E9]">
                <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
              </svg>
              {formatDistance(provider.distance)}
            </span>
          )}

          <Badge variant={provider.category}>
            {getCategoryLabel(provider.category)}
          </Badge>
        </div>
      </div>
    </button>
  )
}
