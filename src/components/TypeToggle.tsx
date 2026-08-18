import type { ListingType } from '../types'

interface TypeToggleProps {
  value: ListingType
  onChange: (value: ListingType) => void
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="type-toggle" role="group" aria-label="Listing type">
      <button
        type="button"
        className={value === 'rental' ? 'active' : undefined}
        onClick={() => onChange('rental')}
      >
        Rental
      </button>
      <button
        type="button"
        className={value === 'product' ? 'active' : undefined}
        onClick={() => onChange('product')}
      >
        Purchase
      </button>
    </div>
  )
}
