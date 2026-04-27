import { cn } from '@/lib/utils'

const variants = {
  open: 'bg-status-open/10 text-status-open',
  closed: 'bg-status-closed/10 text-status-closed',
  'enquiry-support': 'bg-gray-100 text-muted',
  'therapy-counselling': 'bg-gray-100 text-muted',
  'medical-advice': 'bg-gray-100 text-muted',
  default: 'bg-gray-100 text-muted',
}

const dotColors = {
  open: 'bg-status-open',
  closed: 'bg-status-closed',
  'enquiry-support': 'bg-cat-enquiry',
  'therapy-counselling': 'bg-cat-therapy',
  'medical-advice': 'bg-cat-medical',
}

export default function Badge({ variant = 'default', children, dot = false, small = false }) {
  const isCategory = ['enquiry-support', 'therapy-counselling', 'medical-advice'].includes(variant)

  if (isCategory) {
    return (
      <span className={cn('inline-flex items-center font-normal text-muted', small ? 'text-[10px]' : 'text-xs')}>
        {children}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-normal',
        small ? 'gap-1 px-2 py-0.5 text-[10px]' : 'gap-1.5 px-2.5 py-0.5 text-xs',
        variants[variant] || variants.default,
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant] || 'bg-current')} />
      )}
      {children}
    </span>
  )
}
