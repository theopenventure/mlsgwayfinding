import { useState } from 'react'
import { Link } from 'react-router'
import { useFilterParams } from '@/hooks/useFilterParams'
import { useProviders } from '@/hooks/useProviders'
import FilterBar from '@/components/results/FilterBar'
import ProviderCard from '@/components/results/ProviderCard'
import ProviderCardSkeleton from '@/components/results/ProviderCardSkeleton'
import MapView from '@/components/results/MapView'
import EmptyState from '@/components/ui/EmptyState'
import { getCategoryLabel } from '@/lib/utils'

export default function ResultsPage() {
  const { filters, setFilter, setMultipleFilters, removeFilter, clearAll, hasActiveFilters } = useFilterParams()
  const { providers, allProviders, totalCount, visibleCount, loadMore, hasMore, isLoading } = useProviders(filters)
  const [highlightedId, setHighlightedId] = useState(null)
  const [showMobileMap, setShowMobileMap] = useState(false)

  // Build dynamic title
  const typeLabel = filters.type ? getCategoryLabel(filters.type) : 'Mental Health Services'
  const locationLabel = filters.location ? `near ${filters.location}` : ''
  const title = `${typeLabel} ${locationLabel}`.trim()

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Header */}
      <div className="bg-white border-b border-stroke">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Link
              to={`/services`}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              Change preferences
            </Link>
          </div>

          <h1 className="text-xl md:text-2xl font-semibold text-heading mb-1">{title}</h1>
          {!isLoading && (
            <p className="text-sm text-muted">
              Showing {visibleCount} of {totalCount} service{totalCount !== 1 ? 's' : ''}
              {filters.location ? ` near ${filters.location}` : ''}
            </p>
          )}

          <div className="mt-4">
            <FilterBar
              filters={filters}
              setFilter={setFilter}
              removeFilter={removeFilter}
              clearAll={clearAll}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* List panel */}
          <div className="flex-1 lg:w-[55%] lg:flex-none p-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 6 }, (_, i) => (
                <ProviderCardSkeleton key={i} />
              ))
            ) : providers.length === 0 ? (
              <EmptyState
                title="No services found"
                message="No services match your current filters. Try adjusting your criteria or show all services."
                actionLabel="Show all services"
                onAction={clearAll}
              />
            ) : (
              <>
                {providers.map(provider => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onHover={setHighlightedId}
                  />
                ))}

                {hasMore && (
                  <div className="text-center py-4">
                    <button
                      onClick={loadMore}
                      className="px-6 py-2.5 rounded-lg bg-white border border-stroke text-sm font-medium text-heading hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-card"
                    >
                      Show more
                    </button>
                    <p className="text-xs text-muted mt-2">
                      Showing {visibleCount} of {totalCount} results
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Map panel - desktop */}
          <div className="hidden lg:block lg:w-[45%] sticky top-0 h-screen p-4 pl-0">
            <MapView
              providers={allProviders}
              highlightedId={highlightedId}
              onMarkerClick={(id) => {
                const el = document.getElementById(`provider-${id}`)
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile map FAB */}
      <button
        onClick={() => setShowMobileMap(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white font-medium shadow-float hover:bg-primary-dark transition-colors cursor-pointer"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M8.157 2.175a1.5 1.5 0 0 0-1.147 0l-4.084 1.69A1.5 1.5 0 0 0 2 5.251v10.877a1.5 1.5 0 0 0 2.074 1.386l3.51-1.453 4.26 1.763a1.5 1.5 0 0 0 1.146 0l4.083-1.69A1.5 1.5 0 0 0 18 14.748V3.873a1.5 1.5 0 0 0-2.073-1.386l-3.51 1.452-4.26-1.763ZM7.58 5a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 7.58 5Zm5.59 2.75a.75.75 0 0 0-1.5 0v6.5a.75.75 0 0 0 1.5 0v-6.5Z" clipRule="evenodd" />
        </svg>
        Map
      </button>

      {/* Mobile map overlay */}
      {showMobileMap && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="absolute top-4 right-4 z-[1001]">
            <button
              onClick={() => setShowMobileMap(false)}
              className="w-10 h-10 rounded-full bg-white shadow-float flex items-center justify-center cursor-pointer"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
          <MapView
            providers={allProviders}
            highlightedId={highlightedId}
          />
        </div>
      )}
    </div>
  )
}
