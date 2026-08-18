import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DetailSections } from '../../components/DetailSections'
import { ImageGallery } from '../../components/ImageGallery'
import { PageTopbar } from '../../components/PageTopbar'
import { Field } from '../../components/admin/AdminControls'
import { ImagesModal } from '../../components/admin/ProductEditors'
import {
  applyProductDescription,
  applyProductSectionRows,
  syncSectionsFromProduct,
} from '../../data/normalize'
import { buildBlankDetailProduct, useData } from '../../data/DataContext'
import type { FieldRow, ListingType, Product } from '../../types'

function listingTypeFromParams(params: URLSearchParams): ListingType {
  return params.get('type') === 'product' ? 'product' : 'rental'
}

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

function applyServiceToDraft(
  draft: Product,
  serviceName: string,
  serviceSlug: string,
  type: ListingType,
): Product {
  return syncSectionsFromProduct({
    ...draft,
    itemCategory: serviceName,
    subcategorySlug: serviceSlug,
    listingType: type,
  })
}

export function AddCompanyPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const listingType = useMemo(() => listingTypeFromParams(params), [params])
  const { categoryGroups, getGroupsByType, addProduct } = useData()
  const groups = useMemo(
    () => getGroupsByType(listingType),
    [getGroupsByType, listingType],
  )

  const [groupId, setGroupId] = useState('')
  const [serviceSlug, setServiceSlug] = useState('')
  const [draft, setDraft] = useState(() => buildBlankDetailProduct(listingType))
  const [isEditing, setIsEditing] = useState(false)
  const [editSnapshot, setEditSnapshot] = useState<Product | null>(null)
  const [imagesOpen, setImagesOpen] = useState(false)

  const selectedGroup = categoryGroups.find((group) => group.id === groupId)
  const services = selectedGroup?.subcategories ?? []
  const selectedService = services.find((service) => service.slug === serviceSlug)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (groups.length === 0) {
      setGroupId('')
      setServiceSlug('')
      return
    }

    const nextGroup =
      groups.find((group) => group.id === groupId) ?? groups[0]
    const nextService = nextGroup.subcategories[0]

    setGroupId(nextGroup.id)
    setServiceSlug(nextService?.slug ?? '')

    if (nextService) {
      setDraft((current) =>
        applyServiceToDraft(
          current,
          nextService.name,
          nextService.slug,
          nextGroup.listingType,
        ),
      )
    }
  }, [groups])

  function startEditing() {
    setEditSnapshot(cloneProduct(draft))
    setIsEditing(true)
  }

  function cancelEditing() {
    if (editSnapshot) setDraft(editSnapshot)
    setEditSnapshot(null)
    setIsEditing(false)
  }

  function handleGroupChange(nextGroupId: string) {
    if (isEditing) return
    setGroupId(nextGroupId)
    const group = categoryGroups.find((item) => item.id === nextGroupId)
    const service = group?.subcategories[0]
    setServiceSlug(service?.slug ?? '')
    if (group && service) {
      setDraft((current) =>
        applyServiceToDraft(
          current,
          service.name,
          service.slug,
          group.listingType,
        ),
      )
    }
  }

  function handleServiceChange(nextSlug: string) {
    if (isEditing) return
    setServiceSlug(nextSlug)
    if (!selectedGroup) return
    const service = selectedGroup.subcategories.find(
      (item) => item.slug === nextSlug,
    )
    if (service) {
      setDraft((current) =>
        applyServiceToDraft(
          current,
          service.name,
          service.slug,
          selectedGroup.listingType,
        ),
      )
    }
  }

  function handleSectionRowsChange(sectionTitle: string, rows: FieldRow[]) {
    setDraft((current) => applyProductSectionRows(current, sectionTitle, rows))
  }

  function handleDescriptionChange(text: string) {
    setDraft((current) => applyProductDescription(current, text))
  }

  function handleSave() {
    if (!selectedGroup || !selectedService) return
    addProduct({
      ...draft,
      subcategorySlug: selectedService.slug,
      itemCategory: selectedService.name,
      listingType: selectedGroup.listingType,
    })
    setEditSnapshot(null)
    setIsEditing(false)
    navigate(`/category/${selectedService.slug}`)
  }

  return (
    <div className="page page--detail page--add-company">
      <PageTopbar listingType={listingType} />

      <div className="add-company-context">
        <Field label="Category">
          <select
            value={groupId}
            onChange={(e) => handleGroupChange(e.target.value)}
            disabled={groups.length === 0 || isEditing}
          >
            {groups.length === 0 ? (
              <option value="">No categories available</option>
            ) : (
              groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))
            )}
          </select>
        </Field>
        <Field label="Service">
          <select
            value={serviceSlug}
            onChange={(e) => handleServiceChange(e.target.value)}
            disabled={services.length === 0 || isEditing}
          >
            {services.length === 0 ? (
              <option value="">No services in this category</option>
            ) : (
              services.map((service) => (
                <option key={service.id} value={service.slug}>
                  {service.name}
                </option>
              ))
            )}
          </select>
        </Field>
      </div>

      <div className="detail-layout">
        <div className="detail-gallery-col">
          <ImageGallery
            images={draft.images}
            alt={draft.itemName || 'New listing'}
            onManageImages={isEditing ? () => setImagesOpen(true) : undefined}
          />
        </div>

        <div className="detail-panel">
          <div className="detail-tables detail-tables--flat">
            <DetailSections
              product={draft}
              editable={isEditing}
              showEditButton={!isEditing}
              onStartEdit={startEditing}
              onSectionRowsChange={handleSectionRowsChange}
              onDescriptionChange={handleDescriptionChange}
            />
          </div>

          {isEditing && (
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
                onClick={handleSave}
              >
                Save company
              </button>
            </div>
          )}
        </div>
      </div>

      {imagesOpen && (
        <ImagesModal
          images={draft.images}
          onClose={() => setImagesOpen(false)}
          onSave={(images) => {
            setDraft((current) => ({ ...current, images }))
            setImagesOpen(false)
          }}
        />
      )}
    </div>
  )
}
