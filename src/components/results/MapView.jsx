import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import { getCategoryLabel } from '@/lib/utils'

function createMarkerIcon({ isSelected = false, dropDelayMs = 0, dropOnMount = false } = {}) {
  const width = isSelected ? 32 : 26
  const height = isSelected ? 46 : 38
  const haloLayer = isSelected
    ? `<span aria-hidden="true" style="
        position: absolute; left: 50%; bottom: 4px;
        width: 18px; height: 18px;
        margin-left: -9px;
        border-radius: 50%;
        background: rgba(56, 88, 233, 0.45);
        animation: pin-halo 1800ms ease-out infinite;
        pointer-events: none;
      "></span>`
    : ''
  const dropClass = dropOnMount ? 'pin-drop-anim' : ''
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="${dropClass}" style="
      position: relative;
      width: ${width}px; height: ${height}px;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));
      transition: transform 200ms ease;
      ${isSelected ? 'transform: scale(1.05);' : ''}
      animation-delay: ${dropDelayMs}ms;
    ">
      ${haloLayer}
      <svg width="${width}" height="${height}" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" style="position: relative; z-index: 1;">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="#3858E9" stroke="#FFFFFF" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
      </svg>
    </div>`,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 6],
  })
}

function FitBounds({ providers, proximityCenter, showAll }) {
  const map = useMap()
  const boundsKey = providers.map(p => p.id).join(',') + `|${proximityCenter?.lat},${proximityCenter?.lng}|${showAll}`
  useEffect(() => {
    if (providers.length === 0) return
    const points = providers.map(p => [p.address.lat, p.address.lng])
    if (proximityCenter && !showAll) {
      points.push([proximityCenter.lat, proximityCenter.lng])
    }
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [boundsKey]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

function ResizeHandler() {
  const map = useMap()
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])
  return null
}

function BoundsReporter({ onBoundsChange }) {
  const map = useMap()
  useEffect(() => {
    if (!onBoundsChange) return
    const handler = () => {
      const container = map.getContainer()
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        onBoundsChange(null)
        return
      }
      onBoundsChange(map.getBounds())
    }
    handler()
    map.on('moveend', handler)
    return () => map.off('moveend', handler)
  }, [map, onBoundsChange])
  return null
}

export default function MapView({ providers, highlightedId, selectedId, onMarkerClick, onBoundsChange, singlePin = false, proximityCenter = null, showAll = true }) {
  const center = useMemo(() => {
    if (providers.length === 0) return [1.3521, 103.8198]
    const lats = providers.map(p => p.address.lat)
    const lngs = providers.map(p => p.address.lng)
    return [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ]
  }, [providers])

  // Track which marker IDs we've already seen so we only pin-drop newcomers
  const seenIdsRef = useRef(new Set())
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const isFirstRenderRef = useRef(true)
  const newcomerIndexMap = useMemo(() => {
    const map = new Map()
    let newcomerIdx = 0
    providers.forEach(p => {
      if (!seenIdsRef.current.has(p.id)) {
        map.set(p.id, newcomerIdx++)
      }
    })
    // Add to seen for next render
    providers.forEach(p => seenIdsRef.current.add(p.id))
    return map
  }, [providers])

  // Animated proximity radius: grow from 0 → final on commit
  const [animatedRadius, setAnimatedRadius] = useState(0)
  const proximityKey = proximityCenter ? `${proximityCenter.lat},${proximityCenter.lng}` : null
  useEffect(() => {
    if (!proximityCenter) { setAnimatedRadius(0); return }
    if (reducedMotion) { setAnimatedRadius(2000); return }
    const start = performance.now()
    const duration = 480
    let raf
    function tick(now) {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      // ease-out-soft approximation
      const eased = 1 - Math.pow(1 - t, 4)
      setAnimatedRadius(2000 * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [proximityKey, reducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isFirstRenderRef.current = false
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={singlePin ? 15 : 12}
      className="w-full h-full rounded-[20px]"
      style={{ minHeight: '300px' }}
      scrollWheelZoom={!singlePin}
      zoomControl={!singlePin}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      {!singlePin && <FitBounds providers={providers} proximityCenter={proximityCenter} showAll={showAll} />}
      {!singlePin && onBoundsChange && <BoundsReporter onBoundsChange={onBoundsChange} />}
      <ResizeHandler />
      {providers.map(provider => {
        const isSelected = provider.id === highlightedId || provider.id === selectedId
        const newcomerIdx = newcomerIndexMap.get(provider.id)
        const dropOnMount = newcomerIdx !== undefined && !reducedMotion
        const dropDelayMs = dropOnMount ? Math.min(newcomerIdx, 11) * 30 : 0
        return (
        <Marker
          key={provider.id}
          position={[provider.address.lat, provider.address.lng]}
          icon={createMarkerIcon({ isSelected, dropOnMount, dropDelayMs })}
          eventHandlers={{
            click: () => onMarkerClick?.(provider),
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <p className="font-normal text-sm m-0 mb-1">{provider.name}</p>
              <p className="text-xs text-gray-500 m-0 mb-2">{getCategoryLabel(provider.category)}</p>
              <button
                onClick={() => onMarkerClick?.(provider)}
                className="text-xs font-normal text-primary hover:underline cursor-pointer"
              >
                View details &rarr;
              </button>
            </div>
          </Popup>
        </Marker>
      )})}
      {proximityCenter && animatedRadius > 0 && (
        <Circle
          center={[proximityCenter.lat, proximityCenter.lng]}
          radius={animatedRadius}
          pathOptions={{
            color: '#3858E9',
            weight: 2,
            dashArray: '6 4',
            fillColor: '#3858E9',
            fillOpacity: 0.06,
          }}
        />
      )}
    </MapContainer>
  )
}
