export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary-soft flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <h3 className="text-lg font-normal text-heading mb-2">{title || 'No services found'}</h3>
      <p className="text-sm text-muted max-w-sm mb-6">
        {message || 'Try adjusting your filters or search criteria to see more results.'}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-normal hover:bg-primary-dark transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
