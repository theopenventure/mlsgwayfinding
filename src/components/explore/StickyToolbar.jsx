import { cn } from '@/lib/utils'

const categories = [
  { id: '', label: 'All Services' },
  { id: 'enquiry-support', label: 'Enquiry & Support' },
  { id: 'therapy-counselling', label: 'Therapy & Counselling' },
  { id: 'medical-advice', label: 'Medical Advice' },
]

export default function StickyToolbar({ filters, toggleFilter, activeFilterCount, onOpenFilters, onOpenInfo, floating = false }) {
  const pillShadow = floating ? 'shadow-card' : ''
  return (
    <div className={cn('z-30', floating ? '' : 'bg-white border-b border-stroke')}>
      <div className={cn('mx-auto', floating ? 'px-3 py-3' : 'max-w-7xl px-4 py-3')}>
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={onOpenFilters}
            className={cn(
              'flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-sm font-normal hover:bg-primary/90 cursor-pointer motion-hover motion-press motion-focus',
              pillShadow,
            )}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-primary text-xs flex items-center justify-center font-normal">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0">
            {categories.map(cat => {
              const isActive = filters.type === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleFilter('type', cat.id)}
                  className={cn(
                    'flex-shrink-0 px-5 py-3 rounded-full text-sm font-normal cursor-pointer motion-select motion-press motion-focus',
                    isActive
                      ? 'bg-heading text-white'
                      : 'bg-[#F1F1F5] text-heading hover:bg-[#E5E5EA]',
                    pillShadow,
                  )}
                >
                  {cat.label}
                </button>
              )
            })}

            {/* Info button */}
            <button
              onClick={onOpenInfo}
              aria-label="About these categories"
              className={cn(
                'flex-shrink-0 w-11 h-11 rounded-full border border-stroke bg-white flex items-center justify-center text-heading hover:bg-[#F1F1F5] cursor-pointer motion-hover motion-press motion-focus',
                pillShadow,
              )}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="9.5" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <circle cx="12" cy="7.5" r="0.6" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
