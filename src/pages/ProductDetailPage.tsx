import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ImageGallery } from '../components/ImageGallery'
import { DetailSections } from '../components/DetailSections'
import { PageTopbar } from '../components/PageTopbar'
import { ImagesModal } from '../components/admin/ProductEditors'
import { useIsAdmin } from '../auth/useIsAdmin'
import { useData } from '../data/DataContext'
import {
  applyProductDescription,
  applyProductSectionRows,
} from '../data/normalize'
import type { FieldRow, ListingType, Product } from '../types'

function cloneProduct(product: Product): Product {
  return {
    ...product,
    cardFields: product.cardFields.map((field) => ({ ...field })),
    sections: product.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({ ...row })),
    })),
    images: [...product.images],
  }
}

export function ProductDetailPage() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const { getProductById, updateProduct } = useData()
  const product = getProductById(id)
  const isAdmin = useIsAdmin()
  const listingType: ListingType =
    params.get('type') === 'product' ? 'product' : 'rental'

  const [imagesOpen, setImagesOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftProduct, setDraftProduct] = useState<Product | null>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    setIsEditing(false)
    setDraftProduct(null)
  }, [id])

  if (!product) {
    return (
      <div className="page page--detail">
        <PageTopbar listingType={listingType} />
        <div className="empty-state">
          <h2>Product not found</h2>
          <p>
            <Link to="/">Return to home</Link>
          </p>
        </div>
      </div>
    )
  }

  const currentProduct = product
  const displayProduct = isEditing && draftProduct ? draftProduct : currentProduct

  function startEditing() {
    setDraftProduct(cloneProduct(currentProduct))
    setIsEditing(true)
  }

  function cancelEditing() {
    setDraftProduct(null)
    setIsEditing(false)
  }

  function saveChanges() {
    if (!draftProduct) return
    updateProduct(draftProduct)
    setDraftProduct(null)
    setIsEditing(false)
  }

  function handleSectionRowsChange(sectionTitle: string, rows: FieldRow[]) {
    setDraftProduct((prev) => {
      const base = prev ?? cloneProduct(currentProduct)
      return applyProductSectionRows(base, sectionTitle, rows)
    })
  }

  function handleDescriptionChange(text: string) {
    setDraftProduct((prev) => {
      const base = prev ?? cloneProduct(currentProduct)
      return applyProductDescription(base, text)
    })
  }

  return (
    <div className="page page--detail">
      <PageTopbar listingType={listingType} />

      <div className="detail-layout">
        <div className="detail-gallery-col">
          <ImageGallery
            images={currentProduct.images}
            alt={currentProduct.itemName}
            onManageImages={isAdmin ? () => setImagesOpen(true) : undefined}
          />
        </div>

        <div className="detail-panel">
          <div className="detail-tables detail-tables--flat">
            <DetailSections
              product={displayProduct}
              editable={isAdmin && isEditing}
              showEditButton={isAdmin && !isEditing}
              onStartEdit={startEditing}
              onSectionRowsChange={handleSectionRowsChange}
              onDescriptionChange={handleDescriptionChange}
            />
          </div>

          {isAdmin && isEditing && (
            <div className="detail-edit-actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={cancelEditing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn detail-edit-actions__save"
                onClick={saveChanges}
              >
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>

      {imagesOpen && (
        <ImagesModal
          images={currentProduct.images}
          onClose={() => setImagesOpen(false)}
          onSave={(images) => {
            updateProduct({ ...currentProduct, images })
            setImagesOpen(false)
          }}
        />
      )}
    </div>
  )
}
