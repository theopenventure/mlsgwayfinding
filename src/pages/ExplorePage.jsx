import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useFilterParams } from '@/hooks/useFilterParams'
import { useProviders } from '@/hooks/useProviders'
import { useDelayedUnmount } from '@/lib/useDelayedUnmount'
import { cn } from '@/lib/utils'
import { providers as allProvidersData } from '@/data/providers'
import StickyToolbar from '@/components/explore/StickyToolbar'
import FilterModal from '@/components/explore/FilterModal'
import InfoModal from '@/components/explore/InfoModal'
import MapCarousel from '@/components/explore/MapCarousel'
import ProviderCard from '@/components/results/ProviderCard'
import ProviderCardSkeleton from '@/components/results/ProviderCardSkeleton'
import MapView from '@/components/results/MapView'
import EmptyState from '@/components/ui/EmptyState'
import ProviderDetailDrawer from '@/components/explore/ProviderDetailDrawer'

export default function ExplorePage() {
  const {
    filters, setFilter, setMultipleFilters, toggleFilter, removeFilter, clearAll,
    openProvider, closeProvider,
  } = useFilterParams()

  const {
    providers, allProviders, totalCount,
    hasMore, loadMore, isLoading,
  } = useProviders(filters)

  const [hoveredId, setHoveredId] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [mapBounds, setMapBounds] = useState(null)
  const handleBoundsChange = useCallback((bounds) => setMapBounds(bounds), [])
  const [showAllProviders, setShowAllProviders] = useState(false)
  const [mobileActiveId, setMobileActiveId] = useState(null)

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

  // Mobile carousel: every provider that's in the current map bounds (no
  // top-3 pinning, no postal segregation — the map itself is the filter).
  const mobileCarouselProviders = useMemo(() => {
    const source = hasPostalFilter && !showAllProviders ? top3Providers : providers
    if (!mapBounds) return source
    return source.filter(p => mapBounds.contains([p.address.lat, p.address.lng]))
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

  // Mobile: tapping a pin scrolls the carousel instead of opening the drawer.
  function handleMobileMarkerClick(provider) {
    setMobileActiveId(provider.id)
  }

  function handleServiceClickFromDrawer(serviceName) {
    closeProvider()
    setFilter('service', serviceName)
  }

  // Reset the carousel-active highlight when the visible set changes (e.g.
  // user pans far enough that the previously-active card is out of bounds).
  useEffect(() => {
    if (mobileActiveId == null) return
    if (!mobileCarouselProviders.some(p => p.id === mobileActiveId)) {
      setMobileActiveId(null)
    }
  }, [mobileCarouselProviders, mobileActiveId])

  const listContent = (
    <ListBody
      isLoading={isLoading}
      totalCount={totalCount}
      hasPostalFilter={hasPostalFilter}
      top3Providers={top3Providers}
      visibleProviders={visibleProviders}
      showAllProviders={showAllProviders}
      setShowAllProviders={setShowAllProviders}
      allProviders={allProviders}
      filters={filters}
      onCardClick={handleCardClick}
      onHover={setHoveredId}
      hasMore={hasMore}
      sentinelRef={sentinelRef}
      clearAll={clearAll}
    />
  )

  return (
    <>
      {/* ============ Desktop layout ============ */}
      <div className="hidden md:flex h-[100dvh] flex-col">
        <StickyToolbar
          filters={filters}
          toggleFilter={toggleFilter}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setShowFilters(true)}
          onOpenInfo={() => setShowInfo(true)}
        />

        <div className="flex-1 overflow-y-auto isolate">
          <div className="flex items-start gap-6 max-w-7xl mx-auto w-full">
            {/* List panel */}
            <div className="flex-1 md:w-[58%] md:flex-none pt-8 pb-8 pl-4 min-w-0">
              {listContent}
            </div>

            {/* Right panel: Map (always mounted) with Drawer overlay */}
            <div className="md:block md:w-[42%] py-8 pr-4 sticky top-0 self-start h-[calc(100vh-63px)]">
              <div className="relative h-full bg-white rounded-xl">
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
      </div>

      {/* ============ Mobile layout (map-first, cards over map) ============ */}
      <div className="md:hidden relative h-[100dvh] overflow-hidden">
        {/* Map fills the viewport */}
        <div className="absolute inset-0 z-0">
          <MapView
            providers={mapProviders}
            highlightedId={mobileActiveId}
            selectedId={selectedId}
            onMarkerClick={handleMobileMarkerClick}
            onBoundsChange={handleBoundsChange}
            proximityCenter={hasPostalFilter ? { lat: filters.lat, lng: filters.lng } : null}
            showAll={showAllProviders || !hasPostalFilter}
          />
        </div>

        {/* Floating filter pills — straight over the map, horizontally scrollable */}
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <StickyToolbar
              filters={filters}
              toggleFilter={toggleFilter}
              activeFilterCount={activeFilterCount}
              onOpenFilters={() => setShowFilters(true)}
              onOpenInfo={() => setShowInfo(true)}
              floating
            />
          </div>
        </div>

        {/* Card carousel — bottom of the map */}
        {!drawerShouldRender && (
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <MapCarousel
                providers={mobileCarouselProviders}
                activeId={mobileActiveId}
                onActiveChange={setMobileActiveId}
                onCardClick={handleCardClick}
              />
            </div>
          </div>
        )}

        {/* Provider detail drawer */}
        {drawerShouldRender && drawerProvider && (
          <div className="absolute inset-0 z-40">
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

      {/* Modals (shared across breakpoints) */}
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
    </>
  )
}

function ListBody({
  isLoading, totalCount, hasPostalFilter, top3Providers, visibleProviders,
  showAllProviders, setShowAllProviders, allProviders, filters,
  onCardClick, onHover, hasMore, sentinelRef, clearAll,
}) {
  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => <ProviderCardSkeleton key={i} />)}
      </div>
    )
  }

  if (totalCount === 0) {
    return (
      <EmptyState
        title="No services found"
        message="No services match your current filters. Try adjusting your criteria or show all services."
        actionLabel="Clear all filters"
        onAction={clearAll}
      />
    )
  }

  return (
    <>
      {hasPostalFilter && top3Providers.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4">
            {top3Providers.map((provider, i) => (
              <ProviderCard
                key={provider.id}
                index={i}
                provider={provider}
                onHover={onHover}
                onClick={onCardClick}
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {visibleProviders.map((provider, i) => (
            <ProviderCard
              key={provider.id}
              index={i}
              provider={provider}
              onHover={onHover}
              onClick={onCardClick}
              selected={provider.slug === filters.provider}
            />
          ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-10" />}
    </>
  )
}
