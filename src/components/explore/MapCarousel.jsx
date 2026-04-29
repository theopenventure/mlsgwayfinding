import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import ProviderCard from '@/components/results/ProviderCard'

// Horizontal map-overlay carousel. Cards snap to center; the closest card to
// the viewport's horizontal center is reported as "active" so the parent can
// highlight the matching pin.
export default function MapCarousel({ providers, activeId, onActiveChange, onCardClick }) {
  const scrollRef = useRef(null)
  const cardRefs = useRef(new Map())
  const programmaticScrollRef = useRef(false)
  const lastReportedRef = useRef(null)

  // Scroll the active card into view when activeId changes from the outside
  // (e.g. user tapped a pin). Suppress the scroll handler's reporting so the
  // smooth-scroll doesn't fight itself.
  useEffect(() => {
    if (activeId == null) return
    const el = cardRefs.current.get(activeId)
    if (!el) return
    if (lastReportedRef.current === activeId) return
    programmaticScrollRef.current = true
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    const t = setTimeout(() => { programmaticScrollRef.current = false }, 400)
    return () => clearTimeout(t)
  }, [activeId])

  function handleScroll() {
    if (programmaticScrollRef.current) return
    const container = scrollRef.current
    if (!container) return
    const containerCenter = container.scrollLeft + container.clientWidth / 2
    let closestId = null
    let closestDist = Infinity
    cardRefs.current.forEach((el, id) => {
      if (!el) return
      const cardCenter = el.offsetLeft + el.offsetWidth / 2
      const dist = Math.abs(cardCenter - containerCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestId = id
      }
    })
    if (closestId != null && closestId !== lastReportedRef.current) {
      lastReportedRef.current = closestId
      onActiveChange(closestId)
    }
  }

  if (providers.length === 0) return null

  const isSingle = providers.length === 1

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
      style={{ scrollPaddingInline: '12px' }}
    >
      <div className="flex-shrink-0 w-3" aria-hidden />
      {providers.map((provider, i) => (
        <div
          key={provider.id}
          ref={el => {
            if (el) cardRefs.current.set(provider.id, el)
            else cardRefs.current.delete(provider.id)
          }}
          className={cn(
            'flex-shrink-0 snap-center',
            isSingle ? 'w-[calc(100vw-24px)]' : 'w-[82vw] max-w-[340px]',
          )}
        >
          <ProviderCard
            index={i}
            provider={provider}
            onClick={onCardClick}
            selected={provider.id === activeId}
          />
        </div>
      ))}
      <div className="flex-shrink-0 w-3" aria-hidden />
    </div>
  )
}
