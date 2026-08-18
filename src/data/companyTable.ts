import type { Product } from '../types'
import { formatPrice } from './format'

export type TableColumnSource =
  | 'company'
  | 'location'
  | 'email'
  | 'phone'
  | 'price'
  | 'spec'

export type ColumnSortKind = 'text' | 'numeric'

export interface TableColumnDef {
  key: string
  label: string
  source: TableColumnSource
  filterable?: boolean
  sortKind?: ColumnSortKind
}

export type SortDirection = 'asc' | 'desc'

export interface ColumnSortState {
  columnKey: string
  direction: SortDirection
}

const SPEC_LABELS = [
  'Rental Unit',
  'Material',
  'Load Capacity',
  'Min. Hire Period',
] as const

function findFieldValue(product: Product, label: string): string {
  const normalized = label.trim().toLowerCase()

  const fromCard = product.cardFields.find(
    (f) => f.label.trim().toLowerCase() === normalized,
  )
  if (fromCard?.value.trim()) return fromCard.value.trim()

  for (const section of product.sections) {
    if (section.type !== 'table') continue
    const match = section.rows.find(
      (r) => r.label.trim().toLowerCase() === normalized,
    )
    if (match?.value.trim()) return match.value.trim()
  }

  return '—'
}

export const COMPANY_TABLE_COLUMNS: TableColumnDef[] = [
  { key: 'company', label: 'Company', source: 'company', filterable: false },
  { key: 'location', label: 'Location', source: 'location', filterable: true, sortKind: 'text' },
  { key: 'email', label: 'Email', source: 'email', filterable: false },
  { key: 'phone', label: 'Phone', source: 'phone', filterable: false },
  {
    key: 'price',
    label: 'Price',
    source: 'price',
    filterable: true,
    sortKind: 'numeric',
  },
  { key: 'rental-unit', label: SPEC_LABELS[0], source: 'spec', filterable: true, sortKind: 'text' },
  { key: 'material', label: SPEC_LABELS[1], source: 'spec', filterable: true, sortKind: 'text' },
  {
    key: 'load-capacity',
    label: SPEC_LABELS[2],
    source: 'spec',
    filterable: true,
    sortKind: 'text',
  },
  { key: 'min-hire-period', label: SPEC_LABELS[3], source: 'spec', filterable: false },
]

export function getTableCellValue(product: Product, column: TableColumnDef): string {
  switch (column.source) {
    case 'company':
      return product.company.trim() || '—'
    case 'location':
      return (product.companyLocation || product.location).trim() || '—'
    case 'email':
      return product.contact.trim() || '—'
    case 'phone':
      return product.vendorContact.trim() || '—'
    case 'price':
      return formatPrice(product.price, product.listingType)
    default:
      return findFieldValue(product, column.label)
  }
}

export function getTableSortValue(
  product: Product,
  column: TableColumnDef,
): string | number {
  if (column.source === 'price') return product.price
  return getTableCellValue(product, column)
}

export function getUniqueColumnValues(
  products: Product[],
  column: TableColumnDef,
): string[] {
  return [...new Set(products.map((p) => getTableCellValue(p, column)))].sort(
    (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }),
  )
}

export type ColumnFilterState = Record<string, Set<string>>

export function isColumnFilterActive(
  filters: ColumnFilterState,
  columnKey: string,
  allValues: string[],
): boolean {
  const selected = filters[columnKey]
  if (!selected) return false
  return selected.size < allValues.length
}

export function isColumnSorted(
  sort: ColumnSortState | null,
  columnKey: string,
): boolean {
  return sort?.columnKey === columnKey
}

export function filterProductsByColumns(
  products: Product[],
  filters: ColumnFilterState,
  columns: TableColumnDef[] = COMPANY_TABLE_COLUMNS,
): Product[] {
  const activeEntries = Object.entries(filters).filter(
    ([, selected]) => selected && selected.size > 0,
  )
  if (activeEntries.length === 0) return products

  return products.filter((product) =>
    activeEntries.every(([columnKey, selected]) => {
      const column = columns.find((c) => c.key === columnKey)
      if (!column || !selected) return true
      return selected.has(getTableCellValue(product, column))
    }),
  )
}

export function sortProductsByColumn(
  products: Product[],
  sort: ColumnSortState | null,
  columns: TableColumnDef[] = COMPANY_TABLE_COLUMNS,
): Product[] {
  if (!sort) return products

  const column = columns.find((c) => c.key === sort.columnKey)
  if (!column) return products

  const dir = sort.direction === 'asc' ? 1 : -1
  return [...products].sort((a, b) => {
    const av = getTableSortValue(a, column)
    const bv = getTableSortValue(b, column)

    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * dir
    }

    return (
      String(av).localeCompare(String(bv), undefined, {
        sensitivity: 'base',
        numeric: true,
      }) * dir
    )
  })
}

export function countActiveFilters(
  filters: ColumnFilterState,
  products: Product[],
): number {
  return COMPANY_TABLE_COLUMNS.filter(
    (col) =>
      col.filterable !== false &&
      isColumnFilterActive(filters, col.key, getUniqueColumnValues(products, col)),
  ).length
}
