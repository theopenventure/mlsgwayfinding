import { useState } from 'react'
import FilterChip from './FilterChip'
import { getCategoryLabel } from '@/lib/utils'
import { serviceTypes } from '@/data/services'
import { ageGroups } from '@/data/ageGroups'
import { cn } from '@/lib/utils'

const sortOptions = [
  { id: 'nearest', label: 'Nearest first' },
  { id: 'az', label: 'A\u2013Z' },
]

export default function FilterBar({ filters, setFilter, removeFilter, clearAll, hasActiveFilters }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeChips = []
  if (filters.type) {
    activeChips.push({ key: 'type', label: getCategoryLabel(filters.type) })
  }
  if (filters.age) {
    const ag = ageGroups.find(a => a.id === filters.age)
    activeChips.push({ key: 'age', label: ag?.label || filters.age })
  }
  if (filters.location) {
    activeChips.push({ key: 'location', label: `Near ${filters.location}` })
  }

  function handleClearLocation() {
    removeFilter('location')
    removeFilter('postal')
    removeFilter('lat')
    removeFilter('lng')
  }

  return (
    <div>
      {/* Desktop filter bar */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        <select
          value={filters.type}
          onChange={e => setFilter('type', e.target.value)}
          className="px-3 py-2 rounded-lg border border-stroke bg-white text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
        >
          <option value="">All service types</option>
          {serviceTypes.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>

        <select
          value={filters.age}
          onChange={e => setFilter('age', e.target.value)}
          className="px-3 py-2 rounded-lg border border-stroke bg-white text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
        >
          <option value="">All age groups</option>
          {ageGroups.map(a => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>

        <select
          value={filters.sort || 'nearest'}
          onChange={e => setFilter('sort', e.target.value)}
          className="px-3 py-2 rounded-lg border border-stroke bg-white text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
        >
          {sortOptions.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Mobile filter button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-stroke text-sm font-medium text-heading shadow-card cursor-pointer"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" />
          </svg>
          Filters
          {activeChips.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              {activeChips.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-heading">Filters</h3>
              <button onClick={() => setMobileOpen(false)} className="p-1 cursor-pointer">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-muted">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Service type</label>
              <select
                value={filters.type}
                onChange={e => setFilter('type', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stroke bg-white text-sm"
              >
                <option value="">All service types</option>
                {serviceTypes.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Age group</label>
              <select
                value={filters.age}
                onChange={e => setFilter('age', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stroke bg-white text-sm"
              >
                <option value="">All age groups</option>
                {ageGroups.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Sort by</label>
              <select
                value={filters.sort || 'nearest'}
                onChange={e => setFilter('sort', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stroke bg-white text-sm"
              >
                {sortOptions.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              {hasActiveFilters && (
                <button
                  onClick={() => { clearAll(); setMobileOpen(false) }}
                  className="flex-1 py-2.5 rounded-lg border border-stroke text-sm font-medium text-muted cursor-pointer"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium cursor-pointer hover:bg-primary-dark transition-colors"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {activeChips.map(chip => (
            <FilterChip
              key={chip.key}
              label={chip.label}
              onRemove={() => chip.key === 'location' ? handleClearLocation() : removeFilter(chip.key)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
