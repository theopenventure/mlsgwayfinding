import { useSearchParams } from 'react-router'

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = {
    type: searchParams.get('type') || '',
    age: searchParams.get('age') || '',
    postal: searchParams.get('postal') || '',
    location: searchParams.get('location') || '',
    lat: searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null,
    lng: searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null,
    sort: searchParams.get('sort') || '',
    q: searchParams.get('q') || '',
    service: searchParams.get('service') || '',
    openNow: searchParams.get('openNow') === '1',
    fee: searchParams.get('fee') || '',
    provider: searchParams.get('provider') || '',
  }

  function setFilter(key, value) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value && value !== false) {
        next.set(key, key === 'openNow' ? '1' : value)
      } else {
        next.delete(key)
      }
      return next
    }, { replace: true })
  }

  function setMultipleFilters(updates) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== false) {
          next.set(key, key === 'openNow' ? '1' : value)
        } else {
          next.delete(key)
        }
      }
      return next
    }, { replace: true })
  }

  function removeFilter(key) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete(key)
      if (key === 'location') {
        next.delete('postal')
        next.delete('lat')
        next.delete('lng')
      }
      return next
    }, { replace: true })
  }

  function toggleFilter(key, value) {
    setFilter(key, filters[key] === value ? '' : value)
  }

  function clearAll() {
    const provider = filters.provider
    const next = new URLSearchParams()
    if (provider) next.set('provider', provider)
    setSearchParams(next, { replace: true })
  }

  function openProvider(slug) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (slug) {
        next.set('provider', slug)
      } else {
        next.delete('provider')
      }
      return next
    })
  }

  function closeProvider() {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('provider')
      return next
    })
  }

  const hasActiveFilters = !!(filters.type || filters.age || filters.postal || filters.q || filters.service || filters.openNow || filters.fee)

  return {
    filters,
    setFilter,
    setMultipleFilters,
    removeFilter,
    toggleFilter,
    clearAll,
    hasActiveFilters,
    openProvider,
    closeProvider,
  }
}
