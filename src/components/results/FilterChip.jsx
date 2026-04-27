export default function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-soft text-primary-dark text-sm font-medium">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 w-4 h-4 rounded-full hover:bg-primary/20 flex items-center justify-center transition-colors cursor-pointer"
        aria-label={`Remove ${label} filter`}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </span>
  )
}
