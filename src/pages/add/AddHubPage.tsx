import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageTopbar } from '../../components/PageTopbar'
import type { ListingType } from '../../types'

function listingTypeFromParams(params: URLSearchParams): ListingType {
  return params.get('type') === 'product' ? 'product' : 'rental'
}

function typeQuery(type: ListingType) {
  return type === 'product' ? '?type=product' : ''
}

const ADD_OPTIONS = [
  {
    key: 'category',
    title: 'Category',
    description: 'Add a new category section on the homepage.',
    path: '/add/category',
  },
  {
    key: 'service',
    title: 'Service',
    description: 'Add a service inside an existing category.',
    path: '/add/service',
  },
  {
    key: 'company',
    title: 'Company',
    description: 'Add a company listing under a service.',
    path: '/add/company',
  },
] as const

export function AddHubPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const listingType = useMemo(() => listingTypeFromParams(params), [params])
  const query = typeQuery(listingType)

  return (
    <div className="page page--admin-form">
      <PageTopbar listingType={listingType} />

      <div className="admin-form-page admin-form-page--hub">
        <header className="admin-form-page__head">
          <h1>Add to EquipMart</h1>
          <p>Choose what you want to create.</p>
        </header>

        <div className="add-hub-grid">
          {ADD_OPTIONS.map((option) => (
            <Link
              key={option.key}
              to={`${option.path}${query}`}
              className="add-hub-card"
            >
              <h2>{option.title}</h2>
              <p>{option.description}</p>
              <span className="add-hub-card__cta">Continue →</span>
            </Link>
          ))}
        </div>

        <footer className="admin-form-page__foot admin-form-page__foot--hub">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => navigate(listingType === 'product' ? '/?type=product' : '/')}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  )
}
