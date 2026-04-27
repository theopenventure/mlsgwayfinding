import { cn } from '@/lib/utils'

export default function ServiceTagBar({ services, activeService, onSelect }) {
  if (services.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {services.slice(0, 15).map(({ name, count }) => (
        <button
          key={name}
          onClick={() => onSelect(activeService === name ? '' : name)}
          className={cn(
            'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border',
            activeService === name
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-muted border-stroke hover:border-primary/40 hover:text-primary',
          )}
        >
          {name}
          <span className="ml-1 opacity-60">{count}</span>
        </button>
      ))}
    </div>
  )
}
