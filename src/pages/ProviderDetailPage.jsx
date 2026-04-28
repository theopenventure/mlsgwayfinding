import { useParams, Link, useNavigate } from 'react-router'
import { useMemo } from 'react'
import { providers } from '@/data/providers'
import Badge from '@/components/ui/Badge'
import CTACluster from '@/components/provider/CTACluster'
import InfoBlock from '@/components/provider/InfoBlock'
import ServiceTag from '@/components/provider/ServiceTag'
import MapView from '@/components/results/MapView'
import ProviderCard from '@/components/results/ProviderCard'
import EmptyState from '@/components/ui/EmptyState'
import { getCategoryLabel, cn } from '@/lib/utils'

export default function ProviderDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const provider = providers.find(p => p.slug === slug)

  const relatedProviders = useMemo(() => {
    if (!provider) return []
    return providers
      .filter(p => p.id !== provider.id && (p.category === provider.category || p.address.postalCode.slice(0, 2) === provider.address.postalCode.slice(0, 2)))
      .slice(0, 6)
  }, [provider])

  if (!provider) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <EmptyState
          title="Provider not found"
          message="The service you're looking for doesn't exist or may have been removed."
          actionLabel="Browse all services"
          onAction={() => navigate('/services/results')}
        />
      </div>
    )
  }

  const initial = provider.name.charAt(0).toUpperCase()

  const infoItems = [
    { label: 'Age group', value: provider.ageGroups.map(a => a === '25+' ? 'Over 25' : a === '18-25' ? '18\u201325' : '12\u201317').join(', ') },
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

  return (
    <div className="min-h-screen bg-warm-bg pb-24 md:pb-12">
      {/* Hero */}
      <div className="bg-primary-soft">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors mb-6 cursor-pointer"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            Back to results
          </button>

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className={cn(
                'w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl md:text-4xl font-bold text-white',
                provider.category === 'enquiry-support' ? 'bg-cat-enquiry' :
                provider.category === 'therapy-counselling' ? 'bg-cat-therapy' :
                'bg-cat-medical',
              )}
            >
              {initial}
            </div>

            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant={provider.category}>
                  {getCategoryLabel(provider.category)}
                </Badge>
                <Badge variant={provider.operatingHours.isOpenNow ? 'open' : 'closed'} dot>
                  {provider.operatingHours.isOpenNow ? 'Open now' : 'Closed'}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-1">{provider.name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* CTA Cluster */}
        <section>
          <CTACluster contact={provider.contact} address={provider.address} />
        </section>

        {/* About */}
        <section>
          <h2 className="text-lg font-semibold text-heading mb-3">About</h2>
          <p className="text-sm text-muted leading-relaxed">{provider.description}</p>
        </section>

        {/* Services offered */}
        {provider.services.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-heading mb-3">Services offered</h2>
            <div className="flex flex-wrap gap-2">
              {provider.services.map(service => (
                <ServiceTag key={service}>{service}</ServiceTag>
              ))}
            </div>
          </section>
        )}

        {/* Key information */}
        <section>
          <h2 className="text-lg font-semibold text-heading mb-3">Key information</h2>
          <div className="bg-white rounded-xl p-5 shadow-card">
            <InfoBlock items={infoItems} />
          </div>
        </section>

        {/* Location */}
        <section>
          <h2 className="text-lg font-semibold text-heading mb-3">Location</h2>
          <div className="bg-white rounded-xl p-5 shadow-card space-y-3">
            <p className="text-sm text-heading font-medium">{provider.address.full}</p>
            <div className="h-64 rounded-xl overflow-hidden">
              <MapView
                providers={[provider]}
                singlePin
              />
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(provider.address.full)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Get directions
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.25-.22v-1.33a.75.75 0 0 1 1.28-.53l3.25 3.25a.75.75 0 0 1-.53 1.28h-1.33l-2.19 2.19a.75.75 0 1 1-1.06-1.06l2.19-2.19V5.28Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </section>

        {/* Related services */}
        {relatedProviders.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-heading mb-3">Other services nearby</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4">
              {relatedProviders.map(rp => (
                <div key={rp.id} className="min-w-[300px] snap-start flex-shrink-0">
                  <ProviderCard provider={rp} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stroke p-3 shadow-float">
        <CTACluster contact={provider.contact} address={provider.address} />
      </div>
    </div>
  )
}
