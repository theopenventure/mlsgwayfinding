import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import { getCategoryLabel } from '@/lib/utils'

function createMarkerIcon(isSelected = false) {
  const size = isSelected ? 34 : 26
  const border = isSelected ? 4 : 3
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: #3858E9;
      border: ${border}px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      transition: all 200ms ease;
      ${isSelected ? 'transform: scale(1.15);' : ''}
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!singlePin && <FitBounds providers={providers} proximityCenter={proximityCenter} showAll={showAll} />}
      {!singlePin && onBoundsChange && <BoundsReporter onBoundsChange={onBoundsChange} />}
      <ResizeHandler />
      {providers.map(provider => (
        <Marker
          key={provider.id}
          position={[provider.address.lat, provider.address.lng]}
          icon={createMarkerIcon(provider.id === highlightedId || provider.id === selectedId)}
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
      ))}
      {proximityCenter && (
        <Circle
          center={[proximityCenter.lat, proximityCenter.lng]}
          radius={2000}
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
