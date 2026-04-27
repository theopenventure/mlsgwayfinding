import { useState, useRef, useEffect } from 'react'
import { locations } from '@/data/providers'
import { cn } from '@/lib/utils'

export default function LocationSearch({ value, onChange }) {
  const [query, setQuery] = useState(value?.label || '')
  const [isOpen, setIsOpen] = useState(false)
  const [filtered, setFiltered] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleInput(e) {
    const q = e.target.value
    setQuery(q)
    if (q.length > 0) {
      const matches = locations.filter(
        loc =>
          loc.label.toLowerCase().includes(q.toLowerCase()) ||
          loc.postalCode.includes(q)
      )
      setFiltered(matches)
      setIsOpen(matches.length > 0)
    } else {
      setIsOpen(false)
      onChange(null)
    }
  }

  function handleSelect(location) {
    setQuery(location.label)
    setIsOpen(false)
    onChange(location)
  }

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
        >
          <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => query.length > 0 && filtered.length > 0 && setIsOpen(true)}
          placeholder="Enter your postal code or street name"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stroke bg-white text-sm text-heading placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      {isOpen && (
        <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-xl shadow-float border border-stroke overflow-hidden">
          {filtered.map(loc => (
            <button
              key={loc.postalCode}
              onClick={() => handleSelect(loc)}
              className={cn(
                'w-full text-left px-4 py-3 text-sm hover:bg-primary-soft transition-colors cursor-pointer',
                'flex items-center justify-between',
              )}
            >
              <span className="font-medium text-heading">{loc.label}</span>
              <span className="text-xs text-muted">{loc.postalCode}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
