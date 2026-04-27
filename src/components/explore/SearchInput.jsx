import { useState, useEffect } from 'react'

export default function SearchInput({ value, onChange }) {
  const [local, setLocal] = useState(value || '')

  useEffect(() => { setLocal(value || '') }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== (value || '')) onChange(local)
    }, 300)
    return () => clearTimeout(timer)
  }, [local])

  return (
    <div className="relative flex-1 min-w-0">
      <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
      </svg>
      <input
        type="text"
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder="Search by name, service, or area..."
        className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-stroke bg-white text-sm text-heading placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
      {local && (
        <button
          onClick={() => { setLocal(''); onChange('') }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted hover:text-heading cursor-pointer"
        >
          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
        </button>
      )}
    </div>
  )
}
