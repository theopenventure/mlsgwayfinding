export default function InfoBlock({ items }) {
  return (
    <div className="divide-y divide-stroke">
      {items.map(({ label, value }) => (
        value != null && (
          <div key={label} className="flex py-3 gap-4">
            <dt className="w-40 flex-shrink-0 text-sm text-muted">{label}</dt>
            <dd className="text-sm text-heading font-normal">{value}</dd>
          </div>
        )
      ))}
    </div>
  )
}
