import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { ProductCard } from '../components/ProductCard'
import { useData } from '../data/DataContext'
import type { ListingType } from '../types'

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const typeParam = params.get('type')
  const listingType: ListingType | undefined =
    typeParam === 'rental' || typeParam === 'product' ? typeParam : undefined
  const { searchProducts } = useData()

  const results = useMemo(
    () => searchProducts(q, listingType),
    [q, listingType, searchProducts],
  )

  return (
    <div className="page">
      <BackButton />

      <div className="category-page__title-row">
        <h1>
          Search results{' '}
          <span
            style={{
              color: 'var(--ink-muted)',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            ({results.length} found
            {listingType
              ? ` · ${listingType === 'product' ? 'Purchase' : 'Rental'}`
              : ''}
            )
          </span>
        </h1>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <h2>No matches</h2>
          <p>
            Try a different keyword or <Link to="/">browse categories</Link>.
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
