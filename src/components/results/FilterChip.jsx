import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function FilterChip({ label, onRemove }) {
  const [isDismissing, setIsDismissing] = useState(false)

  function handleRemove() {
    if (isDismissing) return
    setIsDismissing(true)
    setTimeout(() => onRemove?.(), 200)
  }

  return (
    <span
      data-motion-transform
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-soft text-primary-dark text-sm font-medium',
        isDismissing && 'animate-chip-dismiss',
      )}
    >
      {label}
      <button
        onClick={handleRemove}
        className="ml-0.5 w-4 h-4 rounded-full hover:bg-primary/20 flex items-center justify-center cursor-pointer motion-hover motion-press motion-focus"
        aria-label={`Remove ${label} filter`}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </span>
  )
}
