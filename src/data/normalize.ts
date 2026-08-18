import type { DetailSection, FieldRow, Product } from '../types'
import { formatPrice } from './format'

type LegacyProduct = Omit<Product, 'cardFields' | 'sections'> & {
  customFields: { label: string; value: string }[]
}

function row(id: string, label: string, value: string): FieldRow {
  return { id, label, value }
}

export function fromLegacyProduct(p: LegacyProduct): Product {
  const cardFields = p.customFields.map((f, i) =>
    row(`card-${p.id}-${i}`, f.label, f.value),
  )

  const sections: DetailSection[] = [
    {
      id: `sec-item-${p.id}`,
      title: 'Item Details',
      type: 'table',
      rows: [
        row('item-name', 'Item Name', p.itemName),
        row('item-code', 'Item Code', p.itemCode),
        row('item-cat', 'Item Category', p.itemCategory),
        row('item-hsn', 'HSN/SAC Code', p.hsnSacCode),
        row('item-price', 'Price', formatPrice(p.price, p.listingType)),
        row(
          'item-type',
          'Listing Type',
          p.listingType === 'rental' ? 'Rental' : 'Purchase',
        ),
      ],
    },
    {
      id: `sec-desc-${p.id}`,
      title: 'Description',
      type: 'text',
      text: p.description,
      rows: [],
    },
    {
      id: `sec-specs-${p.id}`,
      title: 'Specifications',
      type: 'table',
      rows: p.customFields.map((f, i) =>
        row(`spec-${p.id}-${i}`, f.label, f.value),
      ),
    },
    {
      id: `sec-supplier-${p.id}`,
      title: 'Supplier & Contact',
      type: 'table',
      rows: [
        row('sup-company', 'Company', p.company),
        row('sup-loc', 'Location', p.location),
        row('sup-email', 'Email', p.contact),
        row('sup-phone', 'Phone', p.vendorContact),
      ],
    },
  ]

  const { customFields: _ignored, ...rest } = p
  return {
    ...rest,
    cardFields,
    sections,
  }
}

export function createEmptySection(title = 'New Section'): DetailSection {
  return {
    id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    type: 'table',
    text: '',
    rows: [createEmptyRow()],
  }
}

export function createEmptyRow(): FieldRow {
  return {
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: 'Field name',
    value: 'Value',
  }
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const STANDARD_SECTION_TITLES = new Set([
  'item details',
  'description',
  'specifications',
  'supplier & contact',
])

function findSection(product: Product, title: string) {
  return product.sections.find(
    (s) => s.title.trim().toLowerCase() === title.toLowerCase(),
  )
}

function itemDetailsRows(product: Product, existing?: FieldRow[]): FieldRow[] {
  const defs: [string, string, string][] = [
    ['item-name', 'Item Name', product.itemName],
    ['item-code', 'Item Code', product.itemCode],
    ['item-cat', 'Item Category', product.itemCategory],
    ['item-hsn', 'HSN/SAC Code', product.hsnSacCode],
    ['item-price', 'Price', formatPrice(product.price, product.listingType)],
    [
      'item-type',
      'Listing Type',
      product.listingType === 'rental' ? 'Rental' : 'Purchase',
    ],
  ]
  return defs.map(([id, label, value]) => {
    const prev = existing?.find((r) => r.id === id || r.label === label)
    return row(prev?.id ?? id, label, value)
  })
}

function supplierRows(product: Product, existing?: FieldRow[]): FieldRow[] {
  const defs: [string, string, string][] = [
    ['sup-company', 'Company', product.company],
    ['sup-loc', 'Location', product.location],
    ['sup-email', 'Email', product.contact],
    ['sup-phone', 'Phone', product.vendorContact],
  ]
  return defs.map(([id, label, value]) => {
    const prev = existing?.find((r) => r.id === id || r.label === label)
    return row(prev?.id ?? id, label, value)
  })
}

/** Keep detail-page sections in sync with canonical product fields. */
export function syncSectionsFromProduct(product: Product): Product {
  const itemSec = findSection(product, 'Item Details')
  const descSec = findSection(product, 'Description')
  const specsSec = findSection(product, 'Specifications')
  const supplierSec = findSection(product, 'Supplier & Contact')
  const customSections = product.sections.filter(
    (s) => !STANDARD_SECTION_TITLES.has(s.title.trim().toLowerCase()),
  )

  const sections: DetailSection[] = [
    {
      id: itemSec?.id ?? `sec-item-${product.id}`,
      title: 'Item Details',
      type: 'table',
      rows: itemDetailsRows(product, itemSec?.rows),
    },
    {
      id: descSec?.id ?? `sec-desc-${product.id}`,
      title: 'Description',
      type: 'text',
      text: product.description,
      rows: [],
    },
    {
      id: specsSec?.id ?? `sec-specs-${product.id}`,
      title: 'Specifications',
      type: 'table',
      rows: product.cardFields.map((f) => row(f.id, f.label, f.value)),
    },
    {
      id: supplierSec?.id ?? `sec-supplier-${product.id}`,
      title: 'Supplier & Contact',
      type: 'table',
      rows: supplierRows(product, supplierSec?.rows),
    },
    ...customSections,
  ]

  return {
    ...product,
    companyLocation: product.location,
    sections,
  }
}

function rowValue(rows: FieldRow[], id: string) {
  return rows.find((r) => r.id === id)?.value.trim()
}

function parsePriceValue(raw: string, fallback: number) {
  const num = parseFloat(raw.replace(/[^\d.]/g, ''))
  return Number.isFinite(num) ? num : fallback
}

function parseListingType(raw: string | undefined, fallback: Product['listingType']) {
  const v = raw?.trim().toLowerCase() ?? ''
  if (v.includes('purchase') || v.includes('product')) return 'product'
  if (v.includes('rental')) return 'rental'
  return fallback
}

/** Apply inline table edits from the detail page back onto the product. */
export function applyProductSectionRows(
  product: Product,
  sectionTitle: string,
  rows: FieldRow[],
): Product {
  const title = sectionTitle.trim().toLowerCase()
  let next: Product = {
    ...product,
    sections: product.sections.map((section) =>
      section.title.trim().toLowerCase() === title
        ? { ...section, rows }
        : section,
    ),
  }

  if (title === 'item details') {
    next = {
      ...next,
      itemName: rowValue(rows, 'item-name') || next.itemName,
      itemCode: rowValue(rows, 'item-code') || next.itemCode,
      itemCategory: rowValue(rows, 'item-cat') || next.itemCategory,
      hsnSacCode: rowValue(rows, 'item-hsn') || next.hsnSacCode,
      price: parsePriceValue(rowValue(rows, 'item-price') ?? '', next.price),
      listingType: parseListingType(rowValue(rows, 'item-type'), next.listingType),
    }
  }

  if (title === 'specifications') {
    next = {
      ...next,
      cardFields: rows.map((r) => ({ ...r })),
    }
  }

  if (title === 'supplier & contact') {
    const location = rowValue(rows, 'sup-loc') || next.location
    next = {
      ...next,
      company: rowValue(rows, 'sup-company') || next.company,
      location,
      companyLocation: location,
      contact: rowValue(rows, 'sup-email') || next.contact,
      vendorContact: rowValue(rows, 'sup-phone') || next.vendorContact,
    }
  }

  return syncSectionsFromProduct(next)
}

export function applyProductDescription(product: Product, text: string): Product {
  return syncSectionsFromProduct({ ...product, description: text })
}
