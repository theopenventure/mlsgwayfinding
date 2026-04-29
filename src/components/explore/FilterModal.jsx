import { useState, useEffect, useRef } from 'react'
import { ageGroups } from '@/data/ageGroups'
import { resolvePostalCode } from '@/data/postalAreas'
import { cn } from '@/lib/utils'
import { useDelayedUnmount } from '@/lib/useDelayedUnmount'

const categories = [
  {
    id: '',
    label: 'All Services',
    description: 'Browse everything available',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    id: 'enquiry-support',
    label: 'Enquiry & Support',
    description: 'Counselling, emotional support, someone who listens',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: 'therapy-counselling',
    label: 'Therapy & Counselling',
    description: 'CBT, family therapy, professional sessions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    id: 'medical-advice',
    label: 'Medical Advice',
    description: 'Assessments, medication, doctor consultations',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
]

const feeOptions = [
  { id: 'free', label: 'Free', description: 'No cost' },
  { id: 'fee-based', label: 'Fee-based', description: 'Standard pricing' },
]

export default function FilterModal({ open, filters, setFilter, setMultipleFilters, removeFilter, clearAll, totalCount, onClose }) {
  const { shouldRender, isExiting } = useDelayedUnmount(open, 280)
  const activeFilterCount = [filters.age, filters.fee, filters.openNow, filters.postal].filter(Boolean).length

  const [postalInput, setPostalInput] = useState(filters.postal || '')
  const [postalStatus, setPostalStatus] = useState(
    filters.postal ? { type: 'valid', label: resolvePostalCode(filters.postal)?.label || '' } : { type: 'idle' }
  )

  useEffect(() => {
    setPostalInput(filters.postal || '')
    if (filters.postal) {
      const result = resolvePostalCode(filters.postal)
      setPostalStatus(result ? { type: 'valid', label: result.label } : { type: 'idle' })
    } else {
      setPostalStatus({ type: 'idle' })
    }
  }, [filters.postal])

  const postalInputRef = useRef(null)

  function shakePostalInput() {
    if (!postalInputRef.current) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    postalInputRef.current.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(2px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 200, easing: 'ease-in-out' },
    )
  }

  function handlePostalChange(value) {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    setPostalInput(digits)

    if (digits.length < 6) {
      setPostalStatus({ type: 'idle' })
      if (filters.postal) removeFilter('location')
      return
    }

    const result = resolvePostalCode(digits)
    if (result) {
      setPostalStatus({ type: 'valid', label: result.label })
      setMultipleFilters({ postal: digits, lat: result.lat, lng: result.lng })
    } else {
      setPostalStatus({ type: 'invalid' })
      shakePostalInput()
    }
  }

  function clearPostal() {
    setPostalInput('')
    setPostalStatus({ type: 'idle' })
    removeFilter('location')
  }

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div
        className={cn('absolute inset-0 bg-black/40', isExiting ? 'animate-fade-out' : 'animate-fade-in')}
        onClick={onClose}
      />

      <div
        data-motion-transform
        className={cn(
          'relative bg-white sm:rounded-2xl rounded-t-2xl border border-stroke w-full sm:max-w-[520px] max-h-[85dvh] sm:max-h-[85vh] flex flex-col sm:mx-4',
          isExiting
            ? 'animate-sheet-down-out sm:animate-scale-fade-out'
            : 'animate-sheet-up-in sm:animate-scale-fade-in',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stroke">
          <button onClick={onClose} className="p-1 cursor-pointer rounded motion-hover motion-press motion-focus">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-heading">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
          <h2 className="text-base font-normal text-heading">Find the right support</h2>
          <div className="w-7" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Service category */}
          <section>
            <h3 className="text-base font-normal text-heading mb-1">What kind of help are you looking for?</h3>
            <p className="text-sm text-muted mb-4">Choose what feels right. You can always change this later.</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => {
                const isActive = (filters.type || '') === cat.id
                return (
                  <button
                    key={cat.id || 'all'}
                    onClick={() => setFilter('type', cat.id)}
                    className={cn(
                      'flex flex-col items-start gap-2 p-4 rounded-xl border cursor-pointer text-left motion-select motion-press motion-focus',
                      isActive
                        ? 'bg-[#F1F1F5] border-transparent'
                        : 'bg-white border-stroke hover:border-stroke',
                    )}
                  >
                    <span className={cn('transition-colors', isActive ? 'text-heading' : 'text-muted')}>
                      {cat.icon}
                    </span>
                    <div>
                      <p className="text-sm font-normal text-heading">{cat.label}</p>
                      <p className="text-xs text-muted mt-0.5 leading-relaxed">{cat.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <hr className="border-stroke" />

          {/* Postal Code */}
          <section>
            <h3 className="text-base font-normal text-heading mb-1">Where are you located?</h3>
            <p className="text-sm text-muted mb-4">We'll show the closest services to you.</p>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted">
                  <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                ref={postalInputRef}
                type="text"
                inputMode="numeric"
                value={postalInput}
                onChange={(e) => handlePostalChange(e.target.value)}
                placeholder="e.g. 540121"
                data-motion-transform
                className={cn(
                  'w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-heading placeholder:text-muted/50 outline-none motion-select',
                  postalStatus.type === 'invalid'
                    ? 'border-red-400 focus:border-red-500'
                    : postalStatus.type === 'valid'
                      ? 'border-green-400 focus:border-green-500'
                      : 'border-stroke focus:border-primary',
                )}
              />
              {postalInput && (
                <button
                  onClick={clearPostal}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 cursor-pointer text-muted hover:text-heading rounded motion-hover motion-press motion-focus"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              )}
            </div>
            {postalStatus.type === 'valid' && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span data-motion-transform className="inline-flex animate-check-pop">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                </span>
                Showing results near {postalStatus.label}
              </p>
            )}
            {postalStatus.type === 'invalid' && (
              <p className="text-xs text-red-500 mt-2">We couldn't recognise this postal code. Please check and try again.</p>
            )}
          </section>

          <hr className="border-stroke" />

          {/* Age */}
          <section>
            <h3 className="text-base font-normal text-heading mb-1">How old are you?</h3>
            <p className="text-sm text-muted mb-4">Some services specialise in certain age groups.</p>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map(ag => (
                <button
                  key={ag.id}
                  onClick={() => setFilter('age', filters.age === ag.id ? '' : ag.id)}
                  className={cn(
                    'px-5 py-3 rounded-full text-sm font-normal cursor-pointer motion-select motion-press motion-focus',
                    filters.age === ag.id
                      ? 'bg-heading text-white'
                      : 'bg-[#F1F1F5] text-heading hover:bg-[#E5E5EA]',
                  )}
                >
                  {ag.label}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-stroke" />

          {/* Fees */}
          <section>
            <h3 className="text-base font-normal text-heading mb-1">What's your budget?</h3>
            <p className="text-sm text-muted mb-4">Many services offer free or subsidised support.</p>
            <div className="flex flex-wrap gap-2">
              {feeOptions.map(fee => (
                <button
                  key={fee.id}
                  onClick={() => setFilter('fee', filters.fee === fee.id ? '' : fee.id)}
                  className={cn(
                    'px-5 py-3 rounded-full text-sm font-normal cursor-pointer motion-select motion-press motion-focus',
                    filters.fee === fee.id
                      ? 'bg-heading text-white'
                      : 'bg-[#F1F1F5] text-heading hover:bg-[#E5E5EA]',
                  )}
                >
                  {fee.label}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-stroke" />

          {/* Open now */}
          <section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-normal text-heading">Do you need help right now?</h3>
                <p className="text-sm text-muted mt-0.5">We'll show services that are currently open.</p>
              </div>
              <button
                onClick={() => setFilter('openNow', filters.openNow ? '' : true)}
                style={{ transition: 'background-color var(--motion-base) var(--ease-in-out-soft)' }}
                className={cn(
                  'relative flex-shrink-0 w-12 h-7 rounded-full cursor-pointer motion-focus',
                  filters.openNow ? 'bg-primary' : 'bg-gray-300',
                )}
              >
                <span
                  data-motion-transform
                  style={{ transition: 'transform 240ms var(--ease-micro-spring)' }}
                  className={cn(
                    'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-card',
                    filters.openNow ? 'translate-x-[22px]' : 'translate-x-0.5',
                  )}
                />
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stroke">
          {activeFilterCount > 0 ? (
            <button
              onClick={clearAll}
              className="text-sm font-normal text-heading underline underline-offset-2 cursor-pointer hover:text-primary motion-hover motion-focus rounded"
            >
              Clear all
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-primary text-white text-sm font-normal cursor-pointer hover:bg-primary-dark motion-hover motion-press motion-focus"
          >
            Show <span key={totalCount} className="inline-block animate-count-fade-in">{totalCount}</span> clinic{totalCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
