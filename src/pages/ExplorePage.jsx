import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useFilterParams } from '@/hooks/useFilterParams'
import { useProviders } from '@/hooks/useProviders'
import { useDelayedUnmount } from '@/lib/useDelayedUnmount'
import { cn } from '@/lib/utils'
import { providers as allProvidersData } from '@/data/providers'
import StickyToolbar from '@/components/explore/StickyToolbar'
import FilterModal from '@/components/explore/FilterModal'
import InfoModal from '@/components/explore/InfoModal'
import ProviderCard from '@/components/results/ProviderCard'
import ProviderCardSkeleton from '@/components/results/ProviderCardSkeleton'
import MapView from '@/components/results/MapView'
import EmptyState from '@/components/ui/EmptyState'
import BottomSheet from '@/components/ui/BottomSheet'
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
  const [sheetExpanded, setSheetExpanded] = useState(false)

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

  const sentinelRef = useRef(null)
  const mobileSentinelRef = useRef(null)

  useEffect(() => {
    const target = sentinelRef.current || mobileSentinelRef.current
    if (!target || !hasMore) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { rootMargin: '200px' },
    )
    observer.observe(target)
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

  // Auto-collapse the list sheet when a provider is opened so the detail
  // drawer slides up unobstructed.
  useEffect(() => {
    if (drawerOpen) setSheetExpanded(false)
  }, [drawerOpen])

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

  const mobileListContent = (
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
      sentinelRef={mobileSentinelRef}
      clearAll={clearAll}
      mobile
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

      {/* ============ Mobile layout (map-first, Google-Maps style) ============ */}
      <div className="md:hidden relative h-[100dvh] overflow-hidden bg-white">
        {/* Map fills the viewport behind everything */}
        <div className="absolute inset-0 z-0">
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

        {/* Floating filter toolbar */}
        <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-3 pointer-events-none">
          <div className="pointer-events-auto rounded-2xl bg-white/95 backdrop-blur shadow-float">
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

        {/* List bottom sheet — always mounted; detail drawer stacks on top */}
        <BottomSheet
          expanded={sheetExpanded}
          onExpandedChange={setSheetExpanded}
          className="z-20"
        >
          {mobileListContent}
        </BottomSheet>

        {/* Provider detail sheet — stacks above the list sheet */}
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
  onCardClick, onHover, hasMore, sentinelRef, clearAll, mobile = false,
}) {
  if (isLoading) {
    return (
      <div className={cn('grid gap-6 px-4 pb-6', mobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2')}>
        {Array.from({ length: mobile ? 3 : 6 }, (_, i) => <ProviderCardSkeleton key={i} />)}
      </div>
    )
  }

  if (totalCount === 0) {
    return (
      <div className="px-4 pb-6">
        <EmptyState
          title="No services found"
          message="No services match your current filters. Try adjusting your criteria or show all services."
          actionLabel="Clear all filters"
          onAction={clearAll}
        />
      </div>
    )
  }

  return (
    <div className={cn('px-4 pb-6', mobile && 'pb-10')}>
      {mobile && (
        <div className="pb-3">
          <p className="text-sm text-muted">
            {totalCount} {totalCount === 1 ? 'service' : 'services'}
          </p>
        </div>
      )}

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
        <div className={cn('grid gap-6', mobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2')}>
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
    </div>
  )
}
