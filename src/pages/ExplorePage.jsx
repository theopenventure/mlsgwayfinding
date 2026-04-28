import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useFilterParams } from '@/hooks/useFilterParams'
import { useProviders } from '@/hooks/useProviders'
import { useDelayedUnmount } from '@/lib/useDelayedUnmount'
import { cn } from '@/lib/utils'
import { providers as allProvidersData } from '@/data/providers'
import StickyToolbar from '@/components/explore/StickyToolbar'
import FilterModal from '@/components/explore/FilterModal'
import InfoModal from '@/components/explore/InfoModal'
import UrgencyLane from '@/components/explore/UrgencyLane'
import ProviderCard from '@/components/results/ProviderCard'
import ProviderCardSkeleton from '@/components/results/ProviderCardSkeleton'
import MapView from '@/components/results/MapView'
import EmptyState from '@/components/ui/EmptyState'
import ProviderDetailDrawer from '@/components/explore/ProviderDetailDrawer'

export default function ExplorePage() {
  const {
    filters, setFilter, setMultipleFilters, toggleFilter, removeFilter, clearAll,
    hasActiveFilters, openProvider, closeProvider,
  } = useFilterParams()

  const {
    providers, allProviders, totalCount, visibleCount,
    hasMore, loadMore, isLoading, uniqueServices, openNowProviders, categoryCounts,
  } = useProviders(filters)

  const [hoveredId, setHoveredId] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [mapBounds, setMapBounds] = useState(null)
  const handleBoundsChange = useCallback((bounds) => setMapBounds(bounds), [])
  const [showAllProviders, setShowAllProviders] = useState(false)

  const activeFilterCount = [filters.age, filters.fee, filters.openNow, filters.postal].filter(Boolean).length
  const hasPostalFilter = !!(filters.postal && filters.lat && filters.lng)

  useEffect(() => {
    setShowAllProviders(false)
  }, [filters.postal])

  const selectedProvider = useMemo(() => {
    if (!filters.provider) return null
    return allProvidersData.find(p => p.slug === filters.provider) || null
  }, [filters.provider])

  // Drawer enter/exit lifecycle — keep last provider in view during exit
  const drawerOpen = !!selectedProvider
  const { shouldRender: drawerShouldRender, isExiting: drawerIsExiting } = useDelayedUnmount(drawerOpen, 240)
  const lastProviderRef = useRef(null)
  useEffect(() => {
    if (selectedProvider) lastProviderRef.current = selectedProvider
  }, [selectedProvider])
  const drawerProvider = selectedProvider || lastProviderRef.current

  // Mobile map overlay enter/exit
  const { shouldRender: mapOverlayShouldRender, isExiting: mapOverlayIsExiting } = useDelayedUnmount(showMap, 240)

  const relatedProviders = useMemo(() => {
    if (!selectedProvider) return []
    return allProvidersData
      .filter(p => p.id !== selectedProvider.id && p.category === selectedProvider.category)
      .slice(0, 3)
  }, [selectedProvider])

  const selectedId = selectedProvider?.id || null

  const top3Providers = useMemo(() => {
    if (!hasPostalFilter) return []
    return allProviders.slice(0, 3)
  }, [hasPostalFilter, allProviders])

  const mapProviders = useMemo(() => {
    if (hasPostalFilter && !showAllProviders) return top3Providers
    return allProviders
  }, [hasPostalFilter, showAllProviders, top3Providers, allProviders])

  const visibleProviders = useMemo(() => {
    if (hasPostalFilter && !showAllProviders) return []
    const list = hasPostalFilter ? providers.filter(p => !top3Providers.some(t => t.id === p.id)) : providers
    if (!mapBounds) return list
    return list.filter(p => mapBounds.contains([p.address.lat, p.address.lng]))
  }, [providers, mapBounds, hasPostalFilter, showAllProviders, top3Providers])

  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { rootMargin: '200px' },
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loadMore, visibleProviders.length])

  function handleCardClick(provider) {
    openProvider(provider.slug)
  }

  function handleMarkerClick(provider) {
    openProvider(provider.slug)
  }

  function handleServiceClickFromDrawer(serviceName) {
    closeProvider()
    setFilter('service', serviceName)
  }

  return (
    <div className="h-screen flex flex-col">
      <StickyToolbar
        filters={filters}
        toggleFilter={toggleFilter}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setShowFilters(true)}
        onOpenInfo={() => setShowInfo(true)}
      />

      <FilterModal
        open={showFilters}
        filters={filters}
        setFilter={setFilter}
        setMultipleFilters={setMultipleFilters}
        removeFilter={removeFilter}
        clearAll={clearAll}
        totalCount={totalCount}
        onClose={() => setShowFilters(false)}
      />

      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />

      <div className="flex-1 overflow-y-auto isolate">
        <div className="flex items-start gap-6 max-w-7xl mx-auto w-full">
          {/* List panel */}
          <div className="flex-1 md:w-[58%] md:flex-none pt-8 pb-8 pl-4 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }, (_, i) => <ProviderCardSkeleton key={i} />)}
              </div>
            ) : totalCount === 0 ? (
              <EmptyState
                title="No services found"
                message="No services match your current filters. Try adjusting your criteria or show all services."
                actionLabel="Clear all filters"
                onAction={clearAll}
              />
            ) : (
              <>
                {hasPostalFilter && top3Providers.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-4">
                      {top3Providers.map((provider, i) => (
                        <ProviderCard
                          key={provider.id}
                          index={i}
                          provider={provider}
                          onHover={setHoveredId}
                          onClick={handleCardClick}
                          selected={provider.slug === filters.provider}
                        />
                      ))}
                    </div>

                    {!showAllProviders && allProviders.length > 3 && (
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => setShowAllProviders(true)}
                          className="inline-flex items-center gap-[11px] px-4 py-1 rounded-full border border-dashed border-black/30 text-[15px] font-normal tracking-[-0.3px] text-[#02005E] hover:bg-[#F1F1F5] cursor-pointer motion-hover motion-press motion-focus"
                        >
                          Load more resources
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <path d="M3.2 13.2C3.2 17.5 6.7 21 11 21C13.8 21 16.2 19.5 17.6 17.2M20.8 10.8C20.8 6.5 17.3 3 13 3C10.2 3 7.8 4.5 6.4 6.8M6.4 6.8V3M6.4 6.8H10.2M17.6 17.2V21M17.6 17.2H13.8" stroke="#3858E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {visibleProviders.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visibleProviders.map((provider, i) => (
                      <ProviderCard
                        key={provider.id}
                        index={i}
                        provider={provider}
                        onHover={setHoveredId}
                        onClick={handleCardClick}
                        selected={provider.slug === filters.provider}
                      />
                    ))}
                  </div>
                )}

                {hasMore && <div ref={sentinelRef} className="h-10" />}
              </>
            )}
          </div>

          {/* Right panel: Map (always mounted) with Drawer overlay (desktop) */}
          <div className="hidden md:block md:w-[42%] py-8 pr-4 sticky top-0 self-start h-[calc(100vh-63px)]">
            <div className="relative h-full bg-white rounded-xl">
              {/* Map stays mounted but hidden during entry/idle-open so the drawer
                  doesn't have the map peeking through behind the slide. Reappears
                  during the drawer's exit so the drawer fades out into the map. */}
              <div className={cn('h-full', drawerShouldRender && !drawerIsExiting && 'invisible')}>
                <MapView
                  providers={mapProviders}
                  highlightedId={hoveredId}
                  selectedId={selectedId}
                  onMarkerClick={handleMarkerClick}
                  onBoundsChange={handleBoundsChange}
                  proximityCenter={hasPostalFilter ? { lat: filters.lat, lng: filters.lng } : null}
                  showAll={showAllProviders || !hasPostalFilter}
                />
              </div>
              {drawerShouldRender && drawerProvider && (
                <div className="absolute inset-0 z-[1100]">
                  <ProviderDetailDrawer
                    provider={drawerProvider}
                    onClose={closeProvider}
                    onServiceClick={handleServiceClickFromDrawer}
                    onRelatedClick={handleCardClick}
                    relatedProviders={relatedProviders}
                    isExiting={drawerIsExiting}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Map FAB */}
      {!drawerShouldRender && (
        <button
          onClick={() => setShowMap(true)}
          className="md:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white font-normal shadow-float hover:bg-primary-dark cursor-pointer motion-hover motion-press motion-focus"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
          </svg>
          Map
        </button>
      )}

      {/* Mobile: Map overlay */}
      {mapOverlayShouldRender && (
        <div
          data-motion-transform
          className={cn(
            'md:hidden fixed inset-0 z-50 bg-white',
            mapOverlayIsExiting ? 'animate-sheet-down-out' : 'animate-sheet-up-in',
          )}
        >
          <div className="absolute top-4 right-4 z-[1001]">
            <button
              onClick={() => setShowMap(false)}
              className="w-10 h-10 rounded-full bg-white shadow-float flex items-center justify-center cursor-pointer motion-press motion-focus"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
          <MapView
            providers={mapProviders}
            highlightedId={hoveredId}
            selectedId={selectedId}
            onMarkerClick={(provider) => { setShowMap(false); handleMarkerClick(provider) }}
            proximityCenter={hasPostalFilter ? { lat: filters.lat, lng: filters.lng } : null}
            showAll={showAllProviders || !hasPostalFilter}
          />
        </div>
      )}

      {/* Mobile: Drawer bottom sheet */}
      {drawerShouldRender && drawerProvider && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className={cn(
              'absolute inset-0 bg-black/30',
              drawerIsExiting ? 'animate-fade-out' : 'animate-fade-in',
            )}
            onClick={closeProvider}
          />
          <ProviderDetailDrawer
            provider={drawerProvider}
            onClose={closeProvider}
            onServiceClick={handleServiceClickFromDrawer}
            onRelatedClick={handleCardClick}
            relatedProviders={relatedProviders}
            mobile
            isExiting={drawerIsExiting}
          />
        </div>
      )}
    </div>
  )
}
