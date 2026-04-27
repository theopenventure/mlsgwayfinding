import { getCategoryLabel, cn } from '@/lib/utils'

const categories = [
  { id: '', label: 'All Services' },
  { id: 'enquiry-support', label: 'Enquiry & Support' },
  { id: 'therapy-counselling', label: 'Therapy & Counselling' },
  { id: 'medical-advice', label: 'Medical Advice' },
]

export default function StickyToolbar({ filters, toggleFilter, activeFilterCount, onOpenFilters }) {
  return (
    <div className="bg-white border-b border-stroke z-30">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={onOpenFilters}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-sm font-normal hover:bg-primary/90 transition-colors cursor-pointer"
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
                    'flex-shrink-0 px-5 py-3 rounded-full text-sm font-normal transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-heading text-white'
                      : 'bg-[#F1F1F5] text-heading hover:bg-[#E5E5EA]',
                  )}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
