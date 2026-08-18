import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  CatalogData,
  CategoryGroup,
  DetailSection,
  FieldRow,
  ListingType,
  Product,
  SubCategory,
} from '../types'
import { categoryGroups as seedGroups } from './categories'
import { products as seedProducts } from './products'
import { createEmptyRow, createEmptySection, createId, syncSectionsFromProduct } from './normalize'

const STORAGE_KEY = 'equipmart_catalog_v3'

function loadCatalog(): CatalogData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CatalogData
      if (
        parsed?.categoryGroups?.length &&
        parsed?.products?.length &&
        parsed.products.every(
          (p) => Array.isArray(p.sections) && Array.isArray(p.cardFields),
        )
      ) {
        return parsed
      }
    }
  } catch {
    /* ignore */
  }
  return {
    categoryGroups: structuredClone(seedGroups),
    products: structuredClone(seedProducts),
  }
}

function saveCatalog(data: CatalogData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

interface DataContextValue {
  categoryGroups: CategoryGroup[]
  products: Product[]
  getGroupsByType: (type: ListingType) => CategoryGroup[]
  getCategoryBySlug: (slug: string) => {
    group: CategoryGroup
    subcategory: SubCategory
  } | null
  getProductsBySubcategory: (slug: string) => Product[]
  getProductById: (id: string) => Product | undefined
  searchProducts: (query: string, listingType?: ListingType) => Product[]
  setCategoryGroups: (groups: CategoryGroup[]) => void
  setProducts: (products: Product[]) => void
  updateProduct: (product: Product) => void
  addProduct: (product: Product) => void
  removeProduct: (id: string) => void
  updateCategoryGroup: (group: CategoryGroup) => void
  addCategoryGroup: (group: CategoryGroup) => void
  removeCategoryGroup: (id: string) => void
  resetCatalog: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CatalogData>(() => loadCatalog())

  const commit = useCallback((next: CatalogData) => {
    setData(next)
    saveCatalog(next)
  }, [])

  const setCategoryGroups = useCallback(
    (categoryGroups: CategoryGroup[]) => {
      commit({ ...data, categoryGroups })
    },
    [commit, data],
  )

  const setProducts = useCallback(
    (products: Product[]) => {
      commit({ ...data, products })
    },
    [commit, data],
  )

  const updateProduct = useCallback(
    (product: Product) => {
      const synced = syncSectionsFromProduct(product)
      commit({
        ...data,
        products: data.products.map((p) => (p.id === synced.id ? synced : p)),
      })
    },
    [commit, data],
  )

  const addProduct = useCallback(
    (product: Product) => {
      const synced = syncSectionsFromProduct(product)
      commit({ ...data, products: [...data.products, synced] })
    },
    [commit, data],
  )

  const removeProduct = useCallback(
    (id: string) => {
      commit({
        ...data,
        products: data.products.filter((p) => p.id !== id),
      })
    },
    [commit, data],
  )

  const updateCategoryGroup = useCallback(
    (group: CategoryGroup) => {
      commit({
        ...data,
        categoryGroups: data.categoryGroups.map((g) =>
          g.id === group.id ? group : g,
        ),
      })
    },
    [commit, data],
  )

  const addCategoryGroup = useCallback(
    (group: CategoryGroup) => {
      commit({
        ...data,
        categoryGroups: [...data.categoryGroups, group],
      })
    },
    [commit, data],
  )

  const removeCategoryGroup = useCallback(
    (id: string) => {
      commit({
        ...data,
        categoryGroups: data.categoryGroups.filter((g) => g.id !== id),
      })
    },
    [commit, data],
  )

  const resetCatalog = useCallback(() => {
    const fresh = {
      categoryGroups: structuredClone(seedGroups),
      products: structuredClone(seedProducts),
    }
    commit(fresh)
  }, [commit])

  const value = useMemo<DataContextValue>(() => {
    const { categoryGroups, products } = data
    return {
      categoryGroups,
      products,
      getGroupsByType: (type) =>
        categoryGroups.filter((g) => g.listingType === type),
      getCategoryBySlug: (slug) => {
        for (const group of categoryGroups) {
          const subcategory = group.subcategories.find((s) => s.slug === slug)
          if (subcategory) return { group, subcategory }
        }
        return null
      },
      getProductsBySubcategory: (slug) =>
        products.filter((p) => p.subcategorySlug === slug),
      getProductById: (id) => products.find((p) => p.id === id),
      searchProducts: (query, listingType) => {
        const q = query.trim().toLowerCase()
        return products.filter((p) => {
          if (listingType && p.listingType !== listingType) return false
          if (!q) return true
          return (
            p.itemName.toLowerCase().includes(q) ||
            p.itemCategory.toLowerCase().includes(q) ||
            p.company.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.itemCode.toLowerCase().includes(q)
          )
        })
      },
      setCategoryGroups,
      setProducts,
      updateProduct,
      addProduct,
      removeProduct,
      updateCategoryGroup,
      addCategoryGroup,
      removeCategoryGroup,
      resetCatalog,
    }
  }, [
    data,
    setCategoryGroups,
    setProducts,
    updateProduct,
    addProduct,
    removeProduct,
    updateCategoryGroup,
    addCategoryGroup,
    removeCategoryGroup,
    resetCatalog,
  ])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

export function buildBlankProduct(
  listingType: ListingType = 'rental',
): Product {
  const id = createId('p')
  return {
    id,
    itemName: 'New Equipment',
    itemCode: 'NEW-001',
    itemCategory: 'General',
    categorySlug: '',
    subcategorySlug: '',
    description: 'Add a description for this item.',
    vendorContact: '+91 00000 00000',
    hsnSacCode: '',
    price: 0,
    location: '',
    company: '',
    contact: 'email@example.com',
    images: ['/images/construction.jpg'],
    listingType,
    cardFields: [createEmptyRow()],
    sections: [
      createEmptySection('Item Details'),
      {
        id: createId('sec'),
        title: 'Description',
        type: 'text',
        text: 'Add a description for this item.',
        rows: [],
      },
      createEmptySection('Specifications'),
      createEmptySection('Supplier & Contact'),
    ],
    rating: 0,
    reviewCount: 0,
    responseRate: 0,
    yearsInBusiness: 0,
    trustBadge: 'Verified Supplier',
    companyLocation: '',
  }
}

const BLANK_SPEC_LABELS = [
  'Rental Unit',
  'Material',
  'Load Capacity',
  'Min. Hire Period',
  'Bay Width',
  'Lift Height',
  'Platform Type',
  'Safety Compliance',
  'Delivery Radius',
  'Erection Support',
]

/** Blank product shaped like the detail page — for Add Company creation flow. */
export function buildBlankDetailProduct(
  listingType: ListingType = 'rental',
): Product {
  const id = createId('p')
  const base: Product = {
    id,
    itemName: '',
    itemCode: '',
    itemCategory: '',
    categorySlug: '',
    subcategorySlug: '',
    description: '',
    vendorContact: '',
    hsnSacCode: '',
    price: 0,
    location: '',
    company: '',
    contact: '',
    images: ['/images/construction.jpg'],
    listingType,
    cardFields: BLANK_SPEC_LABELS.map((label) => ({
      id: createId('spec'),
      label,
      value: '',
    })),
    sections: [],
    rating: 0,
    reviewCount: 0,
    responseRate: 0,
    yearsInBusiness: 0,
    trustBadge: '',
    companyLocation: '',
  }
  return syncSectionsFromProduct(base)
}

export function buildBlankCategory(listingType: ListingType): CategoryGroup {
  return {
    id: createId('cat'),
    name: 'New Category Group',
    slug: `category-${Date.now()}`,
    image: '/images/construction.jpg',
    listingType,
    subcategories: [
      {
        id: createId('sub'),
        name: 'New Service',
        slug: `service-${Date.now()}`,
        image: '/images/construction.jpg',
        count: 0,
      },
    ],
  }
}

export type { DetailSection, FieldRow }
