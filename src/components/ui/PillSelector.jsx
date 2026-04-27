import { cn } from '@/lib/utils'

export default function PillSelector({ options, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {options.map(option => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            'px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-2',
            selected === option.id
              ? 'bg-primary text-white border-primary shadow-card-hover'
              : 'bg-white text-heading border-stroke hover:border-primary/50 hover:shadow-card',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
