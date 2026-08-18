export type ListingType = 'rental' | 'product'

export interface FieldRow {
  id: string
  label: string
  value: string
}

export interface DetailSection {
  id: string
  title: string
  /** table = key/value rows; text = free-form description block */
  type: 'table' | 'text'
  text?: string
  rows: FieldRow[]
}

export interface Product {
  id: string
  itemName: string
  itemCode: string
  itemCategory: string
  categorySlug: string
  subcategorySlug: string
  description: string
  vendorContact: string
  hsnSacCode: string
  price: number
  location: string
  company: string
  contact: string
  images: string[]
  listingType: ListingType
  /** Specs shown on service listing cards */
  cardFields: FieldRow[]
  /** Fully flexible detail-page sections (admin-managed) */
  sections: DetailSection[]
  rating: number
  reviewCount: number
  responseRate: number
  yearsInBusiness: number
  trustBadge: string
  companyLocation: string
}

export interface SubCategory {
  id: string
  name: string
  slug: string
  image: string
  count: number
}

export interface CategoryGroup {
  id: string
  name: string
  slug: string
  image: string
  listingType: ListingType
  subcategories: SubCategory[]
}

export interface CatalogData {
  categoryGroups: CategoryGroup[]
  products: Product[]
}
