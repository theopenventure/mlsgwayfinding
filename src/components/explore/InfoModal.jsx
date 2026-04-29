import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useDelayedUnmount } from '@/lib/useDelayedUnmount'

const slides = [
  {
    title: 'Enquiry & Support',
    body: 'There are over 100 community mental health teams in the community island-wide. These community mental health teams serve as your in-person First Stop for Mental Health. They will listen to your concerns and support your mental well-being.',
  },
  {
    title: 'Therapy & Counselling',
    body: 'There are over 100 community mental health teams in the community islandwide. These community mental health teams are made up of trained care professionals (e.g. counsellors, social workers) who can assess your mental health needs and support your mental well-being through counselling and other interventions.',
  },
  {
    title: 'Medical Advice',
    body: 'Individuals with mild to moderate mental health and chronic health conditions can seek holistic treatment at a nearby General Practitioner (GP) clinic or Polyclinic, which is closer to home and in a less stigmatising environment. CHAS GPs & Polyclinics can support you with subsidised referral to the Specialist Outpatient Clinic.',
  },
]

const MINT = '#AFE0E1'

function ChevronLeft({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ChevronDown({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function NavButton({ direction, onClick, disabled, dashColor = 'rgba(255,255,255,0.3)' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      className={cn(
        'w-[50px] h-[50px] rounded-full flex items-center justify-center p-[3px] cursor-pointer motion-hover motion-press motion-focus',
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90',
      )}
      style={{ border: `1px dashed ${dashColor}` }}
    >
      <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
        {direction === 'prev' ? <ChevronLeft /> : <ChevronRight />}
      </span>
    </button>
  )
}

export default function InfoModal({ open, onClose }) {
  const [index, setIndex] = useState(0)
  const { shouldRender, isExiting } = useDelayedUnmount(open, 280)
  const [direction, setDirection] = useState(1) // +1 = next, -1 = prev — for slide animation
  const slide = slides[index]
  const isFirst = index === 0
  const isLast = index === slides.length - 1

  useEffect(() => {
    if (!open) {
      // reset to slide 0 after exit completes so reopens start fresh
      const t = setTimeout(() => setIndex(0), 280)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && !isFirst) { setDirection(-1); setIndex(i => i - 1) }
      if (e.key === 'ArrowRight' && !isLast) { setDirection(1); setIndex(i => i + 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isFirst, isLast, onClose])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center md:p-6">
      <div
        className={cn('absolute inset-0 bg-black/40', isExiting ? 'animate-fade-out' : 'animate-fade-in')}
        onClick={onClose}
      />

      {/* Desktop: side-by-side; Mobile: full-screen stacked */}
      <div
        data-motion-transform
        className={cn(
          'relative w-full md:w-auto md:max-w-[1044px] h-[100dvh] md:h-[540px] md:rounded-2xl overflow-hidden flex flex-col md:flex-row',
          isExiting
            ? 'animate-sheet-down-out md:animate-scale-fade-out'
            : 'animate-sheet-up-in md:animate-scale-fade-in',
        )}
      >
        {/* Mobile-only mint top */}
        <div
          className="md:hidden flex-1 relative"
          style={{ backgroundColor: MINT }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 w-[50px] h-[50px] rounded-full flex items-center justify-center p-[3px] cursor-pointer hover:opacity-90 motion-hover motion-press motion-focus"
            style={{ border: '1px dashed rgba(0,0,0,0.3)' }}
          >
            <span className="w-10 h-10 rounded-full bg-white text-heading flex items-center justify-center">
              <ChevronDown />
            </span>
          </button>
        </div>

        {/* Mobile-only text panel */}
        <div className="md:hidden bg-heading text-white px-6 pt-8 pb-10 flex flex-col gap-5">
          <p key={`m-c-${index}`} className="text-[17px] text-white/70 tracking-[-0.02em] animate-count-fade-in">
            {index + 1}/{slides.length}
          </p>
          <h2
            key={`m-t-${index}`}
            data-motion-transform
            className={cn(
              'text-[26px] leading-[30px] text-[#F1F1F5] font-serif',
              direction >= 0 ? 'animate-carousel-in-right' : 'animate-carousel-in-left',
            )}
          >
            {slide.title}
          </h2>
          <p
            key={`m-b-${index}`}
            data-motion-transform
            className={cn(
              'text-[15px] leading-5 text-white/70 tracking-[-0.02em]',
              direction >= 0 ? 'animate-carousel-in-right' : 'animate-carousel-in-left',
            )}
          >
            {slide.body}
          </p>
          <div className="flex gap-2 mt-2">
            <NavButton
              direction="prev"
              onClick={() => { setDirection(-1); setIndex(i => Math.max(0, i - 1)) }}
              disabled={isFirst}
            />
            <NavButton
              direction="next"
              onClick={() => { setDirection(1); setIndex(i => Math.min(slides.length - 1, i + 1)) }}
              disabled={isLast}
            />
          </div>
        </div>

        {/* Desktop left: navy text panel */}
        <div
          className="hidden md:flex flex-col justify-between bg-heading text-white pl-14 pr-6 py-14 rounded-l-2xl"
          style={{ width: '495px', height: '540px' }}
        >
          <p key={`d-c-${index}`} className="text-[17px] text-white/70 tracking-[-0.02em] animate-count-fade-in">
            {index + 1}/{slides.length}
          </p>
          <div
            key={`d-tb-${index}`}
            data-motion-transform
            className={cn(
              'flex flex-col gap-4 max-w-[470px]',
              direction >= 0 ? 'animate-carousel-in-right' : 'animate-carousel-in-left',
            )}
          >
            <h2 className="text-[26px] leading-[30px] text-[#F1F1F5] font-serif">{slide.title}</h2>
            <p className="text-[15px] leading-5 text-white/70 tracking-[-0.02em] max-w-[368px]">
              {slide.body}
            </p>
          </div>
          <div className="flex gap-2">
            <NavButton
              direction="prev"
              onClick={() => { setDirection(-1); setIndex(i => Math.max(0, i - 1)) }}
              disabled={isFirst}
            />
            <NavButton
              direction="next"
              onClick={() => { setDirection(1); setIndex(i => Math.min(slides.length - 1, i + 1)) }}
              disabled={isLast}
            />
          </div>
        </div>

        {/* Desktop right: mint panel with close button */}
        <div
          className="hidden md:block relative rounded-r-2xl"
          style={{ backgroundColor: MINT, width: '549px', height: '540px' }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-14 right-14 w-[50px] h-[50px] rounded-full flex items-center justify-center p-[3px] cursor-pointer hover:opacity-90 motion-hover motion-press motion-focus"
            style={{ border: '1px dashed rgba(0,0,0,0.3)' }}
          >
            <span className="w-10 h-10 rounded-full bg-[#F1F1F5] text-heading flex items-center justify-center">
              <ChevronDown />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
