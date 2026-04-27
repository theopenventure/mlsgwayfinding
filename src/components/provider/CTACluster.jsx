import { cn } from '@/lib/utils'

const actions = [
  {
    key: 'call',
    label: 'Call',
    getHref: (contact) => contact.phone ? `tel:${contact.phone}` : null,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
      </svg>
    ),
    primary: true,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    getHref: (contact) => contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}` : null,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M3.43 2.524A41.29 41.29 0 0 1 10 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 0 1-5.183.501.78.78 0 0 0-.528.224l-3.579 3.58A.75.75 0 0 1 6 17.25v-3.443a.75.75 0 0 0-.666-.745A42.24 42.24 0 0 1 3.43 12.976C1.993 12.745 1 11.487 1 10.074V5.426c0-1.413.993-2.67 2.43-2.902Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: 'directions',
    label: 'Directions',
    getHref: (contact, address) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address.full)}`,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: 'website',
    label: 'Website',
    getHref: (contact) => contact.website,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.25-.22v-1.33a.75.75 0 0 1 1.28-.53l3.25 3.25a.75.75 0 0 1-.53 1.28h-1.33l-2.19 2.19a.75.75 0 1 1-1.06-1.06l2.19-2.19V5.28Z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export default function CTACluster({ contact, address }) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(action => {
        const href = action.getHref(contact, address)
        if (!href) return null

        return (
          <a
            key={action.key}
            href={href}
            target={action.key === 'website' ? '_blank' : undefined}
            rel={action.key === 'website' ? 'noopener noreferrer' : undefined}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-normal transition-colors',
              action.primary
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-[#F1F1F5] text-heading hover:bg-[#E5E5EA]',
            )}
          >
            {action.icon}
            {action.label}
          </a>
        )
      })}
    </div>
  )
}
