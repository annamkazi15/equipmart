import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { CompanyTableView } from '../components/CompanyTableView'
import { PageTopbar } from '../components/PageTopbar'
import { EditablePageTitle } from '../components/EditablePageTitle'
import { ServiceModal } from '../components/admin/CategoryEditors'
import { useIsAdmin } from '../auth/useIsAdmin'
import { useData } from '../data/DataContext'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { getCategoryBySlug, getProductsBySubcategory, updateCategoryGroup } =
    useData()
  const isAdmin = useIsAdmin()
  const match = getCategoryBySlug(slug)
  const products = useMemo(
    () => getProductsBySubcategory(slug),
    [getProductsBySubcategory, slug],
  )
  const [view, setView] = useState<'grid' | 'list' | 'table'>('grid')
  const [editingService, setEditingService] = useState(false)

  if (!match) {
    return (
      <div className="page page--category">
        <PageTopbar listingType="rental" />
        <div className="empty-state">
          <h2>Category not found</h2>
          <p>The category you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const { group, subcategory } = match

  return (
    <div className="page page--category">
      <PageTopbar listingType={group.listingType} />

      <div className="category-page__title-row">
        <div className="category-page__title-left">
          <EditablePageTitle
            title={subcategory.name}
            editLabel="Edit service"
            editable={isAdmin}
            onEdit={() => setEditingService(true)}
          />
        </div>

        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={view === 'grid' ? 'active' : undefined}
            onClick={() => setView('grid')}
            aria-label="Grid view"
            title="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            className={view === 'list' ? 'active' : undefined}
            onClick={() => setView('list')}
            aria-label="List view"
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="2.5" rx="0.5" />
              <rect x="1" y="6.75" width="14" height="2.5" rx="0.5" />
              <rect x="1" y="11.5" width="14" height="2.5" rx="0.5" />
            </svg>
          </button>
          <button
            type="button"
            className={view === 'table' ? 'active' : undefined}
            onClick={() => setView('table')}
            aria-label="Company table view"
            title="Company table view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="14" height="3" rx="0.5" opacity="0.55" />
              <rect x="1" y="5.5" width="3.25" height="2" rx="0.35" />
              <rect x="5.25" y="5.5" width="3.25" height="2" rx="0.35" />
              <rect x="9.5" y="5.5" width="5.5" height="2" rx="0.35" />
              <rect x="1" y="8.75" width="3.25" height="2" rx="0.35" />
              <rect x="5.25" y="8.75" width="3.25" height="2" rx="0.35" />
              <rect x="9.5" y="8.75" width="5.5" height="2" rx="0.35" />
              <rect x="1" y="12" width="3.25" height="2" rx="0.35" />
              <rect x="5.25" y="12" width="3.25" height="2" rx="0.35" />
              <rect x="9.5" y="12" width="5.5" height="2" rx="0.35" />
            </svg>
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No listings in this category yet</h2>
          <p>
            {isAdmin
              ? 'Use Add on the homepage to create a company listing here.'
              : 'Try another category or switch between Rental and Purchase.'}
          </p>
        </div>
      ) : view === 'table' ? (
        <CompanyTableView products={products} />
      ) : (
        <div className={`product-grid${view === 'list' ? ' list' : ''}`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {editingService && (
        <ServiceModal
          initial={subcategory}
          onClose={() => setEditingService(false)}
          onDelete={() => {
            if (confirm('Delete this service?')) {
              updateCategoryGroup({
                ...group,
                subcategories: group.subcategories.filter(
                  (s) => s.id !== subcategory.id,
                ),
              })
              setEditingService(false)
              navigate('/', { replace: true })
            }
          }}
          onSave={(service) => {
            updateCategoryGroup({
              ...group,
              subcategories: group.subcategories.map((s) =>
                s.id === service.id ? service : s,
              ),
            })
            setEditingService(false)
            if (service.slug !== subcategory.slug) {
              navigate(`/category/${service.slug}`, { replace: true })
            }
          }}
        />
      )}
    </div>
  )
}
