import { useState, useMemo, useEffect } from 'react'
import { providers as allProvidersData } from '@/data/providers'
import { calculateDistance } from '@/lib/utils'

const PAGE_SIZE = 12

const needsMap = {
  'talk': ['Emotional support', 'Befriending', 'Counselling', 'Individual counselling', 'Crisis support', 'Peer support groups', 'Social support', 'Community outreach', 'Caregiver support', 'Walk-in sessions'],
  'therapy': ['CBT', 'Family therapy', 'Couples therapy', 'Art therapy', 'Youth counselling', 'Play therapy', 'Group therapy', 'EMDR', 'Psychotherapy', 'Online therapy', 'Trauma therapy', 'Trauma counselling', 'Grief counselling', 'Child therapy', 'Depression support', 'Anxiety management', 'Resilience building'],
  'medical': ['Mental health consultation', 'Medication management', 'Specialist referral', 'Health screening', 'Mental health screening', 'GP consultation', 'Referral to psychiatry', 'Mental wellness consultation', 'Anxiety assessment', 'Depression screening', 'Mental health assessment', 'Psychological screening', 'Psychological assessment', 'ADHD assessment', 'Treatment planning'],
  'wellness': ['Wellness programmes', 'Mindfulness workshops', 'Case management', 'Community integration', 'Group activities', 'Rehabilitation', 'Social integration', 'Vocational training', 'Peer support', 'Stress management'],
}

export function useProviders(filters) {
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const filterKey = `${filters.type}|${filters.age}|${filters.sort}|${filters.postal}|${filters.q}|${filters.service}|${filters.openNow}|${filters.fee}|${filters.need}`

  useEffect(() => { setPage(1) }, [filterKey])
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [filterKey])

  const filtered = useMemo(() => {
    let result = [...allProvidersData]

    // Text search
    if (filters.q) {
      const q = filters.q.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.address.street.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q))
      )
    }

    // Category filter
    if (filters.type) {
      result = result.filter(p => p.category === filters.type)
    }

    // Age group filter
    if (filters.age) {
      result = result.filter(p => p.ageGroups.includes(filters.age))
    }

    // Service tag filter
    if (filters.service) {
      const svc = filters.service.toLowerCase()
      result = result.filter(p =>
        p.services.some(s => s.toLowerCase() === svc)
      )
    }

    // Need filter (maps to groups of services)
    if (filters.need && needsMap[filters.need]) {
      const matchServices = needsMap[filters.need].map(s => s.toLowerCase())
      result = result.filter(p =>
        p.services.some(s => matchServices.includes(s.toLowerCase()))
      )
    }

    // Open now filter
    if (filters.openNow) {
      result = result.filter(p => p.operatingHours.isOpenNow)
    }

    // Fee filter
    if (filters.fee) {
      const fee = filters.fee.toLowerCase()
      result = result.filter(p => p.fees.toLowerCase() === fee)
    }

    // Attach distance
    if (filters.lat && filters.lng) {
      result = result.map(p => ({
        ...p,
        distance: calculateDistance(filters.lat, filters.lng, p.address.lat, p.address.lng),
      }))
    }

    // Sort
    const sort = filters.sort || (filters.lat ? 'nearest' : 'open-first')
    if (sort === 'nearest' && filters.lat) {
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else if (sort === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'open-first') {
      result.sort((a, b) => {
        if (a.operatingHours.isOpenNow === b.operatingHours.isOpenNow) return a.name.localeCompare(b.name)
        return a.operatingHours.isOpenNow ? -1 : 1
      })
    }

    return result
  }, [filters.type, filters.age, filters.lat, filters.lng, filters.sort, filters.q, filters.service, filters.openNow, filters.fee, filters.need])

  // Unique service tags from filtered results (with counts)
  const uniqueServices = useMemo(() => {
    const counts = {}
    filtered.forEach(p => {
      p.services.forEach(s => {
        counts[s] = (counts[s] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [filtered])

  // Open now providers (for urgency lane)
  const openNowProviders = useMemo(() => {
    return filtered.filter(p => p.operatingHours.isOpenNow)
  }, [filtered])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { 'enquiry-support': 0, 'therapy-counselling': 0, 'medical-advice': 0 }
    // Count from unfiltered (or type-unfiltered) set for tiles
    let base = [...allProvidersData]
    if (filters.q) {
      const q = filters.q.toLowerCase()
      base = base.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q))
      )
    }
    if (filters.age) base = base.filter(p => p.ageGroups.includes(filters.age))
    if (filters.openNow) base = base.filter(p => p.operatingHours.isOpenNow)
    if (filters.fee) base = base.filter(p => p.fees.toLowerCase() === filters.fee.toLowerCase())
    if (filters.need && needsMap[filters.need]) {
      const matchServices = needsMap[filters.need].map(s => s.toLowerCase())
      base = base.filter(p => p.services.some(s => matchServices.includes(s.toLowerCase())))
    }
    base.forEach(p => { if (counts[p.category] !== undefined) counts[p.category]++ })
    return counts
  }, [filters.q, filters.age, filters.openNow, filters.fee, filters.need])

  const totalCount = filtered.length
  const visibleProviders = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visibleProviders.length < totalCount

  function loadMore() { setPage(p => p + 1) }

  return {
    providers: visibleProviders,
    allProviders: filtered,
    totalCount,
    loadMore,
    hasMore,
    isLoading,
    visibleCount: visibleProviders.length,
    uniqueServices,
    openNowProviders,
    categoryCounts,
  }
}
