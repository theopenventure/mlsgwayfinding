import Badge from '@/components/ui/Badge'
import CTACluster from '@/components/provider/CTACluster'
import InfoBlock from '@/components/provider/InfoBlock'
import ServiceTag from '@/components/provider/ServiceTag'
import ProviderCard from '@/components/results/ProviderCard'
import { cn, getCategoryLabel } from '@/lib/utils'

export default function ProviderDetailDrawer({ provider, onClose, onServiceClick, onRelatedClick, relatedProviders = [], mobile = false, isExiting = false }) {
  const initial = provider.name.charAt(0).toUpperCase()

  const infoItems = [
    { label: 'Age group', value: provider.ageGroups.join(', ') },
    { label: 'Fees', value: provider.fees },
    {
      label: 'Opening hours',
      value: (
        <div className="space-y-1">
          <div><span className="text-muted">Weekdays:</span> {provider.operatingHours.weekday}</div>
          <div><span className="text-muted">Saturday:</span> {provider.operatingHours.saturday}</div>
          <div><span className="text-muted">Sunday:</span> {provider.operatingHours.sunday}</div>
        </div>
      ),
    },
  ]

  const badges = (
    <div className="flex items-center gap-2">
      <Badge variant={provider.category}>{getCategoryLabel(provider.category)}</Badge>
      <Badge variant={provider.operatingHours.isOpenNow ? 'open' : 'closed'} dot>
        {provider.operatingHours.isOpenNow ? 'Open now' : 'Closed'}
      </Badge>
    </div>
  )

  const closeBtn = (
    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer motion-hover motion-press motion-focus">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-muted">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
      </svg>
    </button>
  )

  const content = (
    <>
      {/* Hero */}
      <div>
        <h2 className="text-lg font-normal text-primary">{provider.name}</h2>
      </div>

      {/* CTA */}
      <CTACluster contact={provider.contact} address={provider.address} />

      {/* About */}
      <section>
        <h3 className="text-sm font-normal text-heading mb-2">About</h3>
        <p className="text-sm text-muted leading-relaxed">{provider.description}</p>
      </section>

      {/* Services */}
      {provider.services.length > 0 && (
        <section>
          <h3 className="text-sm font-normal text-heading mb-2">Services offered</h3>
          <div className="flex flex-wrap gap-2">
            {provider.services.map(service => (
              <ServiceTag key={service}>{service}</ServiceTag>
            ))}
          </div>
        </section>
      )}

      {/* Key Information */}
      <section>
        <h3 className="text-sm font-normal text-heading mb-2">Key information</h3>
        <div className="bg-white border border-stroke rounded-xl p-4">
          <InfoBlock items={infoItems} />
        </div>
      </section>

      {/* Related */}
      {relatedProviders.length > 0 && (
        <section>
          <h3 className="text-sm font-normal text-heading mb-2">Similar services</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {relatedProviders.map(rp => (
              <ProviderCard key={rp.id} provider={rp} compact onClick={onRelatedClick} />
            ))}
          </div>
        </section>
      )}
    </>
  )

  if (mobile) {
    return (
      <div
        data-motion-transform
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto',
          isExiting ? 'animate-sheet-down-out' : 'animate-sheet-up-in',
        )}
      >
        <div className="sticky top-0 bg-white rounded-t-2xl z-10 pt-3 pb-2 px-4">
          <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-3" />
          <div className="flex items-center justify-between">
            {badges}
            {closeBtn}
          </div>
        </div>
        <div className="px-4 pb-6 space-y-6">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div
      data-motion-transform
      className={cn(
        'h-full overflow-y-auto rounded-xl bg-white border border-stroke',
        isExiting ? 'animate-drawer-right-out' : 'animate-drawer-right-in',
      )}
    >
      <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-stroke rounded-t-xl flex items-center justify-between">
        {badges}
        {closeBtn}
      </div>
      <div className="px-5 py-5 space-y-6">
        {content}
      </div>
    </div>
  )
}
