import { cn } from '@/lib/utils'

const icons = {
  'enquiry-support': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  ),
  'therapy-counselling': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  'medical-advice': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
}

const colors = {
  'enquiry-support': { bg: 'bg-cat-enquiry/10', text: 'text-cat-enquiry', border: 'border-cat-enquiry', activeBg: 'bg-cat-enquiry', activeText: 'text-white' },
  'therapy-counselling': { bg: 'bg-cat-therapy/10', text: 'text-cat-therapy', border: 'border-cat-therapy', activeBg: 'bg-cat-therapy', activeText: 'text-white' },
  'medical-advice': { bg: 'bg-cat-medical/10', text: 'text-cat-medical', border: 'border-cat-medical', activeBg: 'bg-cat-medical', activeText: 'text-white' },
}

const labels = {
  'enquiry-support': 'Enquiry & Support',
  'therapy-counselling': 'Therapy & Counselling',
  'medical-advice': 'Medical Advice',
}

export default function CategoryTile({ category, count, active, onClick }) {
  const c = colors[category]
  const label = labels[category]

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm font-medium whitespace-nowrap motion-select motion-press motion-focus',
        active
          ? `${c.activeBg} ${c.activeText} border-transparent shadow-card`
          : `${c.bg} ${c.text} ${c.border} border-opacity-30 hover:shadow-card`,
      )}
    >
      {icons[category]}
      <span>{label}</span>
      <span className={cn(
        'text-xs rounded-full px-1.5 py-0.5 font-semibold',
        active ? 'bg-white/25' : 'bg-black/5',
      )}>
        {count}
      </span>
    </button>
  )
}
