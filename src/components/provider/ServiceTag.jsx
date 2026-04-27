import { cn } from '@/lib/utils'

export default function ServiceTag({ children, onClick, active = false }) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'inline-block px-3 py-1 rounded-full text-sm font-normal transition-colors cursor-pointer',
          active
            ? 'bg-heading text-white'
            : 'bg-[#F1F1F5] text-heading hover:bg-[#E5E5EA]',
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <span className="inline-block px-3 py-1 rounded-full bg-[#F1F1F5] text-heading text-sm font-normal">
      {children}
    </span>
  )
}
