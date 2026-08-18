import type { ListingType } from '../types'

export function formatPrice(price: number, listingType: ListingType) {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
  return listingType === 'rental' ? `${formatted}/day*` : formatted
}
